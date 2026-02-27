import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { 
  Code2, 
  Terminal, 
  Zap, 
  BookOpen, 
  Play, 
  Copy, 
  Check,
  Github,
  Sparkles,
  Menu,
  X,
  Palette,
  Layout,
  Paintbrush,
  Monitor,
  Server,
  Database,
  Settings,
  Layers,
  Cpu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DroyCompilerV3 } from '@/lib/droy/compiler-v3';
import { CodeEditorV3 } from '@/components/CodeEditorV3';
import { ParticleBackground } from '@/components/ParticleBackground';
import './App.css';

// Comprehensive v3.0 example code
const defaultCode = `# ============================================
# Droy Language v3.0 - Advanced Edition
# ============================================

# === SET / SETUP Naming ===
set=topbar=main-navigation
set=sidebar=left-menu
setup=get: styles
setup=theme: dark

# === TOOL Concept ===
tool=get: formatter
tool=validate: input
tool-set-sty=modern

# === GET_SET ===
GET_SET name: "DroyApp"
GET_SET version: "3.0.0"

# === Value Set with Operations ===
value-set=(a=1, s=2, c+s=3)
value-set=(x=10, y=20, sum=x+y)

# === UI Components ===

# Topbar
~topbar {
  bg: #1e293b
  height: 60px
  
  ~row justify: space-between align: center {
    ~title "Droy App" color: white
    
    ~nav {
      ~btn "Home" color: transparent
      ~btn "About" color: transparent
    }
  }
}

# Sidebar
~sidebar {
  width: 250px
  bg: #0f172a
  padding: 20px
  
  ~menu {
    ~col gap: 10px {
      ~btn "📊 Dashboard"
      ~btn "📈 Analytics"
      ~btn "⚙️ Settings"
    }
  }
}

# Header Section
~header {
  bg: "linear-gradient(135deg, #6366f1, #a855f7)"
  padding: 60px
  
  ~title "Welcome to Droy" color: white
  ~subtitle "Modern Programming Language" color: "rgba(255,255,255,0.8)"
}

# Main Content
~container {
  padding: 40px
  
  # Statistics Cards
  ~grid cols: 4 gap: 20px {
    ~card {
      ~text "Users"
      ~title "1,234"
    }
    ~card {
      ~text "Revenue"
      ~title "$12,345"
    }
    ~card {
      ~text "Orders"
      ~title "567"
    }
    ~card {
      ~text "Growth"
      ~title "+23%"
    }
  }
  
  # Action Buttons
  ~row gap: 16px {
    ~btn "Primary" color: #6366f1
    ~btn "Success" color: #10b981
    ~btn "Warning" color: #f59e0b
    ~btn "Danger" color: #ef4444
  }
}

# Footer
~footer {
  bg: #0f172a
  padding: 40px
  
  ~text "© 2026 Droy Language. All rights reserved."
}

# === Color Blending ===
~row gap: 16px {
  ~color #6366f1 width: 80px height: 80px radius: 12px
  ~color #a855f7 width: 80px height: 80px radius: 12px
  ~color #ec4899 width: 80px height: 80px radius: 12px
}

# === DATA ===
data users: [
  { name: "John", age: 30 },
  { name: "Jane", age: 25 }
]

data config: {
  theme: "dark",
  language: "en"
}

# === SERVER ===
server=api: "https://api.example.com"
server=endpoint: "/v1"

# === Group / ID / Name ===
group=nav-items: ["Home", "About", "Contact"]
id=main-header: ~header { }
name=submit-btn: ~btn "Submit" color: #10b981

# === Programming ===
func greet(name) {
  return "Hello, " + name
}

var message = greet("Droy")
print message

# === Events ===
~btn "Click Me" color: #6366f1 @click => {
  print "Button clicked!"
}

@keydown "Enter" => {
  print "Enter key pressed"
}`;

