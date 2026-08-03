/**
 * GitHub API utilities
 * Fetches and parses GitHub releases
 */



export interface Release {
  version: string;
  title: string;
  date: string;
  prerelease: boolean;
  draft: boolean;
  sections: Record<string, string[]>;
  url: string;
  body: string;
}

export async function fetchGitHubReleases(): Promise<Release[]> {
  try {
    const response = await fetch('/releases.json', {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch releases.json: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Map the simplified format from releases.json to the full Release interface
    return data.releases.map((release: any) => {
      // Reconstruct the sections object
      const sections: Record<string, string[]> = {};
      
      if (release.features && release.features.length > 0) {
        sections.features = release.features;
      }
      if (release.fixes && release.fixes.length > 0) {
        sections.fixes = release.fixes;
      }
      if (release.improvements && release.improvements.length > 0) {
        sections.improvements = release.improvements;
      }
      if (release.breaking && release.breaking.length > 0) {
        sections.breaking = release.breaking;
      }
      if (release.security && release.security.length > 0) {
        sections.security = release.security;
      }

      return {
        ...release,
        sections
      };
    });
  } catch (error) {
    console.error('Failed to fetch releases:', error);
    return [];
  }
}


