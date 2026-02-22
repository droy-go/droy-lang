import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Github,
  BookOpen,
  Bug,
  MessageCircle,
  Heart,
  ExternalLink,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const links = [
  {
    name: 'GitHub',
    href: 'https://github.com/droy-go/droy-lang',
    icon: Github,
  },
  {
    name: 'Documentation',
    href: 'https://droy-go.github.io/droy-lang/',
    icon: BookOpen,
  },
  {
    name: 'Issues',
    href: 'https://github.com/droy-go/droy-lang/issues',
    icon: Bug,
  },
  {
    name: 'Discussions',
    href: 'https://github.com/droy-go/droy-lang/discussions',
    icon: MessageCircle,
  },
];

export default function Footer() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: ctaRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={sectionRef}
      className="relative py-32 bg-[#0a0a0a] overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#ff6b35]/5 rounded-full blur-[200px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* CTA Section */}
        <div ref={ctaRef} className="text-center mb-20">
          <h2 className="text-5xl sm:text-6xl lg:text-8xl font-black text-white mb-8">
            Start{' '}
            <span className="text-gradient">Building</span>
          </h2>
          <p className="text-xl text-[#a0a0a0] max-w-xl mx-auto mb-10">
            Join the community and start creating powerful applications with
            Droy Language today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="bg-[#ff6b35] hover:bg-[#ff6b35]/90 text-white px-8 py-6 text-lg font-semibold glow-orange transition-all duration-300 hover:scale-105"
              onClick={() =>
                window.open('https://github.com/droy-go/droy-lang', '_blank')
              }
            >
              <Github className="mr-2 w-5 h-5" />
              View on GitHub
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-[#333] hover:border-[#ff6b35]/50 text-white px-8 py-6 text-lg font-semibold transition-all duration-300 hover:bg-[#ff6b35]/10"
              onClick={() =>
                window.open('https://droy-go.github.io/droy-lang/', '_blank')
              }
            >
              <BookOpen className="mr-2 w-5 h-5" />
              Documentation
              <ExternalLink className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-6 mb-16">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[#a0a0a0] hover:text-[#ff6b35] transition-colors duration-300"
            >
              <link.icon className="w-4 h-4" />
              <span>{link.name}</span>
            </a>
          ))}
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#333] to-transparent mb-8" />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Droy" className="w-8 h-8" />
            <span className="font-bold text-white">Droy</span>
          </div>

          {/* Copyright */}
          <div className="flex items-center gap-2 text-[#666]">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-[#ff6b35] fill-[#ff6b35]" />
            <span>by the Droy Team</span>
          </div>

          {/* License */}
          <div className="text-[#666] text-sm">
            Licensed under{' '}
            <a
              href="https://github.com/droy-go/droy-lang/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#ff6b35] hover:underline"
            >
              MIT
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
