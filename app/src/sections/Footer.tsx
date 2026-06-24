import { footerConfig } from '../config';

export default function Footer() {
  if (!footerConfig.copyrightText && !footerConfig.statusText) {
    return null;
  }

  return (
    <footer
      id="footer"
      style={{
        background: '#0A0A0A',
        color: '#E8E6E0',
        borderTop: '1px solid rgba(255,255,255,0.12)',
        padding: 'clamp(24px, 4vw, 32px) clamp(20px, 5vw, 40px)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '18px',
        flexWrap: 'wrap',
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: '12px',
        fontWeight: 400,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}
    >
      <span style={{ color: '#E8E6E0', whiteSpace: 'nowrap' }}>{footerConfig.copyrightText}</span>
      <a
        href={`mailto:${footerConfig.email}`}
        style={{
          color: '#00F0FF',
          whiteSpace: 'nowrap',
          textDecoration: 'none',
          borderBottom: '1px solid rgba(0,240,255,0.55)',
          paddingBottom: '2px',
        }}
      >
        {footerConfig.email}
      </a>
      <a
        href={footerConfig.githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: '#39FF14',
          whiteSpace: 'nowrap',
          textDecoration: 'none',
          borderBottom: '1px solid rgba(57,255,20,0.55)',
          paddingBottom: '2px',
        }}
      >
        GITHUB
      </a>
      <span style={{ color: '#FF10F0', fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '0.1em' }}>
        {'~<>(<>..<>)<>~'}
      </span>
      <span style={{ color: 'rgba(255,255,255,0.42)', whiteSpace: 'nowrap' }}>{footerConfig.statusText}</span>
    </footer>
  );
}
