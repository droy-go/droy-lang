import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Github, Copy, Check } from 'lucide-react';
import gsap from 'gsap';

const codeExample = `~s @si = "Hello"
~s @ui = "World"
em @si + " " + @ui + "!"`;

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial states
      gsap.set([titleRef.current, subtitleRef.current], { opacity: 0, y: 50 });
      gsap.set(editorRef.current, { opacity: 0, scale: 0.8, rotateX: 15 });
      gsap.set(logoRef.current, { opacity: 0, scale: 0, rotation: -180 });

      // Animation timeline
      const tl = gsap.timeline({ delay: 0.3 });

      tl.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'expo.out',
      })
        .to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'expo.out',
          },
          '-=0.6'
        )
        .to(
          editorRef.current,
          {
            opacity: 1,
            scale: 1,
            rotateX: 0,
            duration: 1,
            ease: 'expo.out',
          },
          '-=0.5'
        )
        .to(
          logoRef.current,
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 0.8,
            ease: 'back.out(1.7)',
          },
          '-=0.6'
        );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeExample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[#0a0a0a]">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#ff6b35]/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#4169e1]/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '1s' }} />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text */}
          <div className="space-y-8">
            {/* Logo & Badge */}
            <div className="flex items-center gap-4">
              <img
                ref={logoRef}
                src="/logo.png"
                alt="Droy Language Logo"
                className="w-16 h-16"
              />
              <Badge
                variant="outline"
                className="border-[#ff6b35]/50 text-[#ff6b35] px-3 py-1"
              >
                v1.0.0
              </Badge>
            </div>

            {/* Title */}
            <div>
              <h1
                ref={titleRef}
                className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight"
              >
                <span className="text-white">Droy</span>
                <br />
                <span className="text-gradient">Language</span>
              </h1>
            </div>

            {/* Subtitle */}
            <p
              ref={subtitleRef}
              className="text-lg sm:text-xl text-[#a0a0a0] max-w-lg leading-relaxed"
            >
              A complete markup and programming language built from scratch in C
              with LLVM backend support. Code with power, build with style.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="bg-[#ff6b35] hover:bg-[#ff6b35]/90 text-white px-8 py-6 text-lg font-semibold group glow-orange transition-all duration-300 hover:scale-105"
                onClick={() => scrollToSection('installation')}
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-[#333] hover:border-[#ff6b35]/50 text-white px-8 py-6 text-lg font-semibold transition-all duration-300 hover:bg-[#ff6b35]/10"
                onClick={() => window.open('https://github.com/droy-go/droy-lang', '_blank')}
              >
                <Github className="mr-2 w-5 h-5" />
                GitHub
              </Button>
            </div>
          </div>

          {/* Right Column - Code Editor */}
          <div
            ref={editorRef}
            className="relative perspective-1000"
            style={{ perspective: '1000px' }}
          >
            <div className="relative bg-[#111] rounded-xl border border-[#333] overflow-hidden glow-orange">
              {/* Editor Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-[#1a1a1a] border-b border-[#333]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#27ca40]" />
                </div>
                <span className="text-sm text-[#666]">hello.droy</span>
                <button
                  onClick={handleCopy}
                  className="text-[#666] hover:text-[#ff6b35] transition-colors"
                >
                  {copied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Editor Content */}
              <div className="p-6 font-mono text-sm sm:text-base leading-relaxed scanlines">
                <div className="space-y-1">
                  <div>
                    <span className="syntax-keyword">~s</span>{' '}
                    <span className="syntax-variable">@si</span>{' '}
                    <span className="text-white">=</span>{' '}
                    <span className="syntax-string">&quot;Hello&quot;</span>
                  </div>
                  <div>
                    <span className="syntax-keyword">~s</span>{' '}
                    <span className="syntax-variable">@ui</span>{' '}
                    <span className="text-white">=</span>{' '}
                    <span className="syntax-string">&quot;World&quot;</span>
                  </div>
                  <div>
                    <span className="syntax-keyword">em</span>{' '}
                    <span className="syntax-variable">@si</span>{' '}
                    <span className="text-white">+</span>{' '}
                    <span className="syntax-string">&quot; &quot;</span>{' '}
                    <span className="text-white">+</span>{' '}
                    <span className="syntax-variable">@ui</span>{' '}
                    <span className="text-white">+</span>{' '}
                    <span className="syntax-string">&quot;!&quot;</span>
                  </div>
                </div>

                {/* Cursor */}
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-[#666]">$</span>
                  <span className="w-2 h-5 bg-[#ff6b35] animate-pulse" />
                </div>
              </div>

              {/* Output Preview */}
              <div className="px-6 py-4 bg-[#0a0a0a] border-t border-[#333]">
                <div className="text-xs text-[#666] mb-2">Output:</div>
                <div className="text-[#7ee787] font-mono">Hello World!</div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-[#ff6b35]/20 rounded-full blur-xl animate-pulse" />
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-[#4169e1]/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
    </section>
  );
}
