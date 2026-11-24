import React from 'react';

interface FormattedMarkdownProps {
  content: string;
}

export function FormattedMarkdown({ content }: FormattedMarkdownProps) {
  if (!content) return null;

  // Replace common LaTeX arrows like $\rightarrow$ with Unicode arrow →
  const replaced = content.replace(/\$\\rightarrow\$/g, '→').replace(/\\rightarrow/g, '→');

  // Tokenize bold (**text**), inline code (`code`), and links ([text](url))
  const tokens = replaced.split(/(\*\*.*?\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g).filter(Boolean);

  return (
    <span>
      {tokens.map((token, idx) => {
        // Bold: **text**
        if (token.startsWith('**') && token.endsWith('**') && token.length >= 4) {
          const inner = token.slice(2, -2);
          return (
            <strong key={idx} className="font-semibold text-slate-900 dark:text-white">
              {inner}
            </strong>
          );
        }

        // Inline Code: `code`
        if (token.startsWith('`') && token.endsWith('`') && token.length >= 2) {
          const inner = token.slice(1, -1);
          return (
            <code
              key={idx}
              className="px-1.5 py-0.5 mx-0.5 rounded text-xs font-mono font-medium bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-slate-700"
            >
              {inner}
            </code>
          );
        }

        // Link: [text](url)
        const linkMatch = token.match(/^\[(.*?)\]\((.*?)\)$/);
        if (linkMatch) {
          return (
            <a
              key={idx}
              href={linkMatch[2]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 underline hover:text-blue-700 dark:hover:text-blue-300"
            >
              {linkMatch[1]}
            </a>
          );
        }

        return <React.Fragment key={idx}>{token}</React.Fragment>;
      })}
    </span>
  );
}
