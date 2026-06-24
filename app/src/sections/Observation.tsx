import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { observationConfig } from '../config';

gsap.registerPlugin(ScrollTrigger);

export default function Observation() {
  const sectionRef = useRef<HTMLElement>(null);
  const decorRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ lat: observationConfig.initialLat, lon: observationConfig.initialLon });

  useEffect(() => {
    setCoords({ lat: observationConfig.initialLat, lon: observationConfig.initialLon });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCoords((prev) => ({
        lat: parseFloat((prev.lat + (Math.random() - 0.5) * 0.02).toFixed(2)),
        lon: parseFloat((prev.lon + (Math.random() - 0.5) * 0.03).toFixed(2)),
      }));
    }, 800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        decorRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 1.5, ease: 'power2.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 60%', toggleActions: 'play none none reverse' } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="observation" style={{ background: '#0A0A0A', color: '#E8E6E0', padding: '120px 40px', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderTop: '1px solid rgba(255,255,255,0.12)' }}>
      <h3 style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '17.5px', fontWeight: 400, lineHeight: '20px', textTransform: 'uppercase', color: '#FF10F0', margin: '0 0 48px 0', alignSelf: 'flex-start' }}>
        {'< LIVE.TERMINAL >'}
      </h3>
      <div style={{ position: 'relative', width: '100%', maxWidth: '1200px' }}>
        <div ref={decorRef} style={{ width: '100%', aspectRatio: '16/9', background: '#050505', border: '1px solid rgba(255,255,255,0.12)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, fontFamily: "'IBM Plex Mono', monospace", fontSize: '8px', lineHeight: '12px', color: 'rgba(57,255,20,0.06)', overflow: 'hidden', padding: '16px', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
            {'10101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010'}
          </div>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <div style={{ fontFamily: "'Geist Pixel', monospace", fontSize: '72px', color: '#39FF14', textShadow: '0 0 20px #39FF14, 0 0 40px #39FF14' }}>$</div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px', color: '#00F0FF', marginTop: '16px', letterSpacing: '0.1em' }}>_awaiting_input</div>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: '16px', right: '16px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px', fontWeight: 400, color: '#E8E6E0', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'rgba(0,0,0,0.5)', padding: '6px 10px' }}>
          {observationConfig.latLabel} {coords.lat.toFixed(2)}, {coords.lon.toFixed(2)}
        </div>
        <div style={{ position: 'absolute', top: '16px', left: '16px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px', fontWeight: 400, color: '#E8E6E0', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#39FF14', display: 'inline-block', animation: 'pulse 2s ease-in-out infinite' }} />
          {observationConfig.statusText}
        </div>
      </div>
    </section>
  );
}
