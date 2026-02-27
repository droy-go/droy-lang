import { useEffect, useRef, useState } from 'react';
import { DroyCompilerV3 } from '@/lib/droy/compiler-v3';

interface CodeEditorV3Props {
  code: string;
  onChange: (code: string) => void;
}

export function CodeEditorV3({ code, onChange }: CodeEditorV3Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLPreElement>(null);
  const [tokens, setTokens] = useState<any[]>([]);

  useEffect(() => {
    const compiler = new DroyCompilerV3();
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
      // SET / SETUP
      line = line.replace(/\b(set|setup)\b(=)([a-zA-Z_][a-zA-Z0-9_-]*)/g, 
        '<span class="text-purple-400">$1</span><span class="text-slate-300">$2</span><span class="text-blue-300">$3</span>');
      
      // TOOL
      line = line.replace(/\b(tool)(=?)([a-zA-Z_][a-zA-Z0-9_-]*)?/g, 
        '<span class="text-purple-400">$1</span><span class="text-slate-300">$2</span><span class="text-blue-300">$3</span>');
      
      // GET_SET, VALUE_SET, TOOL_SET
      line = line.replace(/\b(GET_SET|VALUE_SET|TOOL_SET)\b/g, 
        '<span class="text-purple-400">$1</span>');
      
      // value-set with operations
      line = line.replace(/(value-set)(=)(\()/g, 
        '<span class="text-purple-400">$1</span><span class="text-slate-300">$2</span><span class="text-yellow-400">$3</span>');
      
      // DATA
      line = line.replace(/\b(data)\b/g, 
        '<span class="text-green-400">$1</span>');
      
      // SERVER
      line = line.replace(/\b(server)\b(=?)/g, 
        '<span class="text-orange-400">$1</span><span class="text-slate-300">$2</span>');
      
      // Group / ID / Name
      line = line.replace(/\b(group|id|name)\b(=)([a-zA-Z_][a-zA-Z0-9_-]*)/g, 
        '<span class="text-cyan-400">$1</span><span class="text-slate-300">$2</span><span class="text-blue-300">$3</span>');
      
      // UI Components: ~topbar, ~sidebar, etc.
      line = line.replace(/(~)(topbar|sidebar|header|footer|nav|menu|btn|img|image|video|audio|icon|text|title|subtitle|container|grid|flex|row|col|column|card|modal|toast|tooltip|color|bg|background)\b/g, 
        '<span class="text-cyan-400">$1$2</span>');
      
      // Events: @click, @hover, etc.
      line = line.replace(/(@)(click|hover|focus|blur|keydown|keyup|submit|change|on|off)\b/g, 
        '<span class="text-orange-400">$1$2</span>');
      
      // Keywords
      line = line.replace(/\b(set|get|var|func|return|if|else|for|while|print|input|link|array|class|import|export|bind|ref|watch|emit|fetch|post|put|delete|patch|ws|blend|gradient|theme|mode|math|calc|random|round|floor|ceil|abs|min|max|sum|avg|count)\b/g, 
        '<span class="text-pink-400">$1</span>');
      
      // Layout properties
      line = line.replace(/\b(width|height|padding|margin|border|radius|shadow|opacity|size|position|top|left|right|bottom|z_index|display|visible|hidden|cols|gap|align|justify|autoplay|loop|muted|controls)\b/g, 
        '<span class="text-yellow-400">$1</span>');
      
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
      line = line.replace(/(\+|-|\*|\/|%|\*\*|==|!=|<=|>=|<|>|&&|\|\||!|=|:|=>|\|>|\{|\}|\[|\])/g, 
        '<span class="text-slate-300">$1</span>');
      
      // Parentheses in value-set
      line = line.replace(/(\(|\))/g, 
        '<span class="text-yellow-400">$1</span>');
      
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
