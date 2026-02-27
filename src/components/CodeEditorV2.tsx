import { useEffect, useRef, useState } from 'react';
import { DroyCompilerV2 } from '@/lib/droy/compiler-v2';

interface CodeEditorV2Props {
  code: string;
  onChange: (code: string) => void;
}

export function CodeEditorV2({ code, onChange }: CodeEditorV2Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLPreElement>(null);
  const [tokens, setTokens] = useState<any[]>([]);

  useEffect(() => {
    const compiler = new DroyCompilerV2();
    const result = compiler.tokenize(code);
    setTokens(result);
  }, [code]);

  useEffect(() => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  }, [code]);

  const handleScroll = () => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  const getHighlightedCode = () => {
    if (!tokens.length) return code;

    const sourceLines = code.split('\n');
    
    return sourceLines.map((line) => {
      // UI Components: ~btn, ~img, etc.
      line = line.replace(/(~)(btn|button|img|image|video|audio|icon|text|title|subtitle|container|grid|flex|row|col|column|card|modal|toast|tooltip|color|bg|background)\b/g, 
        '<span class="text-purple-400">$1$2</span>');
      
      // Shorthand: ~s, ~g
      line = line.replace(/(~s|~g)\b/g, 
        '<span class="text-indigo-400">$1</span>');
      
      // Events: @click, @hover, etc.
      line = line.replace(/(@)(click|hover|focus|blur|keydown|keyup|submit|change|on|off)\b/g, 
        '<span class="text-orange-400">$1$2</span>');
      
      // Keywords
      line = line.replace(/\b(set|get|var|func|return|if|else|for|while|print|input|link|array|class|import|export|bind|ref|key|animate|transition|duration|delay|easing)\b/g, 
        '<span class="text-cyan-400">$1</span>');
      
      // Layout properties
      line = line.replace(/\b(width|height|padding|margin|border|radius|shadow|opacity|size|position|top|left|right|bottom|cols|gap|align|justify)\b/g, 
        '<span class="text-pink-400">$1</span>');
      
      // Hex colors
      line = line.replace(/(#[0-9a-fA-F]{3,6})/g, 
        '<span class="text-yellow-400">$1</span>');
      
      // Strings
      line = line.replace(/("[^"]*"|'[^']*')/g, 
        '<span class="text-green-400">$1</span>');
      
      // Numbers
      line = line.replace(/\b(\d+\.?\d*)\b/g, 
        '<span class="text-orange-400">$1</span>');
      
      // Comments
      line = line.replace(/(#.*)$/g, 
        '<span class="text-slate-500">$1</span>');
      
      // Operators
      line = line.replace(/(\+|-|\*|\/|%|=|==|!=|<|>|<=|>=|&&|\|\||!|:|=>|\{|\})/g, 
        '<span class="text-slate-300">$1</span>');
      
      // Colon assignment (shorthand syntax)
      line = line.replace(/(\w+)(\s*:)(\s+)/g, 
        '<span class="text-blue-300">$1</span><span class="text-slate-300">$2</span>$3');
      
      return line;
    }).join('\n');
  };

  return (
    <div className="relative w-full h-full min-h-[500px]">
      <pre
        ref={highlightRef}
        className="absolute inset-0 m-0 p-4 font-mono text-sm leading-6 text-slate-300 whitespace-pre-wrap break-words overflow-auto pointer-events-none"
        style={{
          fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, monospace',
        }}
        dangerouslySetInnerHTML={{ __html: getHighlightedCode() }}
      />
      
      <textarea
        ref={textareaRef}
        value={code}
        onChange={(e) => onChange(e.target.value)}
        onScroll={handleScroll}
        className="absolute inset-0 w-full h-full p-4 font-mono text-sm leading-6 text-transparent bg-transparent caret-white resize-none focus:outline-none"
        style={{
          fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, monospace',
        }}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
      />
    </div>
  );
}
