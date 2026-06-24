import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ColorAsciiCanvas from '../components/ColorAsciiCanvas';
import { heroConfig, navigationConfig } from '../config';

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const leadRef = useRef<HTMLParagraphElement>(null);
  const notesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Title blur reveal
    if (titleRef.current) {
      tl.fromTo(
        titleRef.current,
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55 }
      );
    }

    // Eyebrow
    if (eyebrowRef.current) {
      tl.fromTo(
        eyebrowRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        0.1
      );
    }

    // Lead text
    if (leadRef.current) {
      tl.fromTo(
        leadRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7 },
        0.25
      );
    }

    // Supporting notes staggered
    if (notesRef.current) {
      const notes = notesRef.current.querySelectorAll('.hero-note');
      tl.fromTo(
        notes,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.15 },
        0.4
      );
    }

    return () => {
      tl.kill();
    };
  }, []);

  const notes = heroConfig.supportingNotes.slice(0, 3);

  return (
    <section
      ref={sectionRef}
      id="hero"
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        background: '#050505',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          opacity: 0.94,
        }}
      >
        <ColorAsciiCanvas />
      </div>

      <div
        style={{
          position: 'relative',
          width: '100%',
          minWidth: 0,
          background:
            'linear-gradient(90deg, rgba(5,5,5,0.98) 0%, rgba(5,5,5,0.9) 31%, rgba(5,5,5,0.48) 55%, rgba(5,5,5,0) 100%)',
          overflow: 'hidden',
          zIndex: 1,
        }}
      >
        {/* Navigation */}
        <nav
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            minWidth: 0,
            zIndex: 50,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '18px',
            padding: '14px clamp(20px, 5vw, 40px)',
            minHeight: '64px',
            background: 'linear-gradient(180deg, rgba(5,5,5,0.86), rgba(5,5,5,0.52))',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(8px)',
            fontFamily: "'IBM Plex Mono', monospace",
            boxSizing: 'border-box',
            overflow: 'hidden',
          }}
        >
          <span
            style={{
              fontSize: '16px',
              fontWeight: 400,
              color: '#39FF14',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {navigationConfig.brandName}
          </span>
          <div
            style={{
              display: 'flex',
              gap: 'clamp(12px, 3vw, 28px)',
              flexWrap: 'nowrap',
              justifyContent: 'flex-end',
              minWidth: 0,
            }}
          >
            {navigationConfig.links.map((item, index) => (
              <div
                key={`${item.label}-${item.href}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'clamp(12px, 3vw, 28px)',
                  minWidth: 0,
                }}
              >
                <a
                  href={item.href}
                  target={item.href.endsWith('.pdf') ? '_blank' : undefined}
                  rel={item.href.endsWith('.pdf') ? 'noopener noreferrer' : undefined}
                  style={{
                    fontSize: '12px',
                    fontWeight: 400,
                    color: '#E8E6E0',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    letterSpacing: '0.08em',
                    borderBottom: '1px solid transparent',
                    transition: 'border-color 0.2s',
                    paddingBottom: '2px',
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.borderBottomColor = '#E8E6E0';
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.borderBottomColor = 'transparent';
                  }}
                >
                  {item.label}
                </a>
                {index < navigationConfig.links.length - 1 && (
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>/</span>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* Hero Title */}
        <div
          style={{
            position: 'absolute',
            left: 'clamp(24px, 4vw, 56px)',
            right: '24px',
            top: 'clamp(112px, 16vh, 148px)',
            zIndex: 10,
            width: 'min(620px, calc(100% - 48px))',
            maxWidth: '620px',
          }}
        >
          <p
            ref={eyebrowRef}
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '11px',
              fontWeight: 400,
              lineHeight: 1.6,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#00F0FF',
              margin: '0 0 22px 0',
              opacity: 0,
            }}
          >
            {heroConfig.eyebrow}
          </p>
          <h1
            ref={titleRef}
            style={{
              fontFamily: "'Geist Pixel', monospace",
              fontSize: 'clamp(44px, 5.6vw, 82px)',
              fontWeight: 400,
              lineHeight: 0.96,
              color: '#E8E6E0',
              textTransform: 'uppercase',
              margin: 0,
              textWrap: 'balance',
              letterSpacing: '0.015em',
              opacity: 0,
            }}
          >
            {heroConfig.titleLines.map((line, index) => (
              <span key={`${line}-${index}`}>
                {line}
                {index < heroConfig.titleLines.length - 1 && <br />}
              </span>
            ))}
          </h1>

          <div
            ref={notesRef}
            style={{
              position: 'relative',
              marginTop: '48px',
              width: '100%',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))',
              gap: '18px 28px',
            }}
          >
            {[heroConfig.leadText, notes[0] ?? '', notes[1] ?? '', notes[2] ?? '']
              .filter(Boolean)
              .map((item, index) => (
                <p
                  key={`${item}-${index}`}
                  className="hero-note"
                  ref={index === 0 ? leadRef : undefined}
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: '12px',
                    fontWeight: 400,
                    lineHeight: 1.95,
                    color: 'rgba(255,255,255,0.56)',
                    margin: 0,
                    maxWidth: '34ch',
                    gridColumn: index === 0 ? '1 / -1' : undefined,
                    opacity: index === 0 ? 0 : undefined,
                  }}
                >
                  {item}
                </p>
              ))}
          </div>
        </div>

        {/* ASCII Alien Signature */}
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            left: 'clamp(24px, 4vw, 56px)',
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '11px',
            color: '#FF10F0',
            letterSpacing: '0.1em',
            zIndex: 10,
          }}
        >
          {'oO-^-(<>..<>)-^-Oo'}
        </div>
      </div>

    </section>
  );
}
