import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const keywords = [
  {
    keyword: 'set',
    shorthand: '~s',
    description: 'Variable assignment',
    example: 'set name = "Droy"\n~s @si = 100',
  },
  {
    keyword: 'em',
    shorthand: '~e',
    description: 'Emit/output expression',
    example: 'em "Hello"\n~e @si + @ui',
  },
  {
    keyword: 'ret',
    shorthand: '~r',
    description: 'Return statement',
    example: 'ret @si + @ui\n~r "Completed"',
  },
  {
    keyword: 'fe',
    shorthand: '-',
    description: 'If condition',
    example: 'fe (a > b) {\n    em "a is greater"\n}',
  },
  {
    keyword: 'f',
    shorthand: '-',
    description: 'Function declaration',
    example: 'f greet(name) {\n    ret "Hello, " + name\n}',
  },
  {
    keyword: 'for',
    shorthand: '-',
    description: 'For loop',
    example: 'for (set i = 0; i < 10; i++) {\n    em i\n}',
  },
];

const operators = [
  { op: '+', desc: 'Addition / String concatenation' },
  { op: '-', desc: 'Subtraction' },
  { op: '*', desc: 'Multiplication' },
  { op: '/', desc: 'Division' },
  { op: '=', desc: 'Assignment' },
  { op: '>', desc: 'Greater than' },
  { op: '<', desc: 'Less than' },
  { op: '==', desc: 'Equal to' },
];

const specialVars = [
  { var: '@si', desc: 'System Integer / String' },
  { var: '@ui', desc: 'User Interface variable' },
  { var: '@yui', desc: 'Dynamic user input' },
  { var: '@pop', desc: 'Pop/Stack variable' },
  { var: '@abc', desc: 'Alphabet/String buffer' },
];

export default function LanguageSyntax() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, index) => {
        if (!card) return;

        gsap.fromTo(
          card,
          { opacity: 0, y: 60, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            delay: index * 0.08,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="syntax"
      className="relative py-32 bg-[#0a0a0a]"
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[#ff6b35]/5 rounded-full blur-[200px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6">
            Language{' '}
            <span className="text-gradient">Syntax</span>
          </h2>
          <p className="text-xl text-[#a0a0a0] max-w-2xl mx-auto">
            Clean, expressive syntax designed for readability and power.
          </p>
        </div>

        {/* Keywords Section */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-[#ff6b35]/20 flex items-center justify-center">
              <span className="text-[#ff6b35] text-sm">K</span>
            </span>
            Keywords
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {keywords.map((item, index) => (
              <div
                key={item.keyword}
                ref={(el) => { cardsRef.current[index] = el; }}
                className="group bg-[#111] rounded-xl border border-[#222] p-6 hover:border-[#ff6b35]/50 transition-all duration-500 hover:glow-orange"
              >
                <div className="flex items-start justify-between mb-4">
                  <code className="text-2xl font-bold text-[#ff6b35]">
                    {item.keyword}
                  </code>
                  {item.shorthand !== '-' && (
                    <code className="text-sm text-[#666] bg-[#1a1a1a] px-2 py-1 rounded">
                      {item.shorthand}
                    </code>
                  )}
                </div>
                <p className="text-[#a0a0a0] mb-4">{item.description}</p>
                <pre className="text-xs text-[#666] bg-[#0a0a0a] p-3 rounded-lg overflow-x-auto">
                  <code>{item.example}</code>
                </pre>
              </div>
            ))}
          </div>
        </div>

        {/* Operators & Special Variables */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Operators */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#4169e1]/20 flex items-center justify-center">
                <span className="text-[#4169e1] text-sm">O</span>
              </span>
              Operators
            </h3>
            <div className="bg-[#111] rounded-xl border border-[#222] overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#222]">
                    <th className="text-left p-4 text-[#666] font-medium">Operator</th>
                    <th className="text-left p-4 text-[#666] font-medium">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {operators.map((item, index) => (
                    <tr
                      key={item.op}
                      ref={(el) => { 
                        if (el) cardsRef.current[keywords.length + index] = el; 
                      }}
                      className="border-b border-[#222] last:border-0 hover:bg-[#1a1a1a] transition-colors"
                    >
                      <td className="p-4">
                        <code className="text-[#ff6b35] font-bold">{item.op}</code>
                      </td>
                      <td className="p-4 text-[#a0a0a0]">{item.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Special Variables */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#7ee787]/20 flex items-center justify-center">
                <span className="text-[#7ee787] text-sm">V</span>
              </span>
              Special Variables
            </h3>
            <div className="bg-[#111] rounded-xl border border-[#222] overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#222]">
                    <th className="text-left p-4 text-[#666] font-medium">Variable</th>
                    <th className="text-left p-4 text-[#666] font-medium">Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  {specialVars.map((item, index) => (
                    <tr
                      key={item.var}
                      ref={(el) => { 
                        if (el) cardsRef.current[keywords.length + operators.length + index] = el; 
                      }}
                      className="border-b border-[#222] last:border-0 hover:bg-[#1a1a1a] transition-colors"
                    >
                      <td className="p-4">
                        <code className="text-[#79c0ff] font-bold">{item.var}</code>
                      </td>
                      <td className="p-4 text-[#a0a0a0]">{item.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
