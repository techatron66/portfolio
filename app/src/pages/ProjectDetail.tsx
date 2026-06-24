import { useEffect, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { projectsData, navigationConfig } from '../config';

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const videoRef = useRef<HTMLVideoElement>(null);

  const project = useMemo(
    () => projectsData.find((item) => item.slug === slug) ?? null,
    [slug]
  );
  const projectsHref = "#/#projects";

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !project?.video) return;

    video.muted = true;
    video.play().catch(() => {
      // Browsers may still block autoplay; controls remain available.
    });
  }, [project?.video]);

  if (!project) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#050505',
          color: '#E8E6E0',
          fontFamily: "'IBM Plex Mono', monospace",
          padding: '40px',
        }}
      >
        <p style={{ color: '#FF10F0' }}>Project not found.</p>
        <a href={projectsHref} style={{ color: '#39FF14', textDecoration: 'underline', fontSize: '12px', textTransform: 'uppercase' }}>
          Return home
        </a>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#050505',
        color: '#E8E6E0',
        fontFamily: "'IBM Plex Mono', monospace",
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <nav
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '24px 40px',
          borderBottom: '1px solid rgba(255,255,255,0.12)',
        }}
      >
        <span
          style={{
            fontSize: '18px',
            fontWeight: 400,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: '#39FF14',
          }}
        >
          {navigationConfig.brandName}
        </span>
        <a
          href={projectsHref}
          style={{
            fontSize: '12px',
            fontWeight: 400,
            textTransform: 'uppercase',
            color: '#E8E6E0',
            textDecoration: 'none',
            borderBottom: '1px solid #E8E6E0',
            paddingBottom: '2px',
          }}
        >
          BACK
        </a>
      </nav>

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <div
          style={{
            flex: 1,
            padding: '60px 48px',
            borderRight: '1px solid rgba(255,255,255,0.12)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <h1
            style={{
              fontFamily: "'Geist Pixel', monospace",
              fontSize: '32px',
              fontWeight: 400,
              lineHeight: '38px',
              textTransform: 'uppercase',
              margin: '0 0 16px 0',
              color: '#E8E6E0',
            }}
          >
            {project.name}
          </h1>
          <p style={{ fontSize: '13px', color: '#39FF14', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {project.language}
          </p>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.56)', margin: '0 0 32px 0', fontStyle: 'italic' }}>
            {project.description}
          </p>
          <div style={{ maxWidth: '520px' }}>
            {project.article.paragraphs.map((paragraph, index) => (
              <p
                key={`${project.slug}-${index}`}
                style={{
                  fontSize: '13px',
                  fontWeight: 400,
                  lineHeight: '22px',
                  margin: '0 0 20px 0',
                  color: 'rgba(232,230,224,0.8)',
                }}
              >
                {paragraph}
              </p>
            ))}
          </div>
          {project.githubUrl ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                marginTop: '32px',
                fontSize: '12px',
                fontWeight: 400,
                textTransform: 'uppercase',
                color: '#00F0FF',
                textDecoration: 'none',
                borderBottom: '1px solid #00F0FF',
                paddingBottom: '2px',
                display: 'inline-block',
                alignSelf: 'flex-start',
                transition: 'color 0.2s, border-color 0.2s',
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.color = '#39FF14';
                (e.target as HTMLElement).style.borderBottomColor = '#39FF14';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.color = '#00F0FF';
                (e.target as HTMLElement).style.borderBottomColor = '#00F0FF';
              }}
            >
              VIEW ON GITHUB
            </a>
          ) : null}
        </div>

        <div
          style={{
            flex: 1,
            position: 'relative',
            background: '#050505',
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
          }}
        >
          {project.video ? (
            <video
              ref={videoRef}
              src={project.video}
              poster={project.image}
              autoPlay
              muted
              loop
              playsInline
              controls
              style={{
                width: '100%',
                minHeight: 0,
                flex: project.gallery?.length ? '0 0 68%' : '1 1 auto',
                objectFit: 'cover',
                display: 'block',
                borderLeft: '2px solid rgba(57,255,20,0.3)',
                background: '#050505',
              }}
            />
          ) : project.image ? (
            <img
              src={project.image}
              alt={project.name}
              style={{
                width: '100%',
                minHeight: 0,
                flex: project.gallery?.length ? '0 0 68%' : '1 1 auto',
                objectFit: 'cover',
                display: 'block',
                borderLeft: '2px solid rgba(57,255,20,0.3)',
              }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                textTransform: 'uppercase',
                color: '#39FF14',
              }}
            >
              No Image
            </div>
          )}
          {project.gallery?.length ? (
            <div
              style={{
                borderLeft: '2px solid rgba(57,255,20,0.3)',
                borderTop: '1px solid rgba(255,255,255,0.12)',
                padding: '14px',
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                gap: '12px',
                background: '#080806',
              }}
            >
              {project.gallery.map((src, index) => (
                <img
                  key={`${project.slug}-gallery-${index}`}
                  src={src}
                  alt={`${project.name} gallery ${index + 1}`}
                  style={{
                    width: '100%',
                    aspectRatio: '4 / 3',
                    objectFit: 'cover',
                    display: 'block',
                    border: '1px solid rgba(57,255,20,0.28)',
                  }}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
