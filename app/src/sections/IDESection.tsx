import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ExternalLink, Code2, Terminal, Cpu, Zap, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Dialog, DialogContent } from '@/components/ui/dialog';

gsap.registerPlugin(ScrollTrigger);

// Lazy load the IDE component
const DroyIDE = () => import('@/components/DroyIDE').then(m => m.default);

export default function IDESection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [ideOpen, setIdeOpen] = useState(false);
  const [DroyIDEComponent, setDroyIDEComponent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Load IDE component when dialog opens
  useEffect(() => {
    if (ideOpen && !DroyIDEComponent) {
      DroyIDE().then(Component => {
        setDroyIDEComponent(() => Component);
      });
    }
  }, [ideOpen, DroyIDEComponent]);

  return (
    <section
      ref={sectionRef}
      id="ide"
      className="relative py-32 bg-[#0a0a0a]"
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#ff6b35]/5 rounded-full blur-[200px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#4169e1]/5 rounded-full blur-[200px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={contentRef}>
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#ff6b35]/10 rounded-full border border-[#ff6b35]/20 mb-6">
              <Sparkles className="w-4 h-4 text-[#ff6b35]" />
              <span className="text-sm text-[#ff6b35]">Professional IDE</span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6">
              Droy <span className="text-gradient">Studio</span>
            </h2>

            <p className="text-xl text-[#a0a0a0] max-w-2xl mx-auto mb-8">
              A full-featured integrated development environment for Droy Language. 
              Write, debug, and compile your code with professional tools.
            </p>

            {/* CTA */}
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                onClick={() => setIdeOpen(true)}
                className="bg-[#ff6b35] hover:bg-[#ff6b35]/90 text-white px-8 py-6 text-lg font-semibold glow-orange transition-all duration-300 hover:scale-105"
              >
                <Code2 className="w-5 h-5 mr-2" />
                Launch IDE
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => window.open('https://github.com/droy-go/droy-lang', '_blank')}
                className="border-[#333] hover:border-[#ff6b35]/50 text-white px-8 py-6 text-lg font-semibold transition-all duration-300 hover:bg-[#ff6b35]/10"
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                View on GitHub
              </Button>
            </div>
          </div>

          {/* IDE Preview */}
          <div className="relative rounded-xl overflow-hidden border border-[#333] glow-orange">
            {/* Mock IDE Interface */}
            <div className="bg-[#0d1117] aspect-video">
              {/* Top Bar */}
              <div className="h-10 bg-[#161b22] border-b border-[#30363d] flex items-center px-4">
                <div className="flex items-center gap-2">
                  <img src="/logo.png" alt="Droy" className="w-5 h-5" />
                  <span className="font-bold text-white text-sm">Droy Studio</span>
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="flex items-center gap-1 bg-[#010409] rounded-md px-3 py-1">
                    <span className="text-xs text-[#8b949e]">main.droy</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#238636]" />
                </div>
              </div>

              {/* Main Area */}
              <div className="flex h-[calc(100%-80px)]">
                {/* Sidebar */}
                <div className="w-48 bg-[#0d1117] border-r border-[#30363d] p-3 hidden sm:block">
                  <div className="text-xs text-[#8b949e] mb-2 uppercase tracking-wider">Explorer</div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 px-2 py-1 bg-[#1f6feb] text-white rounded text-sm">
                      <Code2 className="w-4 h-4" />
                      main.droy
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1 text-[#8b949e] text-sm">
                      <Code2 className="w-4 h-4" />
                      functions.droy
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1 text-[#8b949e] text-sm">
                      <Code2 className="w-4 h-4" />
                      links.droy
                    </div>
                  </div>
                </div>

                {/* Editor */}
                <div className="flex-1 bg-[#0d1117] p-4 font-mono text-sm">
                  <div className="text-[#ff6b35]">~s <span className="text-[#79c0ff]">@si</span> = <span className="text-[#7ee787]">&quot;Hello&quot;</span></div>
                  <div className="text-[#ff6b35]">~s <span className="text-[#79c0ff]">@ui</span> = <span className="text-[#7ee787]">&quot;World&quot;</span></div>
                  <div className="mt-2 text-[#8b949e]">// Emit the result</div>
                  <div className="text-[#ff6b35]">em <span className="text-[#79c0ff]">@si</span> + <span className="text-[#7ee787]">&quot; &quot;</span> + <span className="text-[#79c0ff]">@ui</span> + <span className="text-[#7ee787]">&quot;!&quot;</span></div>
                  <div className="mt-4 text-[#8b949e]">// Define a function</div>
                  <div className="text-[#ff6b35]">f <span className="text-[#d2a8ff]">greet</span>(name) {'{'}</div>
                  <div className="pl-4 text-[#ff6b35]">ret <span className="text-[#7ee787]">&quot;Hello, &quot;</span> + name + <span className="text-[#7ee787]">&quot;!&quot;</span></div>
                  <div className="text-[#c9d1d9]">{'}'}</div>
                  <div className="mt-2 text-[#ff6b35]">em <span className="text-[#d2a8ff]">greet</span>(<span className="text-[#7ee787]">&quot;Droy&quot;</span>)</div>
                </div>

                {/* Preview Panel */}
                <div className="w-64 bg-[#010409] border-l border-[#30363d] p-3 hidden lg:block">
                  <div className="text-xs text-[#8b949e] mb-2 uppercase tracking-wider">Live Preview</div>
                  <div className="space-y-1 font-mono text-sm">
                    <div className="text-[#7ee787]">Hello World!</div>
                    <div className="text-[#7ee787]">Hello, Droy!</div>
                  </div>
                </div>
              </div>

              {/* Bottom Panel */}
              <div className="h-[40px] bg-[#161b22] border-t border-[#30363d] flex items-center px-4">
                <div className="flex items-center gap-4 text-xs text-[#8b949e]">
                  <div className="flex items-center gap-1">
                    <Terminal className="w-3 h-3" />
                    <span>Terminal</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Cpu className="w-3 h-3" />
                    <span>LLVM IR</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    <span>Output</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
          </div>

          {/* Features Grid */}
          <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Code2,
                title: 'Syntax Highlighting',
                description: 'Full support for Droy language with intelligent code coloring.',
              },
              {
                icon: Terminal,
                title: 'Live Preview',
                description: 'See your code output in real-time as you type.',
              },
              {
                icon: Cpu,
                title: 'LLVM Backend',
                description: 'Compile to LLVM IR for high-performance execution.',
              },
              {
                icon: Zap,
                title: 'Error Detection',
                description: 'Catch errors before runtime with static analysis.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-[#111] rounded-xl border border-[#222] p-6 hover:border-[#ff6b35]/50 transition-all duration-500"
              >
                <div className="w-10 h-10 rounded-lg bg-[#ff6b35]/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-[#ff6b35]" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-[#a0a0a0]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full Screen IDE Dialog */}
      <Dialog open={ideOpen} onOpenChange={setIdeOpen}>
        <DialogContent className="max-w-none w-screen h-screen p-0 m-0 border-none bg-[#0d1117]">
          {DroyIDEComponent ? (
            <DroyIDEComponent />
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-[#ff6b35] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-[#8b949e]">Loading Droy Studio...</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
