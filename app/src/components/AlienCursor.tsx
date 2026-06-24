import { useEffect, useRef, useState } from 'react';

const TRAIL_CHARS = ['~', '.', ':', '*', '+'];
const DEFAULT_ALIEN = ' /oo\\\n(____)\n /||\\';
const HOVER_ALIEN = ' /@@\\\n(____)\n /||\\';

interface TrailPoint {
  x: number;
  y: number;
  char: string;
  opacity: number;
}

export default function AlienCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const posRef = useRef({ x: -100, y: -100 });
  const trailRef = useRef<TrailPoint[]>([]);
  const rafRef = useRef(0);
  const trailIndexRef = useRef(0);

  useEffect(() => {
    // Skip on touch devices
    if ('ontouchstart' in window) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    const onMouseMove = (e: MouseEvent) => {
      posRef.current.x = e.clientX;
      posRef.current.y = e.clientY;

      // Add trail point
      trailRef.current.push({
        x: e.clientX,
        y: e.clientY,
        char: TRAIL_CHARS[trailIndexRef.current % TRAIL_CHARS.length],
        opacity: 0.48,
      });
      trailIndexRef.current++;

      // Limit trail length
      if (trailRef.current.length > 8) {
        trailRef.current = trailRef.current.slice(-8);
      }
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.getAttribute('data-cursor-hover') === 'true' ||
        window.getComputedStyle(target).cursor === 'pointer'
      ) {
        setIsHovering(true);
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.getAttribute('data-cursor-hover') === 'true' ||
        window.getComputedStyle(target).cursor === 'pointer'
      ) {
        setIsHovering(false);
      }
    };

    const animate = () => {
      const pos = posRef.current;
      const trail = trailRef.current;

      // Fade trail
      for (let i = trail.length - 1; i >= 0; i--) {
        trail[i].opacity -= 0.015;
        if (trail[i].opacity <= 0) {
          trail.splice(i, 1);
        }
      }

      // Update cursor position
      if (cursor) {
        cursor.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;

        // Update trail elements
        const trailEls = cursor.querySelectorAll<HTMLSpanElement>('.cursor-trail');
        trailEls.forEach((el, i) => {
          if (trail[i]) {
            el.style.transform = `translate3d(${trail[i].x}px, ${trail[i].y}px, 0)`;
            el.style.opacity = String(trail[i].opacity);
            el.textContent = trail[i].char;
          } else {
            el.style.opacity = '0';
          }
        });
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout', onMouseOut);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Don't render on touch devices
  if (typeof window !== 'undefined' && 'ontouchstart' in window) {
    return null;
  }

  const color = isHovering ? '#FF10F0' : '#00D9FF';
  const alien = isHovering ? HOVER_ALIEN : DEFAULT_ALIEN;

  return (
    <div
      ref={cursorRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        willChange: 'transform',
        marginLeft: '-34px',
        marginTop: '-24px',
      }}
    >
      {/* Trail ghosts */}
      {Array.from({ length: 8 }).map((_, i) => (
        <span
          key={`trail-${i}`}
          className="cursor-trail"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: `${10 + i * 0.35}px`,
            color: color,
            opacity: 0,
            pointerEvents: 'none',
            willChange: 'transform, opacity',
            textShadow: `0 0 6px ${color}, 0 0 14px ${color}`,
            transition: 'none',
          }}
        />
      ))}

      {/* Main cursor */}
      <span
        style={{
          display: 'inline-block',
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '13px',
          fontWeight: 700,
          color: color,
          textAlign: 'center',
          textShadow: `0 0 8px ${color}, 0 0 18px ${color}, 0 0 28px ${isHovering ? '#FF10F0' : '#00F0FF'}`,
          transition: 'color 0.2s, text-shadow 0.2s',
          whiteSpace: 'pre',
          lineHeight: 0.82,
        }}
      >
        {alien}
      </span>
    </div>
  );
}
