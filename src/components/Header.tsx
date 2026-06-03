import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Menu, Bot, Cpu, Network, Sparkles, Send, Home, Shield, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import HashBar from "./HashBar";

const navSections = [
  {
    label: "Generative AI",
    icon: Sparkles,
    links: [
      { label: "Text Generation", href: "/category/Text%20Generation" },
      { label: "Image Generation", href: "/category/Image%20Generation" },
      { label: "Video Generation", href: "/category/Video%20Generation" },
      { label: "Audio & Music", href: "/category/Audio%20%26%20Music" },
    ],
  },
  {
    label: "AI Agents",
    icon: Bot,
    links: [
      { label: "Chatbot", href: "/category/Chatbot" },
      { label: "Code Assistant", href: "/category/Code%20Assistant" },
      { label: "Writing Assistant", href: "/category/Writing%20Assistant" },
      { label: "Research", href: "/category/Research" },
    ],
  },
  {
    label: "Network Flow",
    icon: Network,
    links: [
      { label: "Data Analysis", href: "/category/Data%20Analysis" },
      { label: "Productivity", href: "/category/Productivity" },
      { label: "Marketing", href: "/category/Marketing" },
      { label: "Education", href: "/category/Education" },
    ],
  },
];

const Header = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50">
      <HashBar />
      <div className="border-b border-border bg-card/95 backdrop-blur-md">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="relative">
              <img src="/logo.png" alt="AI~Agent Crew" className="h-10 w-10 rounded-lg object-contain" />
              <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-chain border-2 border-card animate-pulse-chain" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight font-display text-foreground leading-tight">
                AI~Agent <span className="text-primary">Crew</span>
              </span>
              <span className="text-[9px] font-mono text-muted-foreground tracking-widest uppercase">Blockchain Secured</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/">
              <Button variant={location.pathname === "/" ? "default" : "ghost"} size="sm" className="gap-1.5">
                <Home className="h-4 w-4" /> Home
              </Button>
            </Link>
            <Link to="/analyzer">
              <Button variant={location.pathname === "/analyzer" ? "default" : "ghost"} size="sm" className="gap-1.5">
                <Cpu className="h-4 w-4" /> AI Matchmaker
              </Button>
            </Link>
            <Link to="/submit">
              <Button variant={location.pathname === "/submit" ? "default" : "ghost"} size="sm" className="gap-1.5">
                <Shield className="h-4 w-4" /> Submit & Verify
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="ml-2 gap-1.5">
                <Lock className="h-3.5 w-3.5" /> Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-card">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="flex flex-col gap-1 mt-8">
                <Link to="/" onClick={() => setOpen(false)} className="px-4 py-3 rounded-lg text-sm font-medium text-foreground hover:bg-secondary transition-colors flex items-center gap-2">
                  <Home className="h-4 w-4" /> Home
                </Link>
                <Link to="/analyzer" onClick={() => setOpen(false)} className="px-4 py-3 rounded-lg text-sm font-medium text-foreground hover:bg-secondary transition-colors flex items-center gap-2">
                  <Cpu className="h-4 w-4" /> AI Matchmaker
                </Link>
                <Link to="/submit" onClick={() => setOpen(false)} className="px-4 py-3 rounded-lg text-sm font-medium text-foreground hover:bg-secondary transition-colors flex items-center gap-2">
                  <Shield className="h-4 w-4" /> Submit & Verify
                </Link>
                <div className="border-t border-border my-3" />
                {navSections.map((section) => (
                  <div key={section.label} className="mb-2">
                    <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-2">
                      <section.icon className="h-3.5 w-3.5" /> {section.label}
                    </div>
                    {section.links.map((link) => (
                      <Link key={link.href} to={link.href} onClick={() => setOpen(false)}
                        className="px-6 py-2.5 block text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md transition-colors">
                        {link.label}
                      </Link>
                    ))}
                  </div>
                ))}
                <Link to="/register" onClick={() => setOpen(false)}>
                  <Button className="w-full mt-4 gap-1.5"><Lock className="h-3.5 w-3.5" /> Get Started</Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Desktop category nav */}
      <nav className="hidden md:block border-b border-border bg-card/60 backdrop-blur-sm">
        <div className="container flex items-center gap-0 h-11">
          {navSections.map((section) => (
            <div key={section.label} className="relative"
              onMouseEnter={() => setActiveSection(section.label)}
              onMouseLeave={() => setActiveSection(null)}>
              <button className={cn(
                "flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors rounded-md",
                activeSection === section.label ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
              )}>
                <section.icon className="h-4 w-4" /> {section.label}
              </button>
              {activeSection === section.label && (
                <div className="absolute top-full left-0 mt-0 w-52 bg-card border border-border rounded-lg shadow-lg py-2 z-50">
                  {section.links.map((link) => (
                    <Link key={link.href} to={link.href}
                      className="block px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Header;
