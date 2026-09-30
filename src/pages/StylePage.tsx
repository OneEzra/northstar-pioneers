import { usePageSeo } from '@/lib/seo';
import { SiteNav } from '@/components/SiteNav';
import { SiteFooter } from '@/components/SiteFooter';

const StylePage = () => {
  usePageSeo({
    title: 'Brand & Style Guide — Northstar Pioneers',
    description: 'The brand and UI style guide for Northstar Pioneers — colors, typography, logo usage, and components.',
    path: '/style',
    noindex: true,
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      {/* Scoped styles for this page only */}
      <style>{`
        .sg-wrap { max-width: 1180px; margin: 0 auto; padding: 0 clamp(20px,5vw,48px); }
        .sg-section { padding: clamp(56px,8vw,104px) 0; border-top: 1px solid var(--border); }
        .sg-section:first-of-type { border-top: none; }

        /* type */
        .sg-display { font-family: 'Barlow Condensed',sans-serif; font-weight: 900; text-transform: uppercase; line-height: 0.92; letter-spacing: 0.02em; color: var(--card-foreground); }
        .sg-sec-label { display: flex; align-items: center; gap: 12px; font-weight: 800; font-size: 12px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--pioneer-blue-bright); margin-bottom: 32px; }
        .sg-sec-label::after { content: ''; flex: 1; height: 1px; background: var(--border); }
        .light .sg-sec-label { color: var(--pioneer-blue-dark); }
        .sg-sec-title { font-family: 'Barlow Condensed',sans-serif; font-weight: 900; font-size: clamp(38px,5.5vw,62px); line-height: 0.95; text-transform: uppercase; color: var(--card-foreground); letter-spacing: 0.02em; margin-bottom: 16px; }
        .sg-lead { font-size: clamp(17px,2vw,20px); line-height: 1.6; color: var(--foreground); max-width: 68ch; }
        .sg-muted { color: var(--muted-foreground); }
        .sg-mono { font-family: ui-monospace,'SFMono-Regular',Menlo,Consolas,monospace; font-size: 12.5px; color: var(--muted-foreground); }

        /* grid */
        .sg-g2 { display: grid; gap: 24px; grid-template-columns: repeat(auto-fit,minmax(300px,1fr)); }
        .sg-g3 { display: grid; gap: 24px; grid-template-columns: repeat(auto-fit,minmax(260px,1fr)); }
        .sg-g4 { display: grid; gap: 16px; grid-template-columns: repeat(auto-fit,minmax(140px,1fr)); }

        /* panel */
        .sg-panel { background: var(--card); border: 1px solid var(--border); border-radius: 6px; padding: clamp(22px,3vw,32px); }
        .sg-panel-head { font-size: 12px; font-weight: 800; letter-spacing: 0.2em; text-transform: uppercase; color: var(--pioneer-blue-bright); margin-bottom: 24px; padding-bottom: 12px; border-bottom: 1px solid var(--border); }
        .light .sg-panel-head { color: var(--pioneer-blue-dark); }

        /* chips */
        .sg-chip { border: 1px solid var(--border); border-radius: 4px; overflow: hidden; background: var(--card); }
        .sg-chip .sw { height: 84px; }
        .sg-chip .info { padding: 10px 14px 14px; }
        .sg-chip .nm { font-size: 14px; font-weight: 700; color: var(--card-foreground); }
        .sg-chip .hx { font-family: ui-monospace,monospace; font-size: 12px; color: var(--muted-foreground); margin-top: 3px; }
        .sg-chip .us { font-size: 12px; color: var(--muted-foreground); margin-top: 8px; line-height: 1.45; }

        /* type specimens */
        .sg-spec { border-left: 3px solid #1E8EFF; padding-left: 16px; margin-bottom: 32px; }
        .sg-spec:last-child { margin-bottom: 0; }
        .sg-spec-meta { font-family: ui-monospace,monospace; font-size: 11.5px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--pioneer-blue-bright); margin-bottom: 8px; }
        .light .sg-spec-meta { color: var(--pioneer-blue-dark); }

        /* logo tiles */
        .sg-logo-tile { border: 1px solid var(--border); border-radius: 4px; overflow: hidden; }
        .sg-logo-tile .art { display: flex; align-items: center; justify-content: center; padding: 36px 28px; min-height: 180px; gap: 40px; }
        .sg-logo-tile .art.on-dark { background: #0A0A0A; }
        .sg-logo-tile .art.on-light { background: #F4F5F7; }
        .sg-logo-tile .cap { background: var(--card); border-top: 1px solid var(--border); padding: 10px 14px; display: flex; justify-content: space-between; align-items: baseline; gap: 12px; flex-wrap: wrap; }
        .sg-logo-tile .cap .nm { font-size: 13px; font-weight: 700; color: var(--card-foreground); }
        .sg-logo-tile .cap .fp { font-family: ui-monospace,monospace; font-size: 11px; color: var(--muted-foreground); }

        /* clear space */
        .sg-clearspace { position: relative; display: inline-flex; padding: 44px; border: 1px dashed rgba(30,142,255,0.35); background: #0A0A0A; border-radius: 4px; }
        .sg-clearspace::before { content: ''; position: absolute; inset: 22px; border: 1px dashed rgba(255,255,255,0.14); }
        .sg-cs-x { position: absolute; font-family: ui-monospace,monospace; font-size: 11px; color: #5AB0FF; background: #0A0A0A; padding: 0 6px; }
        .sg-cs-top { top: -8px; left: 50%; transform: translateX(-50%); }
        .sg-cs-left { left: -8px; top: 50%; transform: translateY(-50%) rotate(-90deg); }

        /* do / dont */
        .sg-rules { display: grid; grid-template-columns: repeat(auto-fit,minmax(300px,1fr)); gap: 16px; }
        .sg-rule { padding: 24px; border-radius: 2px; }
        .sg-rule-do { background: rgba(30,142,255,0.07); border: 1px solid rgba(30,142,255,0.35); }
        .sg-rule-dont { background: rgba(255,85,85,0.06); border: 1px solid rgba(255,85,85,0.22); }
        .sg-rule .hd { font-size: 12px; font-weight: 800; letter-spacing: 0.18em; text-transform: uppercase; margin-bottom: 16px; }
        .sg-rule-do .hd { color: #1E8EFF; }
        .sg-rule-dont .hd { color: #FF5555; }
        .sg-rule li { position: relative; padding-left: 20px; margin-bottom: 10px; font-size: 14px; line-height: 1.5; color: var(--foreground); list-style: none; }
        .sg-rule li:last-child { margin-bottom: 0; }
        .sg-rule-do li::before { content: '✓'; position: absolute; left: 0; color: #1E8EFF; font-weight: 700; }
        .sg-rule-dont li::before { content: '✗'; position: absolute; left: 0; color: #FF5555; font-weight: 700; }

        /* spec list */
        .sg-speclist { display: flex; flex-direction: column; gap: 12px; }
        .sg-specrow { display: grid; grid-template-columns: 110px 1fr; gap: 16px; align-items: center; padding-bottom: 12px; border-bottom: 1px solid var(--border); }
        .sg-specrow:last-child { border-bottom: none; padding-bottom: 0; }
        .sg-specrow .k { font-family: ui-monospace,monospace; font-size: 12px; color: var(--pioneer-blue-bright); }
        .light .sg-specrow .k { color: var(--pioneer-blue-dark); }
        .sg-specrow .v { font-size: 14px; color: var(--foreground); }
        .sg-bar { height: 14px; background: #1E8EFF; border-radius: 1px; }

        /* code */
        .sg-pre { background: #0F0F0F; border: 1px solid var(--border); border-radius: 4px; padding: 24px; overflow-x: auto; font-family: ui-monospace,monospace; font-size: 12.5px; line-height: 1.7; color: var(--foreground); }
        .sg-pre .c { color: #5A6272; }
        .sg-pre .t { color: #5AB0FF; }

        /* sg buttons */
        .sg-btn { font-family: 'Barlow',sans-serif; font-size: 13px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; padding: 13px 22px; border-radius: 2px; border: none; cursor: pointer; }
        .sg-btn-primary { background: #1E8EFF; color: #000; }
        .sg-btn-outline { background: transparent; color: #1E8EFF; border: 1.5px solid #1E8EFF; }
        .sg-btn-ghost { background: transparent; color: var(--foreground); border: 1.5px solid var(--border); }

        /* sg tag */
        .sg-tag { display: inline-block; background: rgba(30,142,255,0.15); border: 1px solid rgba(30,142,255,0.35); color: #5AB0FF; font-size: 12px; font-weight: 700; letter-spacing: 0.13em; text-transform: uppercase; padding: 7px 14px; border-radius: 2px; }

        /* sg card */
        .sg-card { background: var(--card); border: 1px solid var(--border); border-top: 3px solid #1E8EFF; border-radius: 2px; padding: 22px; }
        .sg-card .ey { font-size: 12px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: #5AB0FF; margin-bottom: 8px; }
        .sg-card .ti { font-size: 18px; font-weight: 700; color: var(--card-foreground); margin-bottom: 8px; }
        .sg-card .bd { font-size: 14px; line-height: 1.6; color: var(--foreground); }

        /* light demo panel */
        .sg-light-panel { background: #F4F5F7; border-color: #D0D4DC; }
        .sg-light-panel .sg-panel-head { color: #0D5ECC; border-color: #D0D4DC; }
        .sg-light-panel .sg-card .ey { color: #0D5ECC; }
        .sg-light-panel .sg-card .ti { color: #0A0A0A; }
        .sg-light-panel .sg-card .bd { color: #252525; }
        .sg-light-panel .sg-card { background: #fff; border-color: #D0D4DC; }
      `}</style>

      {/* ══ HERO ══ */}
      <header style={{ padding: 'clamp(48px,7vw,88px) 0 clamp(40px,6vw,72px)', borderBottom: '1px solid var(--border)' }}>
        <div className="sg-wrap">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(18px,3vw,32px)', marginBottom: 'clamp(32px,5vw,48px)' }}>
            <svg style={{ width: 'clamp(56px,9vw,88px)', height: 'clamp(56px,9vw,88px)', flex: 'none', color: '#1E8EFF' }} viewBox="0 0 40 40" aria-hidden="true">
              <path d="M20 3 L23.8 15 L36 16.8 L26 24.5 L28.5 36.8 L20 30.5 L11.5 36.8 L14 24.5 L4 16.8 L16.2 15 Z" fill="currentColor" />
            </svg>
            <div>
              <div className="sg-display" style={{ fontSize: 'clamp(44px,8.5vw,88px)', lineHeight: 0.9, letterSpacing: '0.03em' }}>
                <div style={{ color: 'var(--card-foreground)' }}>Northstar</div>
                <div style={{ color: '#1E8EFF' }}>Pioneers</div>
              </div>
              <div style={{ fontWeight: 600, fontSize: 'clamp(11px,1.5vw,14px)', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted-foreground)', marginTop: 12 }}>
                A mastermind collective harnessing the tools of a new frontier
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 24px', fontSize: 13, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted-foreground)', paddingTop: 24, borderTop: '1px solid var(--border)' }}>
            <span style={{ color: '#5AB0FF' }}>Brand &amp; Style Guide</span>
            <span>Version 4.0</span>
            <span>Greater Twin Cities · MN</span>
          </div>
        </div>
      </header>

      {/* ══ INDEX NAV ══ */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 20, background: 'rgba(10,10,10,0.94)', borderBottom: '1px solid var(--border)', backdropFilter: 'blur(8px)' }}>
        <div className="sg-wrap" style={{ display: 'flex', flexWrap: 'wrap', gap: 24, padding: '16px clamp(20px,5vw,48px)' }}>
          {['Voice','Logo','Color','Type','Components','Space & Motion','Do & Don\'t','Tokens'].map((label, i) => (
            <a key={label} href={`#sg-${['voice','logo','color','type','components','space','rules','tokens'][i]}`}
              style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--muted-foreground)', textDecoration: 'none' }}
              onMouseOver={e => (e.currentTarget.style.color = '#5AB0FF')}
              onMouseOut={e => (e.currentTarget.style.color = 'var(--muted-foreground)')}
            >{label}</a>
          ))}
        </div>
      </nav>

      {/* ══ VOICE ══ */}
      <section id="sg-voice" className="sg-section">
        <div className="sg-wrap">
          <div className="sg-sec-label">01 — Brand Voice</div>
          <h2 className="sg-sec-title">We take up<br />the task <span style={{ color: '#1E8EFF' }}>eternal.</span></h2>
          <p className="sg-lead">Northstar Pioneers is a monthly in-person mastermind in Minneapolis. Builders, thinkers, and operators who believe intelligence is becoming as essential — and as available — as electricity. No gatekeepers. No fluff.</p>

          <div className="sg-g3" style={{ marginTop: 64 }}>
            {[
              { head: 'Tone', title: 'Confident, not corporate', body: 'Short, declarative, a little defiant. The brand is comfortable using a Whitman line in the same breath as "grab a slice."' },
              { head: 'Person', title: 'We and you — never I', body: 'The brand speaks as a collective talking to its members. Imperatives carry the CTAs: Join the collective. Come ready to build.' },
              { head: 'Casing', title: 'Uppercase signals, sentence body', body: 'Wide-tracked uppercase for labels, buttons, and the logo. Sentence case for prose and headlines — title case reads too corporate.' },
            ].map(p => (
              <div key={p.head} className="sg-panel">
                <div className="sg-panel-head">{p.head}</div>
                <h4 style={{ fontWeight: 700, fontSize: 15, letterSpacing: '0.02em', color: 'var(--card-foreground)', marginBottom: 8 }}>{p.title}</h4>
                <p style={{ fontSize: 14, lineHeight: 1.6 }}>{p.body}</p>
              </div>
            ))}
          </div>

          <div className="sg-panel" style={{ marginTop: 24 }}>
            <div className="sg-panel-head">Punctuation signatures</div>
            <div className="sg-g4">
              {[
                { title: 'Middle dot', ex: 'Monday, June 9 · 5–7 PM' },
                { title: 'En dash', ex: '5–7 PM · 5–10 stories' },
                { title: 'Em dash', ex: 'essential — and available' },
                { title: 'Star glyph', ex: '★ Northstar Pioneers' },
              ].map(p => (
                <div key={p.title}>
                  <h4 style={{ fontWeight: 700, fontSize: 15, color: 'var(--card-foreground)', marginBottom: 8 }}>{p.title}</h4>
                  <p className="sg-mono">{p.ex}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ LOGO ══ */}
      <section id="sg-logo" className="sg-section">
        <div className="sg-wrap">
          <div className="sg-sec-label">02 — Logo</div>
          <h2 className="sg-sec-title">The Mark</h2>
          <p className="sg-lead">The wordmark always reads <strong style={{ color: 'var(--card-foreground)' }}>NORTHSTAR</strong> over <strong style={{ color: '#1E8EFF' }}>PIONEERS</strong>. The star is the standalone mark — use it alone only where the full lockup has already appeared.</p>

          <div className="sg-g2" style={{ marginTop: 48 }}>
            {[
              { src: '/logo-lockup-dark.png', alt: 'Northstar Pioneers lockup on dark', bg: 'on-dark', label: 'Primary lockup — dark', file: 'logo-lockup-dark.png' },
              { src: '/logo-lockup-light.png', alt: 'Northstar Pioneers lockup on light', bg: 'on-light', label: 'Primary lockup — light', file: 'logo-lockup-light.png' },
              { src: '/community-badge-600.png', alt: 'Community badge', bg: 'on-dark', label: 'Community badge', file: 'community-badge-600.png', width: 190 },
            ].map(t => (
              <div key={t.file} className="sg-logo-tile">
                <div className={`art sg-logo-tile ${t.bg}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '36px 28px', minHeight: 180, background: t.bg === 'on-dark' ? '#0A0A0A' : '#F4F5F7' }}>
                  <img src={t.src} alt={t.alt} style={{ maxWidth: t.width || 420, width: '100%', objectFit: 'contain' }} />
                </div>
                <div className="cap" style={{ background: 'var(--card)', borderTop: '1px solid var(--border)', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--card-foreground)' }}>{t.label}</span>
                  <span style={{ fontFamily: 'ui-monospace,monospace', fontSize: 11, color: 'var(--muted-foreground)' }}>{t.file}</span>
                </div>
              </div>
            ))}
            <div className="sg-logo-tile">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 40, padding: '36px 28px', minHeight: 180, background: '#0A0A0A' }}>
                <img src="/star-mark-blue.svg" alt="Star mark, blue" style={{ width: 72 }} />
                <img src="/star-mark-white.svg" alt="Star mark, white" style={{ width: 72 }} />
              </div>
              <div style={{ background: 'var(--card)', borderTop: '1px solid var(--border)', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--card-foreground)' }}>Star mark</span>
                <span style={{ fontFamily: 'ui-monospace,monospace', fontSize: 11, color: 'var(--muted-foreground)' }}>star-mark-{'{blue,white,black}'}.svg</span>
              </div>
            </div>
          </div>

          <div className="sg-g2" style={{ marginTop: 48, alignItems: 'start' }}>
            <div>
              <h3 style={{ fontWeight: 800, fontSize: 20, color: 'var(--card-foreground)', lineHeight: 1.25, marginBottom: 12 }}>Clear space</h3>
              <p style={{ marginBottom: 24, fontSize: 14, lineHeight: 1.6 }}>Keep a margin equal to the height of the star (<code className="sg-mono">x</code>) on every side. Nothing crosses it — not type, not rules, not photo edges.</p>
              <div className="sg-clearspace">
                <span className="sg-cs-x sg-cs-top">x</span>
                <span className="sg-cs-x sg-cs-left">x</span>
                <img src="/star-mark-blue.svg" alt="Star mark clear space diagram" style={{ width: 56 }} />
              </div>
            </div>
            <div>
              <h3 style={{ fontWeight: 800, fontSize: 20, color: 'var(--card-foreground)', lineHeight: 1.25, marginBottom: 12 }}>Minimum sizes</h3>
              <div className="sg-speclist" style={{ marginBottom: 24 }}>
                <div className="sg-specrow"><span className="k">Lockup</span><span className="v">160px wide (screen) · 1.25in (print)</span></div>
                <div className="sg-specrow"><span className="k">Star mark</span><span className="v">24px</span></div>
                <div className="sg-specrow"><span className="k">Badge</span><span className="v">64px diameter</span></div>
              </div>
              <div className="sg-rule sg-rule-dont">
                <div className="hd">✗ Never</div>
                <ul>
                  <li>Recolor the wordmark outside white, black, or Pioneer Blue</li>
                  <li>Stretch, rotate, or outline the star</li>
                  <li>Place the lockup on a busy photo without a solid plate</li>
                  <li>Reorder or re-stack the two words</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ COLOR ══ */}
      <section id="sg-color" className="sg-section">
        <div className="sg-wrap">
          <div className="sg-sec-label">03 — Color</div>
          <h2 className="sg-sec-title">One Accent.<br />No Exceptions.</h2>
          <p className="sg-lead">Near-black, near-white, two greys, and a single accent. There is no secondary accent color. Red exists only inside a "don't" callout — it is not a UI color.</p>

          <h3 style={{ fontWeight: 800, fontSize: 20, color: 'var(--card-foreground)', marginTop: 64, marginBottom: 16 }}>Core brand</h3>
          <div className="sg-g4">
            {[
              { bg: '#1E8EFF', nm: 'Pioneer Blue', hx: '#1E8EFF', us: 'Buttons, icons, headline accents, rules. Never body text.' },
              { bg: '#5AB0FF', nm: 'Blue Bright', hx: '#5AB0FF', us: 'Small blue text on dark backgrounds.' },
              { bg: '#0D5ECC', nm: 'Blue Deep', hx: '#0D5ECC', us: 'Small blue text on light. Primary button hover.' },
              { bg: '#0A0A0A', nm: 'Pioneer Black', hx: '#0A0A0A', us: 'Default page background. Headlines on light.', border: true },
            ].map(c => (
              <div key={c.hx} className="sg-chip">
                <div className="sw" style={{ height: 84, background: c.bg, borderBottom: c.border ? '1px solid #2A2A2A' : undefined }} />
                <div className="info" style={{ padding: '10px 14px 14px' }}>
                  <div className="nm" style={{ fontSize: 14, fontWeight: 700, color: 'var(--card-foreground)' }}>{c.nm}</div>
                  <div className="hx sg-mono">{c.hx}</div>
                  <div className="us" style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 8, lineHeight: 1.45 }}>{c.us}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="sg-g2" style={{ marginTop: 48 }}>
            <div className="sg-panel">
              <div className="sg-panel-head">★ Dark mode — default</div>
              <div className="sg-g4">
                {[['#0A0A0A','Background'],['#141414','Surface'],['#2A2A2A','Border'],['#FFFFFF','Headline'],['#D0D0D0','Body'],['#909090','Muted'],['#5AB0FF','Label'],['#1E8EFF','Accent']].map(([bg, nm]) => (
                  <div key={nm} className="sg-chip">
                    <div style={{ height: 84, background: bg, borderBottom: bg === '#FFFFFF' ? '1px solid #eee' : undefined }} />
                    <div style={{ padding: '10px 14px' }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--card-foreground)' }}>{nm}</div>
                      <div className="sg-mono">{bg}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="sg-panel">
              <div className="sg-panel-head">☀ Light mode</div>
              <div className="sg-g4">
                {[['#F4F5F7','Background'],['#FFFFFF','Surface'],['#D0D4DC','Border'],['#0A0A0A','Headline'],['#252525','Body'],['#5A6272','Muted'],['#0D5ECC','Label'],['#1E8EFF','Accent']].map(([bg, nm]) => (
                  <div key={nm} className="sg-chip">
                    <div style={{ height: 84, background: bg, border: bg === '#FFFFFF' || bg === '#F4F5F7' ? '1px solid #D0D4DC' : undefined }} />
                    <div style={{ padding: '10px 14px' }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--card-foreground)' }}>{nm}</div>
                      <div className="sg-mono">{bg}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="sg-rule sg-rule-do" style={{ marginTop: 24 }}>
            <div className="hd">✓ The contrast rule</div>
            <ul>
              <li><strong style={{ color: 'var(--card-foreground)' }}>#1E8EFF</strong> is for headline-scale type, icons, and fills — anything 24px and up.</li>
              <li>Anything text-sized shifts to <strong style={{ color: 'var(--card-foreground)' }}>#5AB0FF</strong> on dark or <strong style={{ color: 'var(--card-foreground)' }}>#0D5ECC</strong> on light to hold AA contrast.</li>
              <li>Body text never drops below <strong style={{ color: 'var(--card-foreground)' }}>#909090</strong> (dark) or <strong style={{ color: 'var(--card-foreground)' }}>#5A6272</strong> (light).</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ══ TYPE ══ */}
      <section id="sg-type" className="sg-section">
        <div className="sg-wrap">
          <div className="sg-sec-label">04 — Typography</div>
          <h2 className="sg-sec-title">Two Families.<br />That's It.</h2>
          <p className="sg-lead">Barlow Condensed 900 for uppercase display and the logo. Barlow for everything else. No serif, no script, no third sans.</p>

          <div className="sg-g2" style={{ marginTop: 48, alignItems: 'start' }}>
            <div className="sg-panel">
              <div className="sg-panel-head">Scale</div>
              <div className="sg-spec">
                <div className="sg-spec-meta">Display · Barlow Condensed 900 · uppercase · lh 0.95 · tracking 0.02em</div>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 'clamp(40px,6vw,64px)', lineHeight: 0.95, textTransform: 'uppercase', color: 'var(--card-foreground)', letterSpacing: '0.02em' }}>
                  Northstar <span style={{ color: '#1E8EFF' }}>Pioneers</span>
                </div>
              </div>
              <div className="sg-spec">
                <div className="sg-spec-meta">H1 · Barlow 800 · 26–32px · lh 1.15</div>
                <div style={{ fontWeight: 800, fontSize: 'clamp(26px,3vw,32px)', lineHeight: 1.15, color: 'var(--card-foreground)' }}>We take up the task eternal.</div>
              </div>
              <div className="sg-spec">
                <div className="sg-spec-meta">H2 · Barlow 700 · 18px · lh 1.3</div>
                <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--card-foreground)' }}>Who we are · What we stand for</div>
              </div>
              <div className="sg-spec">
                <div className="sg-spec-meta">Body · Barlow 400 · 15px · lh 1.65</div>
                <div style={{ fontWeight: 400, fontSize: 15, lineHeight: 1.65, color: 'var(--foreground)' }}>Builders, thinkers, and pioneers who believe intelligence is becoming as essential — and as available — as electricity. No gatekeepers. No fluff.</div>
              </div>
              <div className="sg-spec">
                <div className="sg-spec-meta">Label · Barlow 700 · 13px · tracking 0.16em · uppercase</div>
                <div style={{ fontWeight: 700, fontSize: 13, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#5AB0FF' }}>Monthly Mastermind · Greater Twin Cities, MN</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div className="sg-panel">
                <div className="sg-panel-head">Families</div>
                <div className="sg-speclist">
                  <div className="sg-specrow"><span className="k">Display</span><span className="v">Barlow Condensed — 900 only</span></div>
                  <div className="sg-specrow"><span className="k">Body</span><span className="v">Barlow — 400, 600, 700, 800</span></div>
                  <div className="sg-specrow"><span className="k">Mono</span><span className="v">System mono — specs and code only</span></div>
                </div>
              </div>
              <div className="sg-panel">
                <div className="sg-panel-head">Tracking</div>
                <div className="sg-speclist">
                  <div className="sg-specrow"><span className="k">Display</span><span className="v">0.02–0.04em</span></div>
                  <div className="sg-specrow"><span className="k">Label</span><span className="v">0.16–0.22em uppercase</span></div>
                  <div className="sg-specrow"><span className="k">Button</span><span className="v">0.12em uppercase</span></div>
                  <div className="sg-specrow"><span className="k">Body</span><span className="v">0 — never track body copy</span></div>
                </div>
              </div>
              <div className="sg-panel">
                <div className="sg-panel-head">Measure</div>
                <p style={{ fontSize: 14, lineHeight: 1.6 }}>Body copy stays between 60 and 80 characters per line. Headlines break by meaning, not by container width — use manual breaks on display type.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ COMPONENTS ══ */}
      <section id="sg-components" className="sg-section">
        <div className="sg-wrap">
          <div className="sg-sec-label">05 — Components</div>
          <h2 className="sg-sec-title">Built From<br />Hairlines</h2>
          <p className="sg-lead">Borders are load-bearing. Shadows are almost never used, radii stay tight, and every container is defined by a 1px rule. The system reads architectural, not pillowy.</p>

          <div className="sg-g2" style={{ marginTop: 48, alignItems: 'start' }}>
            <div className="sg-panel">
              <div className="sg-panel-head">Buttons</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', marginBottom: 24 }}>
                <button className="sg-btn sg-btn-primary">Join the Collective</button>
                <button className="sg-btn sg-btn-outline">Learn More</button>
                <button className="sg-btn sg-btn-ghost">Archive</button>
              </div>
              <div className="sg-speclist">
                <div className="sg-specrow"><span className="k">Primary</span><span className="v">Blue fill, black text. Hover → #0D5ECC, white text.</span></div>
                <div className="sg-specrow"><span className="k">Outline</span><span className="v">Blue 1.5px border. Hover fills 15% blue.</span></div>
                <div className="sg-specrow"><span className="k">Ghost</span><span className="v">Neutral border. Lowest emphasis.</span></div>
                <div className="sg-specrow"><span className="k">Press</span><span className="v">No scale or squish. Color shift only.</span></div>
              </div>
            </div>

            <div className="sg-panel">
              <div className="sg-panel-head">Tags &amp; section labels</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 32 }}>
                <span className="sg-tag">Sep 23 · Edina</span>
                <span className="sg-tag">Builder Demo</span>
                <span className="sg-tag">Upcoming</span>
              </div>
              <div className="sg-sec-label" style={{ marginBottom: 12 }}>Section Label Pattern</div>
              <p style={{ fontSize: 14, lineHeight: 1.6 }}>The uppercase eyebrow with a hairline trailing off to the right is the brand's signature section header. Use it above every major block.</p>
            </div>

            <div className="sg-panel">
              <div className="sg-panel-head">Card — dark</div>
              <div className="sg-card">
                <div className="ey">Builder Demo</div>
                <div className="ti">September 23 — Monthly Gathering</div>
                <div className="bd">5:30–7:30 PM · Nerdery, Edina · Pizza provided. Come ready to build.</div>
              </div>
              <div className="sg-speclist" style={{ marginTop: 24 }}>
                <div className="sg-specrow"><span className="k">Border</span><span className="v">1px hairline all around</span></div>
                <div className="sg-specrow"><span className="k">Accent</span><span className="v">3px blue on the top edge only</span></div>
                <div className="sg-specrow"><span className="k">Padding</span><span className="v">22px</span></div>
              </div>
            </div>

            <div className="sg-panel sg-light-panel">
              <div className="sg-panel-head">Card — light</div>
              <div className="sg-card">
                <div className="ey">Socratic Forum</div>
                <div className="ti">Monthly News Review</div>
                <div className="bd">Five to ten stories shaping the frontier, discussed in the open. Bring one you can't stop thinking about.</div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 24 }}>
                <button className="sg-btn sg-btn-primary" style={{ color: '#fff' }}>Join the Collective</button>
                <button className="sg-btn sg-btn-outline">Learn More</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ SPACE & MOTION ══ */}
      <section id="sg-space" className="sg-section">
        <div className="sg-wrap">
          <div className="sg-sec-label">06 — Space, Shape &amp; Motion</div>
          <h2 className="sg-sec-title">Generous.<br />Tight. Quick.</h2>

          <div className="sg-g3" style={{ marginTop: 48, alignItems: 'start' }}>
            <div className="sg-panel">
              <div className="sg-panel-head">Spacing scale</div>
              <div className="sg-speclist">
                {[4,8,12,16,24,32,48,64].map(n => (
                  <div key={n} className="sg-specrow">
                    <span className="k">{n}px</span>
                    <div className="sg-bar" style={{ width: n }} />
                  </div>
                ))}
              </div>
            </div>
            <div className="sg-panel">
              <div className="sg-panel-head">Radii &amp; borders</div>
              <div className="sg-speclist">
                <div className="sg-specrow"><span className="k">2px</span><span className="v">Buttons, tags, cards</span></div>
                <div className="sg-specrow"><span className="k">4px</span><span className="v">Chips, media</span></div>
                <div className="sg-specrow"><span className="k">6px</span><span className="v">Panels, modals — the maximum</span></div>
                <div className="sg-specrow"><span className="k">1px</span><span className="v">Hairline border, every container</span></div>
                <div className="sg-specrow"><span className="k">3px</span><span className="v">Accent border — card top, type left</span></div>
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.6, marginTop: 16, color: 'var(--muted-foreground)' }}>No glassmorphism. No backdrop blur. The only sanctioned transparency is 15% blue glow and 35% blue border.</p>
            </div>
            <div className="sg-panel">
              <div className="sg-panel-head">Motion</div>
              <div className="sg-speclist">
                <div className="sg-specrow"><span className="k">120ms</span><span className="v">Hover color shifts</span></div>
                <div className="sg-specrow"><span className="k">180ms</span><span className="v">Default transition</span></div>
                <div className="sg-specrow"><span className="k">280ms</span><span className="v">Reveal / fade in</span></div>
                <div className="sg-specrow"><span className="k">ease</span><span className="v">cubic-bezier(.2,.8,.2,1)</span></div>
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.6, marginTop: 16, color: 'var(--muted-foreground)' }}>Fades and color shifts only — no transforms, no bounce, no parallax, no looping decoration. The brand doesn't wink.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ DO & DON'T ══ */}
      <section id="sg-rules" className="sg-section">
        <div className="sg-wrap">
          <div className="sg-sec-label">07 — Usage</div>
          <h2 className="sg-sec-title">Do &amp; Don't</h2>
          <div className="sg-rules" style={{ marginTop: 32 }}>
            <div className="sg-rule sg-rule-do">
              <div className="hd">✓ Do</div>
              <ul>
                <li>Lead with generous white space — it is the brand's most-used material</li>
                <li>Let 1px hairlines define containers instead of shadows</li>
                <li>Track uppercase labels wide (0.16–0.22em)</li>
                <li>Keep the blue accent to one job per screen</li>
                <li>Use flat, solid backgrounds</li>
                <li>Break display headlines manually, by meaning</li>
              </ul>
            </div>
            <div className="sg-rule sg-rule-dont">
              <div className="hd">✗ Don't</div>
              <ul>
                <li>Add a second accent color — the palette is closed</li>
                <li>Set body copy in #1E8EFF or below #909090</li>
                <li>Mix in a third font family</li>
                <li>Use gradients, glass blur, or drop-shadow stacks</li>
                <li>Move the card accent border off the top edge</li>
                <li>Use red for anything other than a "don't" callout</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ══ TOKENS ══ */}
      <section id="sg-tokens" className="sg-section">
        <div className="sg-wrap">
          <div className="sg-sec-label">08 — Implementation</div>
          <h2 className="sg-sec-title">Tokens</h2>
          <p className="sg-lead">Drop this into your global stylesheet. Apply <code className="sg-mono">.np-dark</code> or <code className="sg-mono">.np-light</code> to any wrapper — both modes can coexist on one page.</p>

          <pre className="sg-pre" style={{ marginTop: 48 }}>{`\
`}<span className="sg-pre"><span style={{color:'#5A6272'}}>{'/* Northstar Pioneers — core tokens */'}</span>{`
`}<span style={{color:'#5AB0FF'}}>:root</span>{` {
  `}<span style={{color:'#5AB0FF'}}>--np-blue</span>{`:        #1E8EFF;  `}<span style={{color:'#5A6272'}}>{'/* accent — 24px+ only */'}</span>{`
  `}<span style={{color:'#5AB0FF'}}>--np-blue-bright</span>{`: #5AB0FF;  `}<span style={{color:'#5A6272'}}>{'/* small text on dark */'}</span>{`
  `}<span style={{color:'#5AB0FF'}}>--np-blue-deep</span>{`:   #0D5ECC;  `}<span style={{color:'#5A6272'}}>{'/* small text on light, primary hover */'}</span>{`
  `}<span style={{color:'#5AB0FF'}}>--np-blue-glow</span>{`:   rgba(30,142,255,0.15);
  `}<span style={{color:'#5AB0FF'}}>--np-blue-border</span>{`: rgba(30,142,255,0.35);

  `}<span style={{color:'#5AB0FF'}}>--np-font-display</span>{`: 'Barlow Condensed', 'Arial Narrow', sans-serif;
  `}<span style={{color:'#5AB0FF'}}>--np-font-body</span>{`:    'Barlow', system-ui, sans-serif;

  `}<span style={{color:'#5AB0FF'}}>--np-radius-xs</span>{`: 2px;  `}<span style={{color:'#5AB0FF'}}>--np-radius-sm</span>{`: 4px;  `}<span style={{color:'#5AB0FF'}}>--np-radius-md</span>{`: 6px;
  `}<span style={{color:'#5AB0FF'}}>--np-ease</span>{`: cubic-bezier(0.2, 0.8, 0.2, 1);
  `}<span style={{color:'#5AB0FF'}}>--np-dur</span>{`:  180ms;
}

`}<span style={{color:'#5AB0FF'}}>.np-dark</span>{` {
  `}<span style={{color:'#5AB0FF'}}>--bg</span>{`: #0A0A0A; `}<span style={{color:'#5AB0FF'}}>--surface</span>{`: #141414; `}<span style={{color:'#5AB0FF'}}>--border</span>{`: #2A2A2A;
  `}<span style={{color:'#5AB0FF'}}>--head</span>{`: #FFFFFF; `}<span style={{color:'#5AB0FF'}}>--body</span>{`: #D0D0D0; `}<span style={{color:'#5AB0FF'}}>--muted</span>{`: #909090;
  `}<span style={{color:'#5AB0FF'}}>--label</span>{`: #5AB0FF;
}

`}<span style={{color:'#5AB0FF'}}>.np-light</span>{` {
  `}<span style={{color:'#5AB0FF'}}>--bg</span>{`: #F4F5F7; `}<span style={{color:'#5AB0FF'}}>--surface</span>{`: #FFFFFF; `}<span style={{color:'#5AB0FF'}}>--border</span>{`: #D0D4DC;
  `}<span style={{color:'#5AB0FF'}}>--head</span>{`: #0A0A0A; `}<span style={{color:'#5AB0FF'}}>--body</span>{`: #252525; `}<span style={{color:'#5AB0FF'}}>--muted</span>{`: #5A6272;
  `}<span style={{color:'#5AB0FF'}}>--label</span>{`: #0D5ECC;
}`}</span></pre>

          <div className="sg-g2" style={{ marginTop: 32 }}>
            <div className="sg-panel">
              <div className="sg-panel-head">Fonts</div>
              <pre className="sg-pre" style={{ padding: 16, fontSize: '11.5px' }}>{`<link href="https://fonts.googleapis.com/css2?family=
Barlow:wght@400;600;700;800&family=
Barlow+Condensed:wght@900&display=swap" rel="stylesheet">`}</pre>
            </div>
            <div className="sg-panel">
              <div className="sg-panel-head">Image assets — /images/</div>
              <div className="sg-speclist">
                <div className="sg-specrow"><span className="k">PNG</span><span className="v">logo-lockup-dark.png · logo-lockup-light.png</span></div>
                <div className="sg-specrow"><span className="k">PNG</span><span className="v">community-badge-600.png</span></div>
                <div className="sg-specrow"><span className="k">SVG</span><span className="v">star-mark-blue · -white · -black</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
};

export default StylePage;
