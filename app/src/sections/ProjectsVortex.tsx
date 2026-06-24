import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import VortexGallery from '../components/VortexGallery';

gsap.registerPlugin(ScrollTrigger);

export default function ProjectsVortex() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLHeadingElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (labelRef.current) {
        gsap.fromTo(
          labelRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 60%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      if (galleryRef.current) {
        gsap.fromTo(
          galleryRef.current,
          { opacity: 0, scale: 0.9 },
          {
            opacity: 1,
            scale: 1,
            duration: 1.5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 60%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="projects"
      style={{
        background: '#050505',
        color: '#E8E6E0',
        position: 'relative',
        borderTop: '1px solid rgba(255,255,255,0.12)',
        overflow: 'hidden',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '18px',
          lineHeight: '27px',
          color: 'rgba(125,12,207,0.16)',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all',
          filter: 'blur(0.4px)',
          pointerEvents: 'none',
          transform: 'rotate(-1deg) scale(1.06)',
        }}
      >
        {Array.from({ length: 180 })
          .map(() => 'The-Embers-of-ASCII-Art  PLANET_01  ::**::  ')
          .join('')}
      </div>
      <div
        style={{
          padding: 'clamp(72px, 12vw, 120px) clamp(20px, 5vw, 40px) 20px',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <h3
          ref={labelRef}
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '17.5px',
            fontWeight: 400,
            lineHeight: '20px',
            textTransform: 'uppercase',
            color: '#39FF14',
            margin: '0 0 24px 0',
            letterSpacing: '0.05em',
          }}
        >
          &lt; REPOSITORIES &gt;
        </h3>
        <p
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '12px',
            fontWeight: 400,
            color: 'rgba(255,255,255,0.42)',
            margin: '0 0 clamp(28px, 6vw, 48px) 0',
            letterSpacing: '0.05em',
            lineHeight: '18px',
            maxWidth: '760px',
          }}
        >
          DRAG THE GAS GIANT / WHEEL OR SHIFT-DRAG TO ROLL Z / CLICK A PROJECT POLAROID
        </p>
      </div>

      <div ref={galleryRef} style={{ position: 'relative', zIndex: 1 }}>
        <VortexGallery />
      </div>
    </section>
  );
}
