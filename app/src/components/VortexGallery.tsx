import { useCallback, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import { projectsData } from '../config';

const ASCII_CHARS = '  ..::**##@@'.split('');
const CELESTIAL_PALETTE = [
  new THREE.Color('#3B0878'),
  new THREE.Color('#7D0CCF'),
  new THREE.Color('#FF14CB'),
  new THREE.Color('#FF4FDB'),
  new THREE.Color('#FF7AE6'),
  new THREE.Color('#FFE44D'),
];
const CARD_COLORS = ['#FFE44D', '#39FF14', '#69F7FF', '#FF7AE6', '#A98BFF'];
const DESKTOP_GLOBE_RADIUS = 264;

type AsciiSprite = THREE.Sprite & {
  userData: {
    normal: THREE.Vector3;
    latitude: number;
    longitude: number;
    phase: number;
    baseScale: number;
  };
};

type SceneState = {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  globeGroup: THREE.Group;
  asciiSprites: AsciiSprite[];
  projectTargets: THREE.Sprite[];
  particles: THREE.Points;
  raycaster: THREE.Raycaster;
  mouse: THREE.Vector2;
  targetRotation: THREE.Euler;
  currentRotation: THREE.Euler;
  isPointerDown: boolean;
  lastPointer: THREE.Vector2;
  pointerStart: THREE.Vector2;
  hoveredSlug: string | null;
  rafId: number;
};

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const charTextureCache = new Map<string, THREE.CanvasTexture>();

const makeGlyphTexture = (char: string) => {
  const cached = charTextureCache.get(char);
  if (cached) return cached;

  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.clearRect(0, 0, 64, 64);
    ctx.font = '700 46px "IBM Plex Mono", "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 14;
    ctx.fillStyle = '#ffffff';
    ctx.fillText(char, 32, 33);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  charTextureCache.set(char, texture);
  return texture;
};

const makeAsciiMaterial = (char: string, color: THREE.Color) =>
  new THREE.SpriteMaterial({
    map: makeGlyphTexture(char),
    color,
    transparent: true,
    opacity: 0.82,
    depthTest: true,
    depthWrite: false,
  });

const makePolaroidTexture = (project: (typeof projectsData)[number], accent: string) => {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 820;
  const ctx = canvas.getContext('2d');
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  const drawFrame = (image?: HTMLImageElement) => {
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.shadowColor = accent;
    ctx.shadowBlur = 36;
    ctx.strokeStyle = accent;
    ctx.lineWidth = 8;
    ctx.strokeRect(18, 18, 604, 784);

    ctx.shadowBlur = 0;
    ctx.fillStyle = '#11110f';
    ctx.fillRect(46, 48, 548, 528);
    ctx.strokeStyle = 'rgba(232,230,224,0.52)';
    ctx.lineWidth = 3;
    ctx.strokeRect(46, 48, 548, 528);

    if (image) {
      const targetRatio = 548 / 528;
      const imageRatio = image.naturalWidth / image.naturalHeight;
      let sx = 0;
      let sy = 0;
      let sw = image.naturalWidth;
      let sh = image.naturalHeight;

      if (imageRatio > targetRatio) {
        sw = image.naturalHeight * targetRatio;
        sx = (image.naturalWidth - sw) / 2;
      } else {
        sh = image.naturalWidth / targetRatio;
        sy = (image.naturalHeight - sh) / 2;
      }

      ctx.drawImage(image, sx, sy, sw, sh, 46, 48, 548, 528);
      ctx.fillStyle = 'rgba(5,5,5,0.24)';
      ctx.fillRect(46, 48, 548, 528);
    } else {
      ctx.fillStyle = accent;
      ctx.font = '700 72px "IBM Plex Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('<>', 320, 292);
    }

    ctx.fillStyle = 'rgba(255,20,203,0.18)';
    ctx.font = '700 18px "IBM Plex Mono", monospace';
    ctx.textAlign = 'center';
    for (let y = 70; y < 556; y += 34) {
      ctx.fillText('::**::**::**::**::**::**::**::**', 320, y);
    }

    ctx.strokeStyle = accent;
    ctx.lineWidth = 4;
    ctx.strokeRect(58, 60, 524, 504);

    ctx.fillStyle = '#E8E6E0';
    ctx.font = '700 38px "IBM Plex Mono", monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(project.name, 52, 652);

    ctx.fillStyle = accent;
    ctx.font = '700 21px "IBM Plex Mono", monospace';
    ctx.fillText(project.language.toUpperCase(), 52, 700);

    ctx.fillStyle = 'rgba(232,230,224,0.72)';
    ctx.font = '700 18px "IBM Plex Mono", monospace';
    ctx.fillText(project.tags.toUpperCase(), 52, 742);

    ctx.strokeStyle = accent;
    ctx.lineWidth = 2;
    ctx.strokeRect(52, 612, 536, 160);
    ctx.fillStyle = accent;
    ctx.font = '700 20px "IBM Plex Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('/* CLICK_TO_OPEN */', 320, 790);

    texture.needsUpdate = true;
  };

  drawFrame();

  const image = new Image();
  image.crossOrigin = 'anonymous';
  image.onload = () => drawFrame(image);
  image.src = project.image;

  return texture;
};

const sphericalPoint = (index: number, total: number, radius: number) => {
  const y = 1 - (index / (total - 1)) * 2;
  const diskRadius = Math.sqrt(1 - y * y);
  const theta = index * Math.PI * (3 - Math.sqrt(5));

  return new THREE.Vector3(
    Math.cos(theta) * diskRadius * radius,
    y * radius,
    Math.sin(theta) * diskRadius * radius
  );
};

const projectPoint = (index: number, total: number, radius: number) => {
  const lat = THREE.MathUtils.degToRad(-58 + (116 / Math.max(total - 1, 1)) * index);
  const lon = index * 2.399963229728653 + (index % 2) * 0.65;

  return new THREE.Vector3(
    Math.cos(lat) * Math.cos(lon) * radius,
    Math.sin(lat) * radius,
    Math.cos(lat) * Math.sin(lon) * radius
  );
};

const getGasColor = (latitude: number, longitude: number, time: number) => {
  const bandA = Math.sin(latitude * 10.5 + time * 0.0022);
  const bandB = Math.sin(latitude * 22.5 + longitude * 2.2 - time * 0.0032);
  const storm = Math.sin(longitude * 6.0 + latitude * 12.0 + time * 0.0045);
  const mix = clamp((bandA * 0.44 + bandB * 0.34 + storm * 0.22 + 1) * 0.5, 0, 1);
  const scaled = mix * (CELESTIAL_PALETTE.length - 1);
  const index = Math.floor(scaled);
  const next = Math.min(index + 1, CELESTIAL_PALETTE.length - 1);

  return CELESTIAL_PALETTE[index].clone().lerp(CELESTIAL_PALETTE[next], scaled - index);
};

export default function VortexGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const sceneRef = useRef<SceneState | null>(null);

  const openProject = useCallback(
    (slug: string) => {
      navigate(`/project/${slug}`);
    },
    [navigate]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = Math.max(container.offsetWidth, 1);
    const height = Math.max(container.offsetHeight, 1);
    const isCompact = width < 680;
    const globeRadius = isCompact
      ? clamp(width * 0.4, 148, 204)
      : DESKTOP_GLOBE_RADIUS;
    const cardRadius = globeRadius * (isCompact ? 1.22 : 1.33);
    const cardScale = isCompact
      ? new THREE.Vector3(82, 105, 1)
      : new THREE.Vector3(126, 162, 1);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505);
    scene.fog = new THREE.FogExp2(0x050505, 0.001);

    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1800);
    camera.position.set(0, 0, isCompact ? 630 : 760);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.35));
    renderer.domElement.setAttribute('aria-label', 'Interactive ASCII gas giant project globe');
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.touchAction = 'none';
    container.appendChild(renderer.domElement);

    const globeGroup = new THREE.Group();
    globeGroup.rotation.order = 'YXZ';
    scene.add(globeGroup);

    const asciiSprites: AsciiSprite[] = [];
    const asciiCount = isCompact ? 1700 : 3800;

    for (let i = 0; i < asciiCount; i += 1) {
      const position = sphericalPoint(i, asciiCount, globeRadius);
      const normal = position.clone().normalize();
      const latitude = Math.asin(normal.y);
      const longitude = Math.atan2(normal.z, normal.x);
      const craterDistance = Math.hypot(latitude - 0.18, longitude + 1.58);
      const crater = Math.exp(-craterDistance * craterDistance * 9.5);
      const brightness =
        0.58 +
        Math.sin(latitude * 11 + longitude * 0.75) * 0.2 +
        Math.sin(latitude * 27 - longitude * 2.1) * 0.16 -
        crater * 0.72;
      const char = ASCII_CHARS[clamp(Math.floor(brightness * ASCII_CHARS.length), 0, ASCII_CHARS.length - 1)];
      const color =
        crater > 0.14
          ? new THREE.Color('#0920FF').lerp(new THREE.Color('#05051E'), crater)
          : getGasColor(latitude, longitude, 0);
      const sprite = new THREE.Sprite(makeAsciiMaterial(char, color)) as AsciiSprite;

      sprite.position.copy(position);
      sprite.scale.setScalar(isCompact ? 5.2 : 6.2);
      sprite.userData = {
        normal,
        latitude,
        longitude,
        phase: Math.random() * Math.PI * 2,
        baseScale: isCompact ? 5.2 : 6.2,
      };

      globeGroup.add(sprite);
      asciiSprites.push(sprite);
    }

    const projectTargets: THREE.Sprite[] = [];

    projectsData.forEach((project, index) => {
      const accent = CARD_COLORS[index % CARD_COLORS.length];
      const position = projectPoint(index, projectsData.length, cardRadius);
      const card = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: makePolaroidTexture(project, accent),
          transparent: true,
          opacity: 0.93,
          depthTest: true,
          depthWrite: false,
        })
      );

      card.position.copy(position);
      card.scale.copy(cardScale);
      card.userData = { slug: project.slug, projectName: project.name };
      globeGroup.add(card);
      projectTargets.push(card);
    });

    const particleCount = isCompact ? 180 : 300;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i += 1) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 1200;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 780;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 820;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xff14cb,
      size: 3.1,
      transparent: true,
      opacity: 0.24,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-10, -10);

    const sceneState: SceneState = {
      renderer,
      scene,
      camera,
      globeGroup,
      asciiSprites,
      projectTargets,
      particles,
      raycaster,
      mouse,
      targetRotation: new THREE.Euler(-0.18, 0.36, 0.08, 'YXZ'),
      currentRotation: new THREE.Euler(-0.18, 0.36, 0.08, 'YXZ'),
      isPointerDown: false,
      lastPointer: new THREE.Vector2(),
      pointerStart: new THREE.Vector2(),
      hoveredSlug: null,
      rafId: 0,
    };
    sceneRef.current = sceneState;

    const updateMouse = (clientX: number, clientY: number) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    };

    const onPointerDown = (event: PointerEvent) => {
      renderer.domElement.setPointerCapture(event.pointerId);
      sceneState.isPointerDown = true;
      sceneState.lastPointer.set(event.clientX, event.clientY);
      sceneState.pointerStart.copy(sceneState.lastPointer);
      updateMouse(event.clientX, event.clientY);
    };

    const onPointerMove = (event: PointerEvent) => {
      updateMouse(event.clientX, event.clientY);

      if (!sceneState.isPointerDown) return;

      const dx = event.clientX - sceneState.lastPointer.x;
      const dy = event.clientY - sceneState.lastPointer.y;
      const rotateZ = event.shiftKey || event.altKey;

      if (rotateZ) {
        sceneState.targetRotation.z += dx * 0.008 + dy * 0.004;
      } else {
        sceneState.targetRotation.y += dx * 0.007;
        sceneState.targetRotation.x = clamp(
          sceneState.targetRotation.x + dy * 0.006,
          -Math.PI * 0.72,
          Math.PI * 0.72
        );
      }

      sceneState.lastPointer.set(event.clientX, event.clientY);
    };

    const onPointerUp = (event: PointerEvent) => {
      const moved = sceneState.pointerStart.distanceTo(
        new THREE.Vector2(event.clientX, event.clientY)
      );
      sceneState.isPointerDown = false;

      if (renderer.domElement.hasPointerCapture(event.pointerId)) {
        renderer.domElement.releasePointerCapture(event.pointerId);
      }

      if (moved < 5 && sceneState.hoveredSlug) {
        openProject(sceneState.hoveredSlug);
      }
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      sceneState.targetRotation.z += event.deltaY * 0.0025;
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerup', onPointerUp);
    renderer.domElement.addEventListener('pointercancel', onPointerUp);
    renderer.domElement.addEventListener('wheel', onWheel, { passive: false });

    const animate = (time: number) => {
      sceneState.targetRotation.y += 0.0009;
      sceneState.currentRotation.x +=
        (sceneState.targetRotation.x - sceneState.currentRotation.x) * 0.08;
      sceneState.currentRotation.y +=
        (sceneState.targetRotation.y - sceneState.currentRotation.y) * 0.08;
      sceneState.currentRotation.z +=
        (sceneState.targetRotation.z - sceneState.currentRotation.z) * 0.08;
      globeGroup.rotation.copy(sceneState.currentRotation);

      const light = new THREE.Vector3(0.34, 0.28, 1).normalize();
      const normalMatrix = new THREE.Matrix3().getNormalMatrix(globeGroup.matrixWorld);
      asciiSprites.forEach((sprite) => {
        const normal = sprite.userData.normal.clone().applyMatrix3(normalMatrix);
        const facing = normal.dot(camera.position.clone().normalize());
        const lightAmount = clamp(normal.dot(light), 0, 1);
        const color = getGasColor(
          sprite.userData.latitude,
          sprite.userData.longitude,
          time + sprite.userData.phase * 1000
        );
        const craterDistance = Math.hypot(
          sprite.userData.latitude - 0.18,
          sprite.userData.longitude + 1.58
        );
        const crater = Math.exp(-craterDistance * craterDistance * 9.5);
        const surfaceWave =
          Math.sin(sprite.userData.latitude * 24 + time * 0.0048 + sprite.userData.phase) * 1.1 +
          Math.sin(sprite.userData.longitude * 8 - time * 0.0036) * 0.68;
        const material = sprite.material as THREE.SpriteMaterial;

        material.color.copy(
          crater > 0.14
            ? new THREE.Color('#0920FF').lerp(new THREE.Color('#05051E'), crater)
            : color
        );
        material.opacity =
          facing > -0.08
            ? clamp(0.28 + lightAmount * 0.7 + surfaceWave * 0.08 - crater * 0.35, 0.12, 1)
            : 0.04;

        sprite.position.copy(sprite.userData.normal).multiplyScalar(
          globeRadius + surfaceWave * (isCompact ? 2.0 : 3.4) - crater * 13
        );
        sprite.scale.setScalar(sprite.userData.baseScale * (0.84 + lightAmount * 0.38));
      });

      raycaster.setFromCamera(mouse, camera);
      const intersections = raycaster.intersectObjects(projectTargets, true);
      const hovered = intersections.find((hit) => hit.object.userData.slug);
      sceneState.hoveredSlug = hovered?.object.userData.slug ?? null;

      projectTargets.forEach((target) => {
        const isActive = target.userData.slug === sceneState.hoveredSlug;
        const scale = isActive ? 1.16 : 1;
        target.scale.lerp(cardScale.clone().multiplyScalar(scale), 0.16);
        (target.material as THREE.SpriteMaterial).opacity = isActive ? 1 : 0.9;
      });

      const positions = particles.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i += 1) {
        positions[i * 3 + 1] += Math.sin(time * 0.0012 + i) * 0.018;
        positions[i * 3] += Math.cos(time * 0.0007 + i * 0.1) * 0.01;
      }
      particles.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
      sceneState.rafId = requestAnimationFrame(animate);
    };

    sceneState.rafId = requestAnimationFrame(animate);

    const onResize = () => {
      const nextWidth = Math.max(container.offsetWidth, 1);
      const nextHeight = Math.max(container.offsetHeight, 1);
      camera.aspect = nextWidth / nextHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(nextWidth, nextHeight);
    };

    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(sceneState.rafId);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      renderer.domElement.removeEventListener('pointercancel', onPointerUp);
      renderer.domElement.removeEventListener('wheel', onWheel);

      asciiSprites.forEach((sprite) => {
        (sprite.material as THREE.SpriteMaterial).dispose();
      });
      projectTargets.forEach((target) => {
        const material = target.material as THREE.SpriteMaterial;
        material.map?.dispose();
        material.dispose();
      });
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [openProject]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: 'clamp(560px, 90vh, 900px)',
        minHeight: 0,
        position: 'relative',
        overflow: 'hidden',
      }}
    />
  );
}
