import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Events', to: '/events' },
  { label: 'Pioneers', to: '/pioneers' },
  { label: 'About', to: '/about' },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex flex-col leading-none group"
          onClick={() => setOpen(false)}
        >
          <span className="text-[#1E8EFF] text-lg leading-none">★</span>
          <span
            className="font-display font-black uppercase text-xl tracking-wide leading-none text-foreground group-hover:text-[#1E8EFF] transition-colors"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            Northstar <span className="text-[#1E8EFF]">Pioneers</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                cn(
                  'text-sm font-bold uppercase tracking-widest transition-colors',
                  isActive
                    ? 'text-[#1E8EFF]'
                    : 'text-muted-foreground hover:text-foreground'
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Right controls */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="https://www.meetup.com/northstar-pioneers/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold uppercase tracking-widest text-[#1E8EFF] border border-[#1E8EFF]/40 hover:bg-[#1E8EFF]/10 px-4 py-2 rounded-[2px] transition-colors"
          >
            Meetup ↗
          </a>
          <a
            href="https://t.me/northstarpioneerscommunity"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold uppercase tracking-widest text-muted-foreground border border-border hover:text-foreground hover:border-foreground/40 px-4 py-2 rounded-[2px] transition-colors"
          >
            Telegram
          </a>
          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors rounded"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-muted-foreground hover:text-foreground"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="flex flex-col px-6 py-4 gap-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'text-sm font-bold uppercase tracking-widest py-2 transition-colors',
                    isActive ? 'text-[#1E8EFF]' : 'text-muted-foreground'
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
            <div className="flex gap-3 pt-2 border-t border-border">
              <a
                href="https://www.meetup.com/northstar-pioneers/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold uppercase tracking-widest text-[#1E8EFF] border border-[#1E8EFF]/40 px-4 py-2 rounded-[2px]"
              >
                Meetup ↗
              </a>
              <a
                href="https://t.me/northstarpioneerscommunity"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold uppercase tracking-widest text-muted-foreground border border-border px-4 py-2 rounded-[2px]"
              >
                Telegram
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
