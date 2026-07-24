const fs = require('fs');
let code = fs.readFileSync('app/nlyk/page.tsx', 'utf8');

const iframeCode = `
      {/* YouTube Music - Hidden iframe that plays after interaction */}
      {isPlaying && (
        <div className="absolute top-0 left-0 w-1 h-1 overflow-hidden opacity-0 pointer-events-none z-0">
          <iframe
            width="1"
            height="1"
            src="https://www.youtube.com/embed/xeOttl1d2bo?autoplay=1&loop=1&playlist=xeOttl1d2bo"
            title="YouTube Music"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
`;

code = code.replace(/\s*\{\/\* YouTube Music - Continue playing \*\/\}\s*\{isPlaying && \(\s*<div className="absolute top-0 left-0 w-1 h-1 overflow-hidden opacity-0 pointer-events-none">\s*<iframe\s*width="1"\s*height="1"\s*src="https:\/\/www\.youtube\.com\/embed\/xeOttl1d2bo\?autoplay=1&loop=1&playlist=xeOttl1d2bo"\s*title="YouTube Music"\s*frameBorder="0"\s*allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"\s*allowFullScreen\s*\/>\s*<\/div>\s*\)\}/, '');
code = code.replace(/\s*\{\/\* YouTube Music - Hidden iframe that plays after interaction \*\/\}\s*\{isPlaying && \(\s*<div className="absolute top-0 left-0 w-1 h-1 overflow-hidden opacity-0 pointer-events-none">\s*<iframe\s*width="1"\s*height="1"\s*src="https:\/\/www\.youtube\.com\/embed\/xeOttl1d2bo\?autoplay=1&loop=1&playlist=xeOttl1d2bo"\s*title="YouTube Music"\s*frameBorder="0"\s*allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"\s*allowFullScreen\s*\/>\s*<\/div>\s*\)\}/, '');

const returnPattern = /  if \(showSuccess\) \{[\s\S]*?  return \(/;
code = code.replace(returnPattern, '  return (\n    <>\n' + iframeCode + '\n      {showSuccess ? (');

code = code.replace(/      <\/div>\n    \);\n  \}\n\n  return \(\n    <div/, '      </div>\n      ) : (\n      <div');

code = code.replace(/      <\/style>\n    <\/div>\n  \);\n\}/, '      </style>\n    </div>\n    )}</>\n  );\n}');

fs.writeFileSync('app/nlyk/page.tsx', code);
console.log('Refactored page.tsx');
