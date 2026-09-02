import { useSeoMeta } from '@unhead/react';
import { SiteNav } from '@/components/SiteNav';
import { SiteFooter } from '@/components/SiteFooter';

// All logo assets (SVGs + PNGs served locally from /public)
const logos = {
  horizontalLight:    { svg: '/nsp-logo-horizontal.svg',           png: '/nsp-logo-horizontal.png' },
  horizontalDark:     { svg: '/nsp-logo-horizontal-dark.svg',      png: '/nsp-logo-horizontal-dark.png' },
  horizontalMono:     { svg: '/nsp-logo-horizontal-mono-white.svg', png: '/nsp-logo-horizontal-mono-white.png' },
  compactLight:       { svg: '/nsp-logo-compact.svg',              png: '/nsp-logo-compact.png' },
  compactDark:        { svg: '/nsp-logo-compact-dark.svg',         png: '/nsp-logo-compact-dark.png' },
  badge:              { svg: '/nsp-badge.svg',                     png: '/nsp-badge.png' },
  starBlue:           { svg: '/nsp-star.svg',                      png: '/nsp-star.png' },
  starWhite:          { svg: '/nsp-star-white.svg',                png: '/nsp-star-white.png' },
};

interface ColorSwatchProps {
  hex: string;
  name: string;
  usage: string;
  dark?: boolean;
}

function ColorSwatch({ hex, name, usage, dark = false }: ColorSwatchProps) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className="h-20 rounded-[2px] border border-border"
        style={{ background: hex }}
      />
      <div>
        <div className={`text-xs font-mono font-bold ${dark ? 'text-foreground' : 'text-foreground'}`}>{hex}</div>
        <div className="text-sm font-bold text-foreground">{name}</div>
        <div className="text-xs text-muted-foreground">{usage}</div>
      </div>
    </div>
  );
}

interface LogoCardProps {
  src: string;
  label: string;
  bg: string;
  downloadSvg?: string;
  downloadPng?: string;
}

