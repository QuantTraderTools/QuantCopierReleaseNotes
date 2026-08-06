#!/usr/bin/env node

/**
 * Fetch releases from GitHub API and generate releases.json
 * Usage: node fetch-github-releases.js
 * 
 * Fetches all releases from QuantTraderTools/QuantCopierUI and converts to releases.json format
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const OWNER = 'QuantTraderTools';
const REPO = 'QuantCopierUI';
const OUTPUT_FILE = path.join(__dirname, '../public/releases.json');

/**
 * Fetch releases from GitHub API
 */
function fetchGitHubReleases() {
  return new Promise((resolve, reject) => {
    const token = process.env.FRONTEND_REPO_TOKEN || process.env.GITHUB_TOKEN;
    
    if (token) {
      console.log(`🔑 Using GitHub token for authentication (length: ${token.length})`);
    } else {
      console.log('⚠️ No GitHub token found in environment variables (FRONTEND_REPO_TOKEN or GITHUB_TOKEN). Attempting unauthenticated request...');
    }

    const options = {
      hostname: 'api.github.com',
      path: `/repos/${OWNER}/${REPO}/releases`,
      method: 'GET',
      headers: {
        'User-Agent': 'QuantCopier-Release-Notes',
        'Accept': 'application/vnd.github.v3+json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    };

    https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error(`Failed to parse GitHub API response: ${e.message}`));
          }
        } else {
          reject(new Error(`GitHub API returned ${res.statusCode}: ${data}`));
        }
      });
    }).on('error', reject).end();
  });
}

/**
 * Parse release body for structured sections
 */
function parseReleaseBody(body) {
  const sections = {
    features: /##?\s*(?:new features?|features?|what's new|additions?)/i,
    fixes: /##?\s*(?:bug fixes?|fixes?|fixed|hotfixes?)/i,
    improvements: /##?\s*(?:improvements?|enhancements?|improved|performance)/i,
  };

  const result = {
    features: [],
    fixes: [],
    improvements: []
  };

  if (!body || body.trim() === '' || body === '## Changes in v') {
    return result;
  }

  let currentSection = null;
  const lines = body.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();

    // Check if this line starts a new section
    for (const [section, regex] of Object.entries(sections)) {
      if (regex.test(trimmed)) {
        currentSection = section;
        continue;
      }
    }

    // If we're in a section and this is a list item
    if (currentSection && (trimmed.startsWith('-') || trimmed.startsWith('*'))) {
      const item = trimmed.slice(1).trim();
      if (item) {
        result[currentSection].push(item);
      }
    }
  }

  return result;
}

/**
 * Convert GitHub release to our format
 */
function convertRelease(ghRelease) {
  const { features, fixes, improvements } = parseReleaseBody(ghRelease.body || '');

  // Extract version from tag (v1.2.3 -> 1.2.3, telegram-v1.2.3 -> 1.2.3)
  const version = ghRelease.tag_name.replace(/^(telegram-v|v)/, '');

  return {
    version,
    title: ghRelease.name || ghRelease.tag_name,
    date: ghRelease.published_at ? new Date(ghRelease.published_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    prerelease: ghRelease.prerelease,
    draft: ghRelease.draft,
    features: features.length > 0 ? features : [],
    fixes: fixes.length > 0 ? fixes : [],
    improvements: improvements.length > 0 ? improvements : [],
    url: ghRelease.html_url,
    body: ghRelease.body || ''
  };
}

/**
 * Main function
 */
async function main() {
  try {
    console.log(`📦 Fetching releases from ${OWNER}/${REPO}...`);
    
    let releases = [];
    try {
      releases = await fetchGitHubReleases();
    } catch (err) {
      console.warn(`⚠️ Failed to fetch from GitHub API: ${err.message}. Falling back to local only.`);
    }

    let converted = releases
      .filter(ghRelease => ghRelease.tag_name.startsWith('telegram-'))
      .map(ghRelease => {
        // Handle both 'telegram-vX.X.X' and 'vX.X.X' tags
        const isTelegramTag = ghRelease.tag_name.startsWith('telegram-v');
        const rawVersion = ghRelease.tag_name.replace(/^(telegram-v|v)/, '');
        return {
          ...convertRelease(ghRelease),
          version: rawVersion,
          isTelegramTag: isTelegramTag
        };
      });

    // Deduplicate: If we have both telegram-v0.1.6 and v0.1.6, keep the telegram one!
    const uniqueReleases = new Map();
    converted.forEach(r => {
      if (!uniqueReleases.has(r.version) || r.isTelegramTag) {
        uniqueReleases.set(r.version, r);
      }
    });
    converted = Array.from(uniqueReleases.values());

    // Read local files
    const fs = require('fs');
    const path = require('path');
    const versionPath = path.resolve(process.cwd(), 'VERSION');
    const notesPath = path.resolve(process.cwd(), 'md_docs', 'LATEST_RELEASE.md');
    
    let localVersion = null;
    let localNotes = '';
    
    if (fs.existsSync(versionPath) && fs.existsSync(notesPath)) {
      localVersion = fs.readFileSync(versionPath, 'utf8').trim();
      localNotes = fs.readFileSync(notesPath, 'utf8');
      
      const { features, fixes, improvements } = parseReleaseBody(localNotes);
      
      const localRelease = {
        version: localVersion,
        title: `Release v${localVersion}`,
        date: new Date().toISOString().split('T')[0],
        prerelease: false,
        draft: false,
        features: features.length > 0 ? features : [],
        fixes: fixes.length > 0 ? fixes : [],
        improvements: improvements.length > 0 ? improvements : [],
        url: '',
        body: localNotes
      };
      
      // Inject or replace the local release into the list
      const existingIndex = converted.findIndex(r => r.version === localVersion);
      if (existingIndex >= 0) {
        // Keep the API url and date if available, but overwrite the notes
        localRelease.url = converted[existingIndex].url || '';
        localRelease.date = converted[existingIndex].date || localRelease.date;
        converted[existingIndex] = localRelease;
        console.log(`✓ Overwrote release v${localVersion} with local Telegram notes`);
      } else {
        converted.unshift(localRelease);
        console.log(`✓ Injected local release v${localVersion}`);
      }
      
      // Filter out any newer releases from GitHub API that haven't been released on Telegram yet
      converted = converted.filter(r => {
        return r.version.localeCompare(localVersion, undefined, { numeric: true, sensitivity: 'base' }) <= 0;
      });
      
    } else {
      console.warn('⚠️ Could not find local VERSION or LATEST_RELEASE.md files.');
    }

    // Filter out drafts if needed
    const published = converted.filter(r => !r.draft);

    // Sort by version (newest first)
    published.sort((a, b) => b.version.localeCompare(a.version, undefined, { numeric: true }));

    // Create public directory if it doesn't exist
    const publicDir = path.resolve(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    // Save to public/releases.json
    const outputFile = path.resolve(publicDir, 'releases.json');
    fs.writeFileSync(outputFile, JSON.stringify({ releases: published }, null, 2));
    
    console.log(`✅ Successfully generated ${outputFile} with ${published.length} release(s)`);
  } catch (error) {
    console.error('❌ Error in build script:', error);
    process.exit(1);
  }
}

main();
