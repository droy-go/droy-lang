import { useEffect, useRef, useState } from 'react';
import { DroyCompiler } from '@/lib/droy/compiler';

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
}

export function CodeEditor({ code, onChange }: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLPreElement>(null);
  const [tokens, setTokens] = useState<any[]>([]);

  useEffect(() => {
    const compiler = new DroyCompiler();
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
      // Simple syntax highlighting based on patterns
      // Keywords
      line = line.replace(/\b(set|get|var|func|return|if|else|for|while|print|input|link|array|class|import|export|true|false|null)\b/g, 
        '<span class="text-purple-400">$1</span>');
      
      // New string syntax: ~s=p*hello
      line = line.replace(/(~s=p\*)(\w+)/g, 
        '<span class="text-indigo-400">$1</span><span class="text-green-400">$2</span>');
      
      // Shorthand operators: ~s, ~g
      line = line.replace(/(~s|~g)\b/g, 
        '<span class="text-indigo-400">$1</span>');
      
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
      line = line.replace(/(\+|-|\*|\/|%|=|==|!=|<|>|<=|>=|&&|\|\||!)/g, 
        '<span class="text-cyan-400">$1</span>');
      
      // Brackets and punctuation
      line = line.replace(/([\(\)\{\}\[\]\,\.\:])/g, 
        '<span class="text-slate-400">$1</span>');
      
      return line;
    }).join('\n');
  };

  return (
    <div className="relative w-full h-full min-h-[400px]">
      {/* Highlighted code layer */}
      <pre
        ref={highlightRef}
        className="absolute inset-0 m-0 p-4 font-mono text-sm leading-6 text-slate-300 whitespace-pre-wrap break-words overflow-auto pointer-events-none"
        style={{
          fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, monospace',
        }}
        dangerouslySetInnerHTML={{ __html: getHighlightedCode() }}
      />
      
      {/* Input textarea */}
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
