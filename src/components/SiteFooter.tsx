import { Link } from 'react-router-dom';

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background mt-24">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="text-[#1E8EFF] text-xl mb-1">★</div>
            <div
              className="font-black uppercase text-2xl tracking-wide leading-none text-foreground mb-3"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              Northstar <span className="text-[#1E8EFF]">Pioneers</span>
            </div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider leading-relaxed">
              Take up the task eternal,<br />the burden, & the lesson.
            </p>
          </div>

          {/* Nav */}
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-[#5AB0FF] mb-4">
              Navigate
            </div>
            <ul className="space-y-2">
              {[
                { label: 'Home', to: '/' },
                { label: 'Events Archive', to: '/events' },
                { label: 'About', to: '/about' },
              ].map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-[#5AB0FF] mb-4">
              Community
            </div>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.meetup.com/northstar-pioneers/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-[#1E8EFF] transition-colors"
                >
                  Meetup Group ↗
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/northstarpioneerscommunity"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-[#1E8EFF] transition-colors"
                >
                  Telegram ↗
                </a>
              </li>
            </ul>
            <div className="mt-6 text-xs text-muted-foreground uppercase tracking-wider">
              Greater Twin Cities, MN
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Northstar Pioneers · Minnesota
          </p>
          <a
            href="https://shakespeare.diy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:text-[#1E8EFF] transition-colors"
          >
            Vibed with Shakespeare ✦
          </a>
        </div>
      </div>
    </footer>
  );
}
