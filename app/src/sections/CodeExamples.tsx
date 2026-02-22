import { useEffect, useRef, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Check, Play } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const codeExamples = {
  'hello-world': {
    title: 'Hello World',
    code: `~s @si = "Hello"
~s @ui = "World"
em @si + " " + @ui + "!"`,
    output: 'Hello World!',
  },
  variables: {
    title: 'Variables',
    code: `// Standard variable declaration
set name = "Droy"
set version = "1.0.0"
set count = 42

// Shorthand syntax
~s @si = 100
~s @ui = 200
~s @yui = "Dynamic"

em name + " v" + version
em "Count: " + count`,
    output: 'Droy v1.0.0\nCount: 42',
  },
  functions: {
    title: 'Functions',
    code: `// Function declaration
f greet(name) {
    ret "Hello, " + name
}

f calculate(x, y, operation) {
    fe (operation == "add") {
        ret x + y
    }
    fe (operation == "multiply") {
        ret x * y
    }
    ret "Unknown"
}

em greet("Droy")
em calculate(10, 5, "add")
em calculate(10, 5, "multiply")`,
    output: 'Hello, Droy\n15\n50',
  },
  links: {
    title: 'Links',
    code: `// Create links
link id: "google" api: "https://google.com"
link id: "github" api: "https://github.com"
link id: "docs" api: "https://docs.droy-lang.org"

// Open links
create-link: "google"
open-link: "google"

// Extended links
yoex--links id: "external" api: "https://external.com"

em "Links created successfully!"`,
    output: 'Links created successfully!',
  },
};

export default function CodeExamples() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('hello-world');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        terminalRef.current,
        { opacity: 0, y: 100, rotateX: 20 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: terminalRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeExamples[activeTab as keyof typeof codeExamples].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderCode = (code: string) => {
    return code.split('\n').map((line, i) => {
      // Highlight comments
      if (line.trim().startsWith('//')) {
        return (
          <div key={i} className="syntax-comment">
            {line}
          </div>
        );
      }

      // Highlight keywords and syntax
      let highlighted = line
        .replace(/(\~s|set|em|ret|fe|f|for|link|create-link|open-link|yoex--links)/g, '<span class="syntax-keyword">$1</span>')
        .replace(/(@\w+)/g, '<span class="syntax-variable">$1</span>')
        .replace(/(".*?")/g, '<span class="syntax-string">$1</span>')
        .replace(/(\d+)/g, '<span class="syntax-number">$1</span>')
        .replace(/(f\s+)(\w+)/g, '$1<span class="syntax-function">$2</span>');

      return (
        <div
          key={i}
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      );
    });
  };

  return (
    <section
      ref={sectionRef}
      id="examples"
      className="relative py-32 bg-[#0a0a0a]"
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#4169e1]/5 rounded-full blur-[200px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#ff6b35]/5 rounded-full blur-[200px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6">
            Write less, do{' '}
            <span className="text-gradient">more</span>
          </h2>
          <p className="text-xl text-[#a0a0a0] max-w-2xl mx-auto">
            Expressive syntax that makes coding intuitive and powerful.
          </p>
        </div>

        {/* Terminal */}
        <div
          ref={terminalRef}
          className="relative"
          style={{ perspective: '1000px' }}
        >
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="bg-[#111] rounded-xl border border-[#333] overflow-hidden glow-orange">
              {/* Terminal Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-[#1a1a1a] border-b border-[#333]">
                <TabsList className="bg-transparent border-0 p-0 gap-2">
                  {Object.entries(codeExamples).map(([key, example]) => (
                    <TabsTrigger
                      key={key}
                      value={key}
                      className="data-[state=active]:bg-[#ff6b35]/20 data-[state=active]:text-[#ff6b35] text-[#666] px-4 py-2 text-sm rounded-lg transition-all duration-300"
                    >
                      {example.title}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="p-2 text-[#666] hover:text-[#ff6b35] transition-colors rounded-lg hover:bg-[#ff6b35]/10"
                  >
                    {copied ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Terminal Content */}
              <div className="grid lg:grid-cols-2">
                {/* Code */}
                <div className="p-6 font-mono text-sm leading-relaxed border-r border-[#333] min-h-[400px]">
                  {Object.entries(codeExamples).map(([key, example]) => (
                    <TabsContent
                      key={key}
                      value={key}
                      className="mt-0 animate-in fade-in slide-in-from-left-4 duration-300"
                    >
                      {renderCode(example.code)}
                    </TabsContent>
                  ))}
                </div>

                {/* Output */}
                <div className="p-6 bg-[#0a0a0a] min-h-[400px]">
                  <div className="flex items-center gap-2 mb-4">
                    <Play className="w-4 h-4 text-[#ff6b35]" />
                    <span className="text-sm text-[#666]">Output</span>
                  </div>
                  {Object.entries(codeExamples).map(([key, example]) => (
                    <TabsContent
                      key={key}
                      value={key}
                      className="mt-0 animate-in fade-in slide-in-from-right-4 duration-300"
                    >
                      <div className="font-mono text-sm text-[#7ee787] whitespace-pre-line">
                        {example.output}
                      </div>
                    </TabsContent>
                  ))}
                </div>
              </div>
            </div>
          </Tabs>

          {/* Decorative Elements */}
          <div className="absolute -top-4 -right-4 w-32 h-32 bg-[#ff6b35]/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-4 -left-4 w-40 h-40 bg-[#4169e1]/10 rounded-full blur-2xl" />
        </div>
      </div>
    </section>
  );
}
