import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { siteConfig } from './config';
import Hero from './sections/Hero';
import Manifesto from './sections/Manifesto';
import ProjectsVortex from './sections/ProjectsVortex';
import Archives from './sections/Archives';
import Footer from './sections/Footer';
import ProjectDetail from './pages/ProjectDetail';
import AlienCursor from './components/AlienCursor';

function Home() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const id = hash.slice(1);
    let attempts = 0;
    let frame = 0;

    const scrollToHash = () => {
      const el = document.getElementById(id);
      attempts += 1;
      if (!el && attempts < 10) {
        frame = requestAnimationFrame(scrollToHash);
        return;
      }
      if (!el) return;
      el.scrollIntoView({ behavior: 'auto', block: 'start' });
    };

    frame = requestAnimationFrame(scrollToHash);
    return () => cancelAnimationFrame(frame);
  }, [hash]);

  return (
    <>
      <main>
        <Hero />
        <Manifesto />
        <ProjectsVortex />
        <Archives />
      </main>
      <Footer />
    </>
  );
}

function App() {
  useEffect(() => {
    document.title = siteConfig.siteTitle || 'ASCII Cosmos Portfolio';
    document.documentElement.lang = siteConfig.language || 'en';

    let metaDescription = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = siteConfig.siteDescription || '';

    // Hide default cursor
    const style = document.createElement('style');
    style.textContent = `* { cursor: none !important; } @media (pointer: coarse) { * { cursor: auto !important; } }`;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <>
      <AlienCursor />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/project/:slug" element={<ProjectDetail />} />
      </Routes>
    </>
  );
}

export default App;
