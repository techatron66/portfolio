import { useMemo, useRef, useState, type PointerEvent } from 'react';
import { archivesConfig } from '../config';

export default function Archives() {
  const [rotation, setRotation] = useState(0);
  const [tilt, setTilt] = useState(-6);
  const [previewOpen, setPreviewOpen] = useState(false);
  const dragRef = useRef({ active: false, x: 0, y: 0 });
  const vaultImages = archivesConfig.items;

  const radius = useMemo(() => {
    if (typeof window === 'undefined') return 300;
    return Math.min(320, Math.max(190, window.innerWidth * 0.28));
  }, []);

  const startDrag = (event: PointerEvent<HTMLDivElement>) => {
    dragRef.current = { active: true, x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const dragCarousel = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return;

    const dx = event.clientX - dragRef.current.x;
    const dy = event.clientY - dragRef.current.y;
    dragRef.current.x = event.clientX;
    dragRef.current.y = event.clientY;

    setRotation((value) => value + dx * 0.42);
    setTilt((value) => Math.max(-18, Math.min(14, value - dy * 0.08)));
  };

  const stopDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  if (!archivesConfig.sectionLabel && !archivesConfig.vaultTitle && vaultImages.length === 0) {
    return null;
  }

  return (
    <>
      <section
        id="archives"
        style={{
          background: '#050505',
          color: '#E8E6E0',
          minHeight: '100vh',
          position: 'relative',
          borderTop: '1px solid rgba(255,255,255,0.12)',
          overflow: 'hidden',
          scrollMarginTop: 0,
          padding: 'clamp(112px, 12vw, 140px) clamp(20px, 5vw, 40px) clamp(64px, 8vw, 96px)',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '18px',
            lineHeight: '28px',
            color: 'rgba(255,184,0,0.08)',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
            pointerEvents: 'none',
          }}
        >
          {Array.from({ length: 150 })
            .map(() => 'CERT_ARCHIVE::OPEN_VAULT::DRAG_RING  ')
            .join('')}
        </div>

        <div style={{ position: 'relative', zIndex: 2, maxWidth: 'min(520px, calc(100% - 150px))' }}>
          <h2
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 'clamp(16px, 2.2vw, 22px)',
              fontWeight: 400,
              lineHeight: 1.1,
              textTransform: 'uppercase',
              color: '#FFB800',
              margin: '0 0 18px 0',
            }}
          >
            {archivesConfig.sectionLabel}
          </h2>
          <p
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '12px',
              color: 'rgba(255,255,255,0.42)',
              margin: 0,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            DRAG THE CERTIFICATE RING / OPEN VAULT FOR GRID VIEW
          </p>
        </div>

        <button
          onClick={() => setPreviewOpen(true)}
          style={{
            position: 'absolute',
            top: 'clamp(118px, 12vw, 140px)',
            right: 'clamp(20px, 5vw, 40px)',
            zIndex: 4,
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '12px',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: '#050505',
            background: '#FFB800',
            border: '1px solid #FFB800',
            borderRadius: 0,
            padding: '11px 22px',
            letterSpacing: '0.08em',
            boxShadow: '0 0 18px rgba(255,184,0,0.5)',
          }}
        >
          {archivesConfig.vaultTitle}
        </button>

        <div
          onPointerDown={startDrag}
          onPointerMove={dragCarousel}
          onPointerUp={stopDrag}
          onPointerCancel={stopDrag}
          onPointerLeave={stopDrag}
          data-cursor-hover="true"
          style={{
            position: 'relative',
            zIndex: 3,
            height: 'min(500px, 56vh)',
            minHeight: '320px',
            perspective: '1100px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            touchAction: 'none',
            userSelect: 'none',
          }}
        >
          <div
            style={{
              width: 'min(62vw, 620px)',
              height: 'min(31vw, 296px)',
              minWidth: '320px',
              minHeight: '170px',
              position: 'relative',
              transformStyle: 'preserve-3d',
              transform: `rotateX(${tilt}deg) rotateY(${rotation}deg)`,
              transition: dragRef.current.active ? 'none' : 'transform 180ms ease-out',
              willChange: 'transform',
            }}
          >
            {vaultImages.map((item, index) => {
              const angle = (360 / vaultImages.length) * index;
              const cardHeight = 'min(31vw, 296px)';
              const cardWidth = `min(${Math.round(31 * item.aspectRatio * 100) / 100}vw, ${
                Math.round(296 * item.aspectRatio)
              }px)`;
              return (
                <div
                  key={`${item.label}-${index}`}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    transformStyle: 'preserve-3d',
                    transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      width: cardWidth,
                      height: cardHeight,
                      transform: 'translate(-50%, -50%)',
                      border: '2px solid rgba(255,184,0,0.42)',
                      boxShadow: '0 0 28px rgba(255,184,0,0.22)',
                      background: '#080806',
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src={item.src}
                      alt={item.label}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                        filter: 'contrast(1.1) saturate(1.08) brightness(0.9)',
                      }}
                    />
                    <span
                      style={{
                        position: 'absolute',
                        left: '12px',
                        right: '12px',
                        bottom: '12px',
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: '10px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        color: '#FFB800',
                        letterSpacing: '0.05em',
                        background: 'rgba(5,5,5,0.78)',
                        padding: '7px 9px',
                        textShadow: '0 0 12px rgba(255,184,0,0.7)',
                      }}
                    >
                      {item.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {previewOpen && (
        <div
          className="preview"
          style={{
            position: 'fixed',
            inset: 0,
            padding: '88px clamp(20px, 5vw, 64px) 40px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '24px',
            alignContent: 'center',
            justifyItems: 'center',
            zIndex: 100,
            background: 'rgba(5,5,5,0.97)',
            overflowY: 'auto',
          }}
        >
          <button
            onClick={() => setPreviewOpen(false)}
            style={{
              position: 'fixed',
              top: '28px',
              right: 'clamp(20px, 5vw, 40px)',
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: '#050505',
              background: '#FFB800',
              border: '1px solid #FFB800',
              borderRadius: 0,
              padding: '10px 20px',
              letterSpacing: '0.08em',
              zIndex: 110,
            }}
          >
            {archivesConfig.closeText}
          </button>

          {vaultImages.map((item, index) => (
            <div
              key={`${item.label}-${index}`}
              className="grid__item"
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: `${Math.round(360 * Math.min(item.aspectRatio, 1.75))}px`,
                border: '2px solid rgba(255,184,0,0.42)',
                boxShadow: '0 0 28px rgba(255,184,0,0.16)',
                background: '#080806',
              }}
            >
              <img
                src={item.src}
                alt={item.label}
                style={{
                  width: '100%',
                  aspectRatio: `${item.aspectRatio} / 1`,
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              <p
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: '#FFB800',
                  margin: 0,
                  padding: '10px',
                  letterSpacing: '0.05em',
                }}
              >
                {item.label}
              </p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
