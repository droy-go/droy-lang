import { useEffect, useRef } from 'react';
import DroyEditor from '@/components/DroyEditor';
import { Sparkles, Zap, Code } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Playground() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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

  return (
    <section
      ref={sectionRef}
      id="playground"
      className="relative py-32 bg-[#0a0a0a]"
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#ff6b35]/5 rounded-full blur-[200px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#4169e1]/5 rounded-full blur-[200px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div ref={contentRef} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#ff6b35]/10 rounded-full border border-[#ff6b35]/20 mb-6">
            <Sparkles className="w-4 h-4 text-[#ff6b35]" />
            <span className="text-sm text-[#ff6b35]">Interactive Playground</span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6">
            Try Droy{' '}
            <span className="text-gradient">Online</span>
          </h2>

          <p className="text-xl text-[#a0a0a0] max-w-2xl mx-auto mb-8">
            Write, run, and experiment with Droy code directly in your browser.
            No installation required!
          </p>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <div className="flex items-center gap-2 text-[#a0a0a0]">
              <Zap className="w-4 h-4 text-[#ff6b35]" />
              <span>Real-time execution</span>
            </div>
            <div className="flex items-center gap-2 text-[#a0a0a0]">
              <Code className="w-4 h-4 text-[#ff6b35]" />
              <span>Syntax highlighting</span>
            </div>
            <div className="flex items-center gap-2 text-[#a0a0a0]">
              <Sparkles className="w-4 h-4 text-[#ff6b35]" />
              <span>Built-in examples</span>
            </div>
          </div>
        </div>

        {/* Editor */}
        <DroyEditor
          height="500px"
          showExamples={true}
        />

        {/* Tips */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-[#111] rounded-xl border border-[#222] p-6">
            <h3 className="text-lg font-bold text-white mb-2">Quick Start</h3>
            <p className="text-sm text-[#a0a0a0]">
              Use <code className="text-[#ff6b35]">~s</code> for variable declaration and{' '}
              <code className="text-[#ff6b35]">em</code> to output values.
            </p>
          </div>

          <div className="bg-[#111] rounded-xl border border-[#222] p-6">
            <h3 className="text-lg font-bold text-white mb-2">Special Variables</h3>
            <p className="text-sm text-[#a0a0a0]">
              Built-in variables like <code className="text-[#79c0ff]">@si</code>,{' '}
              <code className="text-[#79c0ff]">@ui</code>, and{' '}
              <code className="text-[#79c0ff]">@yui</code> are always available.
            </p>
          </div>

          <div className="bg-[#111] rounded-xl border border-[#222] p-6">
            <h3 className="text-lg font-bold text-white mb-2">Functions</h3>
            <p className="text-sm text-[#a0a0a0]">
              Define functions with <code className="text-[#ff6b35]">f</code> and return values with{' '}
              <code className="text-[#ff6b35]">ret</code>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