function LogoCard({ src, label, bg, downloadSvg, downloadPng }: LogoCardProps) {
  return (
    <div className="card-accent overflow-hidden">
      <div
        className="flex items-center justify-center p-8 min-h-[140px]"
        style={{ background: bg }}
      >
        <img src={src} alt={label} className="max-h-16 max-w-full object-contain" />
      </div>
      <div className="px-5 py-4 flex flex-col gap-2">
        <span className="text-xs text-muted-foreground font-medium">{label}</span>
        <div className="flex gap-3">
          {downloadSvg && (
            <a
              href={downloadSvg}
              download
              className="text-[11px] font-bold uppercase tracking-widest text-[#1E8EFF] hover:underline"
            >
              SVG ↓
            </a>
          )}
          {downloadPng && (
            <a
              href={downloadPng}
              download
              className="text-[11px] font-bold uppercase tracking-widest text-[#1E8EFF] hover:underline"
            >
              PNG ↓
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

const StylePage = () => {
  useSeoMeta({
    title: 'Style Guide — Northstar Pioneers',
    description: 'Brand colors, typography, logos, and visual guidelines for Northstar Pioneers.',
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      {/* Page header */}
      <div className="relative isolate overflow-hidden border-b border-border">
        <div
          className="absolute inset-0 -z-10 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(#1E8EFF 1px, transparent 1px), linear-gradient(90deg, #1E8EFF 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="pioneer-label mb-3">Brand</div>
          <h1
            className="font-black uppercase text-4xl sm:text-5xl text-foreground"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            Style <span className="text-[#1E8EFF]">Guide</span>
          </h1>
          <p className="text-muted-foreground mt-3 max-w-lg">
            Visual identity guidelines for Northstar Pioneers — colors, typography, logos, and usage rules.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-16">

        {/* ── LOGO ─────────────────────────────────────────────── */}
        <section>
          <div className="pioneer-label mb-2">01</div>
          <h2
            className="font-black uppercase text-2xl sm:text-3xl text-foreground mb-2"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            Logo
          </h2>
          <p className="text-sm text-muted-foreground mb-8 max-w-xl">
            The Northstar Pioneers wordmark pairs a bold condensed typeface with the five-pointed
            star mark. Use the appropriate variant based on background context.
          </p>

          {/* Horizontal */}
          <div className="pioneer-label mb-4">Horizontal Lockup</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            <LogoCard
              src={logos.horizontalLight.svg}
              label="Full Color — Light background"
              bg="#FFFFFF"
              downloadSvg={logos.horizontalLight.svg}
              downloadPng={logos.horizontalLight.png}
            />
            <LogoCard
              src={logos.horizontalDark.svg}
              label="Full Color — Dark background"
              bg="#0A0A0A"
              downloadSvg={logos.horizontalDark.svg}
              downloadPng={logos.horizontalDark.png}
            />
            <LogoCard
              src={logos.horizontalMono.svg}
              label="Mono White — Dark background"
              bg="#1C4F8A"
              downloadSvg={logos.horizontalMono.svg}
              downloadPng={logos.horizontalMono.png}
            />
          </div>

          {/* Compact / Badge */}
          <div className="pioneer-label mb-4">Compact & Badge</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <LogoCard
              src={logos.compactLight.svg}
              label="Compact — Light background"
              bg="#FFFFFF"
              downloadSvg={logos.compactLight.svg}
              downloadPng={logos.compactLight.png}
            />
            <LogoCard
              src={logos.compactDark.svg}
              label="Compact — Dark background"
              bg="#0A0A0A"
              downloadSvg={logos.compactDark.svg}
              downloadPng={logos.compactDark.png}
            />
            <LogoCard
              src={logos.badge.svg}
              label="Badge"
              bg="#F4F5F7"
              downloadSvg={logos.badge.svg}
              downloadPng={logos.badge.png}
            />
            <div className="card-accent overflow-hidden">
              <div className="flex items-center justify-center gap-6 p-8 min-h-[140px] bg-[#0A0A0A]">
                <img src={logos.starBlue.svg} alt="Star — Blue" className="h-14 object-contain" />
                <img src={logos.starWhite.svg} alt="Star — White" className="h-14 object-contain" />
              </div>
              <div className="px-5 py-4 flex flex-col gap-2">
                <span className="text-xs text-muted-foreground font-medium">Star mark — Blue & White</span>
                <div className="flex gap-3 flex-wrap">
                  <a href={logos.starBlue.svg} download className="text-[11px] font-bold uppercase tracking-widest text-[#1E8EFF] hover:underline">Star SVG ↓</a>
                  <a href={logos.starBlue.png} download className="text-[11px] font-bold uppercase tracking-widest text-[#1E8EFF] hover:underline">Star PNG ↓</a>
                  <a href={logos.starWhite.svg} download className="text-[11px] font-bold uppercase tracking-widest text-[#1E8EFF] hover:underline">White SVG ↓</a>
                  <a href={logos.starWhite.png} download className="text-[11px] font-bold uppercase tracking-widest text-[#1E8EFF] hover:underline">White PNG ↓</a>
                </div>
              </div>
            </div>
          </div>

          {/* Logo don'ts */}
          <div className="border-l-4 border-[#1E8EFF]/30 pl-5 py-1 space-y-1">
            <h3 className="text-sm font-bold text-foreground">Usage Rules</h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Do not alter colors, proportions, or letter-spacing</li>
              <li>Maintain clear space equal to the height of the star mark on all sides</li>
              <li>Use the mono white version only on solid dark or photo backgrounds</li>
              <li>Minimum size: 120px wide for horizontal lockup, 32px for the star alone</li>
            </ul>
          </div>
        </section>

        {/* ── COLORS ───────────────────────────────────────────── */}
        <section>
          <div className="pioneer-label mb-2">02</div>
          <h2
            className="font-black uppercase text-2xl sm:text-3xl text-foreground mb-2"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            Colors
          </h2>
          <p className="text-sm text-muted-foreground mb-8 max-w-xl">
            A high-contrast dark-first palette anchored by Pioneer Blue. The brand runs dark by default;
            light mode uses the same hues against an off-white surface.
          </p>

          <div className="pioneer-label mb-4">Primary</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
            <ColorSwatch hex="#1E8EFF" name="Pioneer Blue" usage="Primary CTA, accents, links" />
            <ColorSwatch hex="#5AB0FF" name="Pioneer Blue Bright" usage="Labels, hover states" />
            <ColorSwatch hex="#0D5ECC" name="Pioneer Blue Dark" usage="Light mode labels" />
            <ColorSwatch hex="#0A0A0A" name="Space Black" usage="Dark bg, dark headings" />
            <ColorSwatch hex="#FFFFFF" name="White" usage="Light text on dark" />
          </div>

          <div className="pioneer-label mb-4">Dark Mode Surfaces</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
            <ColorSwatch hex="#0A0A0A" name="Background" usage="Page background" />
            <ColorSwatch hex="#141414" name="Card" usage="Card / elevated surface" />
            <ColorSwatch hex="#1A1A1A" name="Secondary" usage="Muted bg, input" />
            <ColorSwatch hex="#2A2A2A" name="Border" usage="Dividers, borders" />
            <ColorSwatch hex="#D0D0D0" name="Foreground" usage="Body text" />
          </div>

          <div className="pioneer-label mb-4">Light Mode Surfaces</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
            <ColorSwatch hex="#F4F5F7" name="Background" usage="Page background" />
            <ColorSwatch hex="#FFFFFF" name="Card" usage="Card / elevated surface" />
            <ColorSwatch hex="#E2E5EA" name="Secondary" usage="Muted bg, input" />
            <ColorSwatch hex="#D0D4DC" name="Border" usage="Dividers, borders" />
            <ColorSwatch hex="#252525" name="Foreground" usage="Body text" />
          </div>

          <div className="pioneer-label mb-4">Glow & Overlay</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <ColorSwatch hex="rgba(30,142,255,0.15)" name="Blue Glow" usage="Tag pill backgrounds" />
            <ColorSwatch hex="rgba(30,142,255,0.35)" name="Blue Border" usage="Tag pill borders" />
          </div>
        </section>

        {/* ── TYPOGRAPHY ───────────────────────────────────────── */}
        <section>
          <div className="pioneer-label mb-2">03</div>
          <h2
            className="font-black uppercase text-2xl sm:text-3xl text-foreground mb-2"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            Typography
          </h2>
          <p className="text-sm text-muted-foreground mb-8 max-w-xl">
            Two weights of the Barlow family carry all type. Condensed for display; regular for body.
            No other typefaces should be introduced.
          </p>

          <div className="space-y-6">
            {/* Display */}
            <div className="card-accent p-6">
              <div className="pioneer-label mb-3">Display — Barlow Condensed 800</div>
              <p
                className="font-black uppercase text-foreground leading-none"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 'clamp(36px,6vw,72px)' }}
              >
                We Take Up<br />The Task <span className="text-[#1E8EFF]">Eternal.</span>
              </p>
              <p className="text-xs text-muted-foreground mt-4">
                Used for: Hero headlines, section titles, event names
              </p>
            </div>

            {/* Heading */}
            <div className="card-accent p-6">
              <div className="pioneer-label mb-3">Heading — Barlow 800</div>
              <p className="text-3xl font-extrabold text-foreground">
                Sovereign Thinking. Human <span className="text-[#1E8EFF]">Flourishing.</span>
              </p>
              <p className="text-xs text-muted-foreground mt-4">
                Used for: Section headings, card titles (h2–h3)
              </p>
            </div>

            {/* Body */}
            <div className="card-accent p-6">
              <div className="pioneer-label mb-3">Body — Barlow 400</div>
              <p className="text-base text-foreground/80 leading-relaxed max-w-xl">
                Northstar Pioneers are builders, thinkers, and storytellers who believe
                intelligence should be sovereign, shared, and open to everyone brave enough
                to ask, "what if."
              </p>
              <p className="text-xs text-muted-foreground mt-4">
                Used for: Paragraphs, descriptions. Base size: 15px / line-height: 1.65
              </p>
            </div>

            {/* Label */}
            <div className="card-accent p-6">
              <div className="pioneer-label mb-3">Label — Barlow 700 Uppercase</div>
              <div className="flex flex-wrap gap-6 items-center">
                <span className="pioneer-label">Monthly Mastermind</span>
                <span className="tag-pill">Upcoming</span>
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Section Label</span>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Used for: Section eyebrows (pioneer-label), tag pills, metadata labels
              </p>
            </div>
          </div>
        </section>

        {/* ── UI COMPONENTS ────────────────────────────────────── */}
        <section>
          <div className="pioneer-label mb-2">04</div>
          <h2
            className="font-black uppercase text-2xl sm:text-3xl text-foreground mb-2"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            UI Components
          </h2>
          <p className="text-sm text-muted-foreground mb-8 max-w-xl">
            Sharp 2px radius on all interactive elements. Buttons use all-caps tracking-widest.
            Cards use a 3px blue top border accent.
          </p>

          {/* Buttons */}
          <div className="card-accent p-6 mb-4">
            <div className="pioneer-label mb-4">Buttons</div>
            <div className="flex flex-wrap gap-3 items-center">
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="inline-block bg-[#1E8EFF] text-black font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-[2px] hover:brightness-110 transition-all"
              >
                Primary CTA
              </a>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="inline-block text-[#1E8EFF] border border-[#1E8EFF]/40 font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-[2px] hover:bg-[#1E8EFF]/10 transition-colors"
              >
                Secondary
              </a>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="inline-block text-muted-foreground border border-border font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-[2px] hover:text-foreground hover:border-foreground/40 transition-colors"
              >
                Tertiary
              </a>
            </div>
          </div>

          {/* Cards */}
          <div className="card-accent p-6 mb-4">
            <div className="pioneer-label mb-4">Card Accent</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="card-accent p-5">
                <div className="text-xs font-bold uppercase tracking-widest text-[#5AB0FF] mb-1">Category</div>
                <h3 className="font-bold text-foreground mb-2">Card Title</h3>
                <p className="text-sm text-muted-foreground">Body copy inside a card — muted foreground, 14px.</p>
              </div>
              <div className="card-accent p-5">
                <div className="text-[#1E8EFF] font-mono text-sm font-bold mb-2">01</div>
                <h3 className="text-base font-bold text-foreground mb-1">Numbered Topic Card</h3>
                <p className="text-sm text-muted-foreground">Used in Socratic Review topic lists.</p>
              </div>
            </div>
          </div>

          {/* Dividers / borders */}
          <div className="card-accent p-6">
            <div className="pioneer-label mb-4">Dividers & Grid Lines</div>
            <div className="space-y-3">
              <div className="border-t border-border pt-3">
                <span className="text-xs text-muted-foreground">border-border — standard cell separator</span>
              </div>
              <div className="border-l-4 border-[#1E8EFF] pl-4">
                <span className="text-sm text-foreground font-light italic">
                  "Take up the task eternal, the burden, & the lesson."
                </span>
              </div>
              <div className="border-l-[3px] border-[#1E8EFF]/30 pl-4">
                <span className="text-xs text-muted-foreground">border-l-[3px] border-[#1E8EFF]/30 — values sidebar accent</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── VOICE ────────────────────────────────────────────── */}
        <section>
          <div className="pioneer-label mb-2">05</div>
          <h2
            className="font-black uppercase text-2xl sm:text-3xl text-foreground mb-2"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            Voice & Tone
          </h2>
          <div className="space-y-4 mt-6">
            {[
              {
                title: 'Direct',
                desc: 'No hedging. No corporate speak. Say what you mean. "Come ready to build" not "We hope you\'ll consider joining us."',
              },
              {
                title: 'Earned Confidence',
                desc: 'Bold but not arrogant. The voice knows its ground. Speak plainly about hard things.',
              },
              {
                title: 'Poetic Economy',
                desc: 'Short sentences land harder than long ones. Favor the concrete image over the abstract noun.',
              },
              {
                title: 'Inclusive Pioneer',
                desc: '"A question is a kind of labor." Everyone who shows up with curiosity belongs here.',
              },
            ].map((v) => (
              <div key={v.title} className="border-l-[3px] border-[#1E8EFF]/30 pl-5 py-1">
                <h3 className="font-bold text-foreground mb-1">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

      </div>

      <SiteFooter />
    </div>
  );
};

export default StylePage;