// Example categories for v3.0
const exampleCategories = [
  {
    name: 'SET / SETUP',
    icon: Settings,
    examples: [
      {
        name: 'Element Naming',
        code: `# SET naming syntax
set=topbar=main-navigation
set=sidebar=left-menu
set=footer=page-footer

# SETUP configuration
setup=get: styles
setup=theme: dark
setup=layout: grid`,
      },
      {
        name: 'TOOL Definition',
        code: `# TOOL concept
tool=get: formatter
tool=validate: input
tool=format: json

# Tool styling
tool-set-sty=modern
tool-set-sty=minimal`,
      },
    ],
  },
  {
    name: 'Value Operations',
    icon: Zap,
    examples: [
      {
        name: 'Value Set',
        code: `# Value set with calculations
value-set=(a=1, b=2, c=a+b)
value-set=(x=10, y=20, sum=x+y)
value-set=(price=100, tax=0.2, total=price*tax)`,
      },
      {
        name: 'GET_SET',
        code: `# GET_SET pattern
GET_SET appName: "MyApp"
GET_SET version: "1.0.0"
GET_SET config: { theme: "dark" }`,
      },
    ],
  },
  {
    name: 'Layout Components',
    icon: Layout,
    examples: [
      {
        name: 'Topbar & Sidebar',
        code: `# Topbar
~topbar {
  bg: #1e293b
  height: 60px
  
  ~title "Logo"
  ~nav {
    ~btn "Home"
    ~btn "About"
  }
}

# Sidebar
~sidebar {
  width: 250px
  bg: #0f172a
  
  ~menu {
    ~btn "Dashboard"
    ~btn "Settings"
  }
}`,
      },
      {
        name: 'Header & Footer',
        code: `# Header
~header {
  bg: "linear-gradient(135deg, #6366f1, #a855f7)"
  padding: 60px
  
  ~title "Welcome"
  ~subtitle "Subtitle"
}

# Footer
~footer {
  bg: #0f172a
  padding: 40px
  
  ~text "© 2026"
}`,
      },
    ],
  },
  {
    name: 'Data & Server',
    icon: Database,
    examples: [
      {
        name: 'Data Declaration',
        code: `# JSON data
data users: [
  { name: "John", age: 30 },
  { name: "Jane", age: 25 }
]

# State
data state: {
  count: 0,
  user: null
}`,
      },
      {
        name: 'Server Integration',
        code: `# Server config
server=api: "https://api.example.com"
server=endpoint: "/v1"

# HTTP requests
fetch: "/users"
post: "/users" data: { name: "John" }`,
      },
    ],
  },
  {
    name: 'Group / ID / Name',
    icon: Layers,
    examples: [
      {
        name: 'Element Grouping',
        code: `# Group elements
group=nav-items: ["Home", "About", "Contact"]

# ID assignment
id=main-header: ~header {
  ~title "Header"
}

# Named elements
name=submit-btn: ~btn "Submit"`,
      },
    ],
  },
  {
    name: 'Color Blending',
    icon: Palette,
    examples: [
      {
        name: 'Color Blend',
        code: `# Color blending
blend #6366f1, #a855f7 mode: overlay

# Gradient
gradient #ff6b6b, #feca57

# Color swatches
~color #6366f1
~color #a855f7
~color #ec4899`,
      },
    ],
  },
];

// Documentation sections
const documentation = [
  {
    title: 'SET / SETUP',
    icon: Settings,
    content: `
      <p>Define named elements with SET and configure with SETUP:</p>
      <pre><code># SET naming
set=topbar=main-nav
set=sidebar=menu

# SETUP configuration
setup=get: styles
setup=theme: dark</code></pre>
    `,
  },
  {
    title: 'TOOL',
    icon: Cpu,
    content: `
      <p>Create reusable tools:</p>
      <pre><code># Tool definition
tool=get: formatter
tool=validate: input
tool-set-sty=modern</code></pre>
    `,
  },
  {
    title: 'Value Operations',
    icon: Zap,
    content: `
      <p>Define multiple values with calculations:</p>
      <pre><code># Value set
value-set=(a=1, b=2, c=a+b)

# GET_SET
GET_SET name: "value"</code></pre>
    `,
  },
  {
    title: 'Layout Components',
    icon: Layout,
    content: `
      <p>Advanced layout components:</p>
      <pre><code>~topbar { }
~sidebar { }
~header { }
~footer { }
~nav { }
~menu { }</code></pre>
    `,
  },
  {
    title: 'Data & Server',
    icon: Database,
    content: `
      <p>Data handling and server integration:</p>
      <pre><code>data users: [...]
server=api: "url"
fetch: "/users"</code></pre>
    `,
  },
  {
    title: 'Group / ID / Name',
    icon: Layers,
    content: `
      <p>Element grouping and identification:</p>
      <pre><code>group=name: [...]
id=name: element
name=name: element</code></pre>
    `,
  },
  {
    title: 'Color Blending',
    icon: Palette,
    content: `
      <p>Advanced color operations:</p>
      <pre><code>blend #ff0000, #0000ff
gradient #ff6b6b, #feca57</code></pre>
    `,
  },
];

