import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check, Terminal, Package, Wrench } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const prerequisites = [
  { name: 'C Compiler', desc: 'GCC or Clang', icon: Wrench },
  { name: 'LLVM', desc: 'Optional, for LLVM backend', icon: Package },
  { name: 'Make', desc: 'Build system', icon: Terminal },
];

const installSteps = [
  {
    title: 'Clone the repository',
    command: 'git clone https://github.com/droy-go/droy-lang.git',
  },
  {
    title: 'Navigate to directory',
    command: 'cd droy-lang',
  },
  {
    title: 'Build the compiler',
    command: 'make',
  },
  {
    title: 'Verify installation',
    command: './bin/droy -v',
  },
];

const llvmSteps = [
  {
    title: 'Build with LLVM backend',
    command: 'make llvm',
  },
  {
    title: 'Compile Droy to LLVM IR',
    command: './bin/droy-llvm input.droy output.ll',
  },
  {
    title: 'Compile LLVM IR to assembly',
    command: 'llc output.ll -o output.s',
  },
  {
    title: 'Create executable',
    command: 'clang output.s -o output',
  },
];

export default function Installation() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 80 },
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

  const handleCopy = (command: string, index: number) => {
    navigator.clipboard.writeText(command);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <section
      ref={sectionRef}
      id="installation"
      className="relative py-32 bg-[#0a0a0a]"
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#ff6b35]/5 rounded-full blur-[200px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6">
            Get started in{' '}
            <span className="text-gradient">minutes</span>
          </h2>
          <p className="text-xl text-[#a0a0a0] max-w-2xl mx-auto">
            Install Droy and start building powerful applications today.
          </p>
        </div>

        <div ref={contentRef} className="space-y-12">
          {/* Prerequisites */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6">Prerequisites</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              {prerequisites.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center gap-4 bg-[#111] rounded-xl border border-[#222] p-4 hover:border-[#ff6b35]/30 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#ff6b35]/10 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-[#ff6b35]" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">{item.name}</div>
                    <div className="text-sm text-[#666]">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Installation Steps */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6">
              Building from Source
            </h3>
            <div className="bg-[#111] rounded-xl border border-[#333] overflow-hidden">
              {installSteps.map((step, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border-b border-[#222] last:border-0 hover:bg-[#1a1a1a] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-full bg-[#ff6b35]/20 flex items-center justify-center text-[#ff6b35] font-bold text-sm">
                      {index + 1}
                    </span>
                    <div>
                      <div className="text-sm text-[#666] mb-1">{step.title}</div>
                      <code className="text-[#7ee787] font-mono text-sm">
                        {step.command}
                      </code>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(step.command, index)}
                    className="text-[#666] hover:text-[#ff6b35] hover:bg-[#ff6b35]/10"
                  >
                    {copiedIndex === index ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* LLVM Backend */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6">
              LLVM Backend <span className="text-sm font-normal text-[#666]">(Optional)</span>
            </h3>
            <div className="bg-[#111] rounded-xl border border-[#333] overflow-hidden">
              {llvmSteps.map((step, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border-b border-[#222] last:border-0 hover:bg-[#1a1a1a] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-full bg-[#4169e1]/20 flex items-center justify-center text-[#4169e1] font-bold text-sm">
                      {index + 1}
                    </span>
                    <div>
                      <div className="text-sm text-[#666] mb-1">{step.title}</div>
                      <code className="text-[#79c0ff] font-mono text-sm">
                        {step.command}
                      </code>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(step.command, installSteps.length + index)}
                    className="text-[#666] hover:text-[#4169e1] hover:bg-[#4169e1]/10"
                  >
                    {copiedIndex === installSteps.length + index ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Compiler Options */}
          <div className="bg-gradient-to-r from-[#ff6b35]/10 to-[#4169e1]/10 rounded-xl border border-[#ff6b35]/20 p-6">
            <h3 className="text-xl font-bold text-white mb-4">
              Compiler Options
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { opt: '-h', desc: 'Show help' },
                { opt: '-v', desc: 'Show version' },
                { opt: '-t', desc: 'Print tokens (lexical analysis)' },
                { opt: '-a', desc: 'Print AST (Abstract Syntax Tree)' },
                { opt: '-c -o', desc: 'Compile to LLVM IR' },
                { opt: '-i', desc: 'Interactive REPL mode' },
              ].map((item) => (
                <div key={item.opt} className="flex items-center gap-3">
                  <code className="text-[#ff6b35] font-mono bg-[#0a0a0a] px-2 py-1 rounded">
                    {item.opt}
                  </code>
                  <span className="text-[#a0a0a0] text-sm">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
