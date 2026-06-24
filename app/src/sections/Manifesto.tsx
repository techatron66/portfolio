import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { manifestoConfig } from '../config';

gsap.registerPlugin(ScrollTrigger);

export default function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const decorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !textRef.current) return;

    const ctx = gsap.context(() => {
      if (decorRef.current) {
        gsap.fromTo(
          decorRef.current,
          { opacity: 0, y: 50 },
          {
            opacity: 1, y: 0, duration: 1.2, ease: 'power2.out',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', toggleActions: 'play none none reverse' },
          }
        );
      }
      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1, y: 0, duration: 1.2, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', toggleActions: 'play none none reverse' },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="manifesto" style={{ background: '#0A0A0A', color: '#E8E6E0', padding: 'clamp(96px, 14vw, 160px) clamp(20px, 5vw, 40px)', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', borderTop: '1px solid rgba(255,255,255,0.12)', overflow: 'hidden' }}>
      <div style={{ width: '100%', maxWidth: '1360px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 'clamp(32px, 6vw, 64px)', alignItems: 'center' }}>
        <div ref={decorRef} style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', overflow: 'hidden', background: '#050505', border: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', lineHeight: '14px', color: 'rgba(0,240,255,0.08)', overflow: 'hidden', padding: '20px', whiteSpace: 'pre-wrap', wordBreak: 'break-all', position: 'absolute', inset: 0 }}>
            {'+-*/=+-*/=+-*/=+-*/=+-*/=+-*/=+-*/=+-*/=+-*/=+-*/=+-*/=+-*/=+-*/=+-*/=+-*/=+-*/=+-*/=+-*/=+-*/=+-*/=+-*/=+-*/=+-*/=+-*/=+-*/=+-*/=+-*/=+-*/=+-*/=+-*/=+-*/=+-*/=+-*/=+-*/=+-*/=+-*/=+-*/=+-*/=+-*/=+-*/=+-*/'}
          </div>
          <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
            <div style={{ fontFamily: "'Geist Pixel', monospace", fontSize: '48px', color: '#39FF14', marginBottom: '8px' }}>{'<>'}</div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: 'rgba(255,255,255,0.42)', textTransform: 'uppercase', letterSpacing: '0.18em' }}>System Online</div>
          </div>
        </div>
        <p ref={textRef} style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '15px', fontWeight: 400, lineHeight: '25px', maxWidth: '680px', textAlign: 'left', margin: 0, opacity: 0 }}>
          {manifestoConfig.text}
        </p>
      </div>
    </section>
  );
}