function App() {
  const [code, setCode] = useState(defaultCode);
  const [output, setOutput] = useState('');
  const [html, setHtml] = useState('');
  const [css, setCss] = useState('');
  const [activeTab, setActiveTab] = useState('preview');
  const [isCompiling, setIsCompiling] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set((clientX / innerWidth) - 0.5);
      mouseY.set((clientY / innerHeight) - 0.5);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const compileCode = () => {
    setIsCompiling(true);
    try {
      const compiler = new DroyCompilerV3();
      const result = compiler.compile(code);
      setHtml(result.html);
      setCss(result.css);
      
      // Simulate execution output
      const lines = code.split('\n');
      let simulatedOutput = '';
      lines.forEach((line) => {
        const trimmed = line.trim();
        if (trimmed.startsWith('print ')) {
          const match = trimmed.match(/print\s+(.+)/);
          if (match) {
            const value = match[1].trim();
            if (value.startsWith('"') && value.endsWith('"')) {
              simulatedOutput += value.slice(1, -1) + '\n';
            } else {
              simulatedOutput += `[${value}]\n`;
            }
          }
        }
      });
      setOutput(simulatedOutput || 'Compiled successfully!\n');
    } catch (error) {
      setOutput(`Error: ${error}\n`);
    }
    setIsCompiling(false);
  };

  const copyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadExample = (exampleCode: string) => {
    setCode(exampleCode);
    window.scrollTo({ top: document.getElementById('playground')?.offsetTop || 0, behavior: 'smooth' });
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-[#0f172a] text-white overflow-x-hidden">
      <ParticleBackground />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0f172a]/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Droy <span className="text-sm text-slate-500">v3.0</span>
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm text-slate-300 hover:text-white transition-colors">Features</a>
              <a href="#playground" className="text-sm text-slate-300 hover:text-white transition-colors">Playground</a>
              <a href="#docs" className="text-sm text-slate-300 hover:text-white transition-colors">Docs</a>
              <a href="#examples" className="text-sm text-slate-300 hover:text-white transition-colors">Examples</a>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="hidden md:flex"
                onClick={() => window.open('https://github.com/droy-go/droy-lang', '_blank')}
              >
                <Github className="w-5 h-5" />
              </Button>
              <Button 
                className="hidden md:flex bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                onClick={() => document.getElementById('playground')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Get Started
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>
        
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-[#0f172a]/95 backdrop-blur-lg border-b border-white/10"
          >
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block text-slate-300 hover:text-white py-2">Features</a>
              <a href="#playground" className="block text-slate-300 hover:text-white py-2">Playground</a>
              <a href="#docs" className="block text-slate-300 hover:text-white py-2">Docs</a>
              <a href="#examples" className="block text-slate-300 hover:text-white py-2">Examples</a>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%]"
            animate={{
              background: [
                'radial-gradient(circle at 30% 30%, rgba(99, 102, 241, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(168, 85, 247, 0.15) 0%, transparent 50%)',
                'radial-gradient(circle at 70% 30%, rgba(99, 102, 241, 0.15) 0%, transparent 50%), radial-gradient(circle at 30% 70%, rgba(168, 85, 247, 0.15) 0%, transparent 50%)',
                'radial-gradient(circle at 30% 30%, rgba(99, 102, 241, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(168, 85, 247, 0.15) 0%, transparent 50%)',
              ],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />

        <motion.div 
          style={{ y, opacity }}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span className="text-sm text-indigo-300">Version 3.0 - Advanced Edition</span>
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
              >
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Droy Language
                </span>
                <br />
                <span className="text-white">v3.0</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-lg text-slate-400 mb-8 max-w-xl mx-auto lg:mx-0"
              >
                Advanced programming language with SET/SETUP naming, TOOL concept, 
                value operations, data handling, and server integration.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="flex flex-wrap gap-4 justify-center lg:justify-start"
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 gap-2"
                  onClick={() => document.getElementById('playground')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Play className="w-4 h-4" />
                  Try Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-slate-700 hover:bg-slate-800 gap-2"
                  onClick={() => document.getElementById('docs')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <BookOpen className="w-4 h-4" />
                  Documentation
                </Button>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              style={{
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
                perspective: 1000,
              }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-indigo-500/20 border border-white/10">
                <div className="bg-[#1e1e2e] px-4 py-3 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span className="text-xs text-slate-500">app.droy</span>
                </div>
                
                <div className="bg-[#0d0d12] p-4 font-mono text-sm">
                  <pre className="text-slate-300">
                    <span className="text-purple-400">set</span>=topbar=main-nav{'\n'}
                    <span className="text-purple-400">setup</span>=theme: dark{'\n'}
                    <span className="text-purple-400">value-set</span>=(a=1, b=2){'\n'}
                    <span className="text-cyan-400">~topbar</span> {'{'} bg: #1e293b {'}'}{'\n'}
                    <span className="text-cyan-400">~sidebar</span> {'{'} width: 250px {'}'}{'\n'}
                    <span className="text-green-400">data</span> users: [ ... ]{'\n'}
                    <span className="text-orange-400">server</span>=api: "url"
                  </pre>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Droy 3.0 Features
              </span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Advanced concepts for modern application development
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Settings, title: 'SET / SETUP', desc: 'Element naming and configuration', color: 'from-blue-500 to-cyan-500' },
              { icon: Cpu, title: 'TOOL', desc: 'Reusable tool definitions', color: 'from-purple-500 to-violet-500' },
              { icon: Zap, title: 'Value Operations', desc: 'Calculations within value sets', color: 'from-yellow-500 to-orange-500' },
              { icon: Layout, title: 'Layout Components', desc: 'Topbar, sidebar, header, footer', color: 'from-green-500 to-emerald-500' },
              { icon: Database, title: 'Data Handling', desc: 'JSON, state, and data operations', color: 'from-pink-500 to-rose-500' },
              { icon: Server, title: 'Server Integration', desc: 'HTTP requests and WebSocket', color: 'from-indigo-500 to-blue-500' },
              { icon: Layers, title: 'Group / ID / Name', desc: 'Element grouping and identification', color: 'from-red-500 to-pink-500' },
              { icon: Palette, title: 'Color Blending', desc: 'Advanced color operations', color: 'from-slate-500 to-slate-400' },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group relative p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Playground */}
      <section id="playground" className="relative py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Try Droy 3.0
              </span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Write code and see the result instantly
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-indigo-500/10"
          >
            <div className="bg-[#1e1e2e] px-4 py-3 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-sm text-slate-500">app.droy</span>
              </div>
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 gap-2"
                onClick={compileCode}
                disabled={isCompiling}
              >
                {isCompiling ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                    <Terminal className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <Play className="w-4 h-4" />
                )}
                Run
              </Button>
            </div>

            <div className="grid lg:grid-cols-2">
              <div className="bg-[#0d0d12] min-h-[500px]">
                <CodeEditorV3 code={code} onChange={setCode} />
              </div>

              <div className="bg-[#1a1a2e] border-t lg:border-t-0 lg:border-r border-white/10">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="w-full bg-[#16162a] rounded-none border-b border-white/10 p-0 h-12">
                    <TabsTrigger value="preview" className="flex-1 rounded-none data-[state=active]:bg-[#1a1a2e]">
                      <Monitor className="w-4 h-4 ml-2" />
                      Preview
                    </TabsTrigger>
                    <TabsTrigger value="output" className="flex-1 rounded-none data-[state=active]:bg-[#1a1a2e]">
                      <Terminal className="w-4 h-4 ml-2" />
                      Output
                    </TabsTrigger>
                    <TabsTrigger value="html" className="flex-1 rounded-none data-[state=active]:bg-[#1a1a2e]">
                      <Paintbrush className="w-4 h-4 ml-2" />
                      HTML
                    </TabsTrigger>
                    <TabsTrigger value="css" className="flex-1 rounded-none data-[state=active]:bg-[#1a1a2e]">
                      <Palette className="w-4 h-4 ml-2" />
                      CSS
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="preview" className="m-0 p-4 min-h-[450px]">
                    {html ? (
                      <div>
                        <style>{css}</style>
                        <div dangerouslySetInnerHTML={{ __html: html }} />
                      </div>
                    ) : (
                      <div className="text-slate-500 text-center py-20">
                        <Monitor className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        Click "Run" to see preview
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="output" className="m-0">
                    <div className="p-4 font-mono text-sm min-h-[450px]">
                      {output ? (
                        <pre className="text-green-400 whitespace-pre-wrap">{output}</pre>
                      ) : (
                        <div className="text-slate-500 text-center py-20">
                          <Terminal className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          Click "Run" to see output
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="html" className="m-0">
                    <div className="relative">
                      <Button size="sm" variant="ghost" className="absolute top-2 left-2 z-10" onClick={() => copyCode(html)}>
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                      <div className="p-4 font-mono text-sm min-h-[450px] overflow-auto">
                        <pre className="text-slate-300">{html || '<!-- Click "Run" to generate HTML -->'}</pre>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="css" className="m-0">
                    <div className="relative">
                      <Button size="sm" variant="ghost" className="absolute top-2 left-2 z-10" onClick={() => copyCode(css)}>
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                      <div className="p-4 font-mono text-sm min-h-[450px] overflow-auto">
                        <pre className="text-slate-300">{css || '/* Click "Run" to generate CSS */'}</pre>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Documentation Section */}
      <section id="docs" className="relative py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Documentation
              </span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Learn Droy 3.0 concepts and syntax
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documentation.map((doc, index) => (
              <motion.div
                key={doc.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-white/5 border border-white/10"
              >
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <doc.icon className="w-5 h-5 text-indigo-400" />
                  {doc.title}
                </h3>
                <div 
                  className="text-slate-400 text-sm leading-relaxed prose prose-invert prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: doc.content }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Examples Section */}
      <section id="examples" className="relative py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Examples
              </span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Practical examples for learning Droy 3.0
            </p>
          </motion.div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {exampleCategories.map((cat, idx) => (
              <Button
                key={cat.name}
                variant={selectedCategory === idx ? 'default' : 'outline'}
                size="sm"
                className={selectedCategory === idx 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600' 
                  : 'border-slate-700 hover:bg-slate-800'
                }
                onClick={() => setSelectedCategory(idx)}
              >
                <cat.icon className="w-4 h-4 ml-2" />
                {cat.name}
              </Button>
            ))}
          </div>

          {/* Examples Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {exampleCategories[selectedCategory]?.examples.map((example, index) => (
              <motion.div
                key={example.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative rounded-2xl overflow-hidden border border-white/10 bg-[#0d0d12]"
              >
                <div className="p-4 bg-[#1e1e2e] border-b border-white/10 flex items-center justify-between">
                  <span className="text-sm font-medium">{example.name}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="opacity-0 group-hover:opacity-100 transition-opacity gap-1"
                    onClick={() => loadExample(example.code)}
                  >
                    <Play className="w-3 h-3" />
                    Run
                  </Button>
                </div>
                <div className="p-4 font-mono text-xs overflow-auto max-h-[250px]">
                  <pre className="text-slate-300">{example.code}</pre>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Code2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Droy <span className="text-sm text-slate-500">v3.0</span></span>
              </div>
              <p className="text-slate-400 text-sm max-w-md">
                Advanced programming language with SET/SETUP naming, TOOL concept, 
                value operations, data handling, and server integration.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Links</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#playground" className="hover:text-white transition-colors">Playground</a></li>
                <li><a href="#docs" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#examples" className="hover:text-white transition-colors">Examples</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <a href="https://github.com/droy-go/droy-lang" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2">
                    <Github className="w-4 h-4" />
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">
              2026 Droy Language. All rights reserved.
            </p>
            <p className="text-slate-600 text-sm">
              Made with <span className="text-red-500">♥</span> for developers
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
