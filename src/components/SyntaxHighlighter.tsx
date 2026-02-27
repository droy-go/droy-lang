interface SyntaxHighlighterProps {
  code: string;
  language?: 'droy' | 'c' | 'llvm';
}

export function SyntaxHighlighter({ code, language = 'droy' }: SyntaxHighlighterProps) {
  const highlightCode = () => {
    if (!code) return '';

    let highlighted = code;

    if (language === 'c') {
      // C language highlighting
      highlighted = highlighted
        // Preprocessor directives
        .replace(/^(#\s*(include|define|ifdef|ifndef|endif|pragma).*)/gm, 
          '<span class="text-cyan-400">$1</span>')
        // Keywords
        .replace(/\b(int|void|char|float|double|bool|return|if|else|for|while|struct|typedef|const|static|extern|sizeof|NULL|true|false)\b/g, 
          '<span class="text-purple-400">$1</span>')
        // Functions
        .replace(/\b([a-zA-Z_]\w*)\s*(?=\()/g, 
          '<span class="text-yellow-400">$1</span>')
        // Strings
        .replace(/("[^"]*")/g, 
          '<span class="text-green-400">$1</span>')
        // Numbers
        .replace(/\b(\d+\.?\d*)\b/g, 
          '<span class="text-orange-400">$1</span>')
        // Comments
        .replace(/(\/\/.*$|\/\*[\s\S]*?\*\/)/gm, 
          '<span class="text-slate-500">$1</span>')
        // Types
        .replace(/\b(int|char|float|double|void|bool)\b/g, 
          '<span class="text-blue-400">$1</span>');
    } else if (language === 'llvm') {
      // LLVM IR highlighting
      highlighted = highlighted
        // Module declarations
        .replace(/^(;.*)/gm, 
          '<span class="text-slate-500">$1</span>')
        // Keywords
        .replace(/\b(define|declare|global|constant|private|internal|external|linkonce|weak|appending|unnamed_addr|local_unnamed_addr)\b/g, 
          '<span class="text-purple-400">$1</span>')
        // Types
        .replace(/\b(i\d+|float|double|void|label|metadata|x86_fp80|ppc_fp128)\b/g, 
          '<span class="text-blue-400">$1</span>')
        // Instructions
        .replace(/\b(alloca|load|store|getelementptr|call|ret|br|switch|indirectbr|invoke|resume|unreachable|add|sub|mul|sdiv|udiv|urem|srem|fadd|fsub|fmul|fdiv|shl|lshr|ashr|and|or|xor|icmp|fcmp|phi|select|va_arg|landingpad)\b/g, 
          '<span class="text-yellow-400">$1</span>')
        // Attributes
        .replace(/(\#\d+|attributes\s+#\d+)/g, 
          '<span class="text-cyan-400">$1</span>')
        // Strings
        .replace(/("[^"]*")/g, 
          '<span class="text-green-400">$1</span>')
        // Labels
        .replace(/(\w+):/g, 
          '<span class="text-orange-400">$1:</span>')
        // Variables
        .replace(/(%\w+|@\w+)/g, 
          '<span class="text-indigo-400">$1</span>');
    } else {
      // Droy language highlighting
      highlighted = highlighted
        // New string syntax: ~s=p*hello
        .replace(/(~s=p\*)(\w+)/g, 
          '<span class="text-indigo-400">$1</span><span class="text-green-400">$2</span>')
        // Shorthand operators: ~s, ~g
        .replace(/(~s|~g)\b/g, 
          '<span class="text-indigo-400">$1</span>')
        // Keywords
        .replace(/\b(set|get|var|func|return|if|else|for|while|print|input|link|array|class|import|export|true|false|null)\b/g, 
          '<span class="text-purple-400">$1</span>')
        // Strings
        .replace(/("[^"]*"|'[^']*')/g, 
          '<span class="text-green-400">$1</span>')
        // Numbers
        .replace(/\b(\d+\.?\d*)\b/g, 
          '<span class="text-orange-400">$1</span>')
        // Comments
        .replace(/(#.*)$/gm, 
          '<span class="text-slate-500">$1</span>')
        // Operators
        .replace(/(\+|-|\*|\/|%|=|==|!=|<|>|<=|>=|&&|\|\||!)/g, 
          '<span class="text-cyan-400">$1</span>')
        // Brackets and punctuation
        .replace(/([\(\)\{\}\[\]\,\.\:])/g, 
          '<span class="text-slate-400">$1</span>');
    }

    return highlighted;
  };

  return (
    <pre
      className="font-mono text-sm leading-6 whitespace-pre-wrap break-words"
      style={{
        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, monospace',
      }}
      dangerouslySetInnerHTML={{ __html: highlightCode() }}
    />
  );
}
