import { useEffect, useRef } from 'react';
import {
  Code2,
  FileCode,
  Cpu,
  Monitor,
  Variable,
  Terminal,
  Link,
  Box,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: Code2,
    title: 'Complete Language Implementation',
    description:
      'Full-featured Lexer, Parser, AST, and Interpreter built from scratch in C.',
  },
  {
    icon: FileCode,
    title: 'Rich Syntax',
    description:
      'Variables, operators, control flow, links, styling, and more powerful constructs.',
  },
  {
    icon: Cpu,
    title: 'LLVM Backend',
    description:
      'Compile Droy code to high-performance LLVM IR for optimal execution.',
  },
  {
    icon: Monitor,
    title: 'Professional Code Editor',
    description:
      'Web-based IDE with syntax highlighting, auto-completion, and error detection.',
  },
  {
    icon: Variable,
    title: 'Special Variables',
    description:
      'Built-in system variables (@si, @ui, @yui, @pop, @abc) for advanced functionality.',
  },
  {
    icon: Terminal,
    title: 'Command System',
    description:
      'Powerful commands (*/employment, */Running, */pressure, */lock) for system control.',
  },
  {
    icon: Link,
    title: 'Link Management',
    description: 'Create, open, and navigate links seamlessly within your code.',
  },
  {
    icon: Box,
    title: 'Block System',
    description: 'Define reusable code blocks with scoping for better organization.',
  },
];

export default function Features() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Cards animation
      cardsRef.current.forEach((card, index) => {
        if (!card) return;

        gsap.fromTo(
          card,
          { opacity: 0, y: 80 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: index * 0.1,
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
      id="features"
      className="relative py-32 bg-[#0a0a0a]"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#ff6b35]/5 rounded-full blur-[200px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div ref={titleRef} className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6">
            Everything you{' '}
            <span className="text-gradient">need</span>
          </h2>
          <p className="text-xl text-[#a0a0a0] max-w-2xl mx-auto">
            A complete development environment with powerful features designed
            for modern programming.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              ref={(el) => { cardsRef.current[index] = el; }}
              className="group relative bg-[#111] rounded-xl border border-[#222] p-6 hover:border-[#ff6b35]/50 transition-all duration-500 hover:glow-orange"
            >
              {/* Icon */}
              <div className="mb-4">
                <div className="w-12 h-12 rounded-lg bg-[#ff6b35]/10 flex items-center justify-center group-hover:bg-[#ff6b35]/20 transition-colors duration-300">
                  <feature.icon className="w-6 h-6 text-[#ff6b35] group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#ff6b35] transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-sm text-[#a0a0a0] leading-relaxed">
                {feature.description}
              </p>

              {/* Hover Glow */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#ff6b35]/0 to-[#ff6b35]/0 group-hover:from-[#ff6b35]/5 group-hover:to-transparent transition-all duration-500 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
