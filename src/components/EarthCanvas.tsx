import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { DESTINATIONS } from '../data/visaData';
import { Destination } from '../types';
import { LatestVisaUpdatesCard } from './LatestVisaUpdatesCard';

interface EarthCanvasProps {
  selectedDestinationId?: string;
  onSelectDestination?: (id: string) => void;
  onOpenAssessment?: (destinationId?: string) => void;
  onOpenDetailsModal?: (destination: Destination) => void;
  onOpenVisaUpdates?: () => void;
  className?: string;
}

export function EarthCanvas({
  selectedDestinationId = 'usa',
  onSelectDestination,
  onOpenAssessment,
  onOpenDetailsModal,
  onOpenVisaUpdates,
  className = ''
}: EarthCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRotating, setIsRotating] = useState(true);
  const [currentFocusedId, setCurrentFocusedId] = useState<string>(selectedDestinationId || 'usa');
  const isRotatingRef = useRef(true);
  const currentFocusedIdRef = useRef(selectedDestinationId || 'usa');
  const isVisibleRef = useRef(true);

  // Three.js References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const earthGroupRef = useRef<THREE.Group | null>(null);
  const cloudsMeshRef = useRef<THREE.Mesh | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  // 5 Tiny Aircraft & Orbital Flight Routes (Traveling in Both Directions)
  const tinyPlanesRef = useRef<Array<{
    plane: THREE.Group;
    curve: THREE.CatmullRomCurve3;
    progress: number;
    speed: number;
    direction: 1 | -1; // 1 = Left->Right (Forward), -1 = Right->Left (Reverse)
    baseScale: number;
  }>>([]);

  const markerNodesRef = useRef<Array<{
    id: string;
    group: THREE.Group;
    ring: THREE.Mesh;
    dot: THREE.Mesh;
    hitSphere: THREE.Mesh;
    targetRotationY: number;
    targetRotationX: number;
    dest: Destination;
  }>>([]);

  const targetRotationYRef = useRef<number | null>(null);
  const targetRotationXRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const prevMouseXRef = useRef(0);
  const prevMouseYRef = useRef(0);

  // Synchronize internal focused ID with prop
  useEffect(() => {
    if (selectedDestinationId) {
      setCurrentFocusedId(selectedDestinationId);
    }
  }, [selectedDestinationId]);

  useEffect(() => {
    isRotatingRef.current = isRotating;
  }, [isRotating]);

  useEffect(() => {
    currentFocusedIdRef.current = currentFocusedId;
  }, [currentFocusedId]);

  // Main Three.js Scene Setup & LifeCycle
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsRotating(false);
      isRotatingRef.current = false;
    }

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const isLowPowerViewport = width < 768;

    // 1. SCENE & CAMERA
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 1000);
    camera.position.set(0, 0.15, 3.25);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isLowPowerViewport,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isLowPowerViewport ? 1 : 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 2. REALISTIC SPACE LIGHTING & SUNLIGHT
    const ambientLight = new THREE.AmbientLight(0x102238, 0.85);
    scene.add(ambientLight);

    // Primary Warm Sunlight
    const sunLight = new THREE.DirectionalLight(0xfffaec, 2.7);
    sunLight.position.set(5.5, 3.5, 4.5);
    scene.add(sunLight);

    // Atmospheric Backscatter Light
    const atmosphereFill = new THREE.DirectionalLight(0x38bdf8, 0.9);
    atmosphereFill.position.set(-4.5, -2, -3.5);
    scene.add(atmosphereFill);

    // 3. BACKGROUND: Deep Starlight Field
    const starGeometry = new THREE.BufferGeometry();
    const starCount = isLowPowerViewport ? 320 : 520;
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 26 + Math.random() * 26;
      starPositions[i] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPositions[i + 2] = r * Math.cos(phi);

      const starTint = Math.random();
      if (starTint > 0.8) {
        starColors[i] = 1.0; starColors[i + 1] = 0.92; starColors[i + 2] = 0.8;
      } else if (starTint > 0.4) {
        starColors[i] = 0.85; starColors[i + 1] = 0.95; starColors[i + 2] = 1.0;
      } else {
        starColors[i] = 0.98; starColors[i + 1] = 0.98; starColors[i + 2] = 1.0;
      }
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    const starMaterial = new THREE.PointsMaterial({
      size: 0.13,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
    });
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    // 4. MAIN EARTH GROUP (With natural 23.4° axial tilt)
    const earthGroup = new THREE.Group();
    earthGroup.rotation.x = 0.18;
    earthGroup.rotation.z = -0.04;
    scene.add(earthGroup);
    earthGroupRef.current = earthGroup;

    // Coordinate Conversion Helper
    function latLonToVector3(lat: number, lon: number, radius = 1) {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      return new THREE.Vector3(
        -radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      );
    }

    // 5. PHOTOREALISTIC PROCEDURAL BASE MAP & SPECULAR TEXTURE
    const texWidth = isLowPowerViewport ? 1024 : 1536;
    const texHeight = isLowPowerViewport ? 512 : 768;
    const canvas = document.createElement('canvas');
    canvas.width = texWidth;
    canvas.height = texHeight;
    const ctx = canvas.getContext('2d');

    const specCanvas = document.createElement('canvas');
    specCanvas.width = texWidth;
    specCanvas.height = texHeight;
    const specCtx = specCanvas.getContext('2d');

    if (ctx && specCtx) {
      // 5a. Realistic Oceanic Bathymetry
      const oceanGrad = ctx.createLinearGradient(0, 0, 0, texHeight);
      oceanGrad.addColorStop(0, '#0a1d37');    // Arctic
      oceanGrad.addColorStop(0.2, '#092548');  // North Atlantic & Pacific
      oceanGrad.addColorStop(0.5, '#0b2e5a');  // Deep Equatorial Sapphire
      oceanGrad.addColorStop(0.8, '#092548');  // South Seas
      oceanGrad.addColorStop(1, '#07162a');    // Antarctic
      ctx.fillStyle = oceanGrad;
      ctx.fillRect(0, 0, texWidth, texHeight);

      // Specular Map: Oceans are reflective
      specCtx.fillStyle = '#b8d2ea';
      specCtx.fillRect(0, 0, texWidth, texHeight);

      const toX = (lon: number) => ((lon + 180) / 360) * texWidth;
      const toY = (lat: number) => ((90 - lat) / 180) * texHeight;

      // 5b. Detailed Continent Render Function with Shallow Coastal Shelves
      const drawRealisticLandmass = (
        pts: Array<[number, number]>,
        fillColor: string,
        shelfColor = 'rgba(28, 136, 172, 0.48)',
        isDesert = false
      ) => {
        if (pts.length < 3) return;

        // Coastal Shelf
        ctx.beginPath();
        ctx.moveTo(toX(pts[0][1]), toY(pts[0][0]));
        for (let i = 1; i < pts.length; i++) {
          ctx.lineTo(toX(pts[i][1]), toY(pts[i][0]));
        }
        ctx.closePath();
        ctx.strokeStyle = shelfColor;
        ctx.lineWidth = 15;
        ctx.lineJoin = 'round';
        ctx.stroke();

        // Landmass Body
        ctx.beginPath();
        ctx.moveTo(toX(pts[0][1]), toY(pts[0][0]));
        for (let i = 1; i < pts.length; i++) {
          ctx.lineTo(toX(pts[i][1]), toY(pts[i][0]));
        }
        ctx.closePath();
        ctx.fillStyle = fillColor;
        ctx.fill();

        ctx.strokeStyle = isDesert ? '#a6854b' : '#224a1e';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Specular Map: Land is matte
        specCtx.beginPath();
        specCtx.moveTo(toX(pts[0][1]), toY(pts[0][0]));
        for (let i = 1; i < pts.length; i++) {
          specCtx.lineTo(toX(pts[i][1]), toY(pts[i][0]));
        }
        specCtx.closePath();
        specCtx.fillStyle = '#080808';
        specCtx.fill();
      };

      // NORTH AMERICA & USA FOCUS (Lush East/Midwest, Rocky Mountain & Desert Southwest, Florida, Alaska)
      drawRealisticLandmass([
        [72, -165], [71, -155], [70, -135], [60, -140], [55, -132], [50, -127], [48, -124],
        [38, -123], [34, -120], [32, -117], [28, -114], [23, -110], [24, -108], [20, -105],
        [16, -96], [14, -92], [9, -83], [8, -79], [9, -77], [15, -83], [16, -88],
        [21, -87], [22, -90], [26, -97], [29, -94], [30, -88], [25, -80], [28, -80],
        [35, -75], [41, -71], [44, -66], [47, -53], [52, -56], [58, -62], [62, -75],
        [60, -82], [53, -80], [56, -90], [64, -94], [68, -105], [70, -130], [72, -165]
      ], '#2e5628');

      // US Southwest Desert & Rocky Ridge
      drawRealisticLandmass([
        [43, -116], [38, -118], [32, -115], [30, -105], [35, -102], [43, -106], [43, -116]
      ], '#9e8048', 'rgba(0,0,0,0)', true);

      // Great Lakes (Lake Superior, Michigan, Huron, Erie, Ontario)
      ctx.fillStyle = '#0c274c';
      ctx.beginPath();
      ctx.ellipse(toX(-85), toY(45), 18, 10, 0, 0, Math.PI * 2);
      ctx.fill();

      // Greenland
      drawRealisticLandmass([
        [83, -30], [81, -15], [76, -20], [68, -25], [60, -44], [65, -52], [76, -68], [82, -60], [83, -30]
      ], '#e5edf5', 'rgba(120, 180, 220, 0.4)');

      // SOUTH AMERICA
      drawRealisticLandmass([
        [12, -72], [11, -66], [10, -62], [5, -52], [0, -50], [-5, -35], [-8, -35],
        [-13, -39], [-23, -42], [-33, -51], [-40, -58], [-48, -65], [-55, -68], [-54, -73],
        [-45, -75], [-35, -72], [-22, -70], [-15, -75], [-5, -81], [2, -79], [8, -77], [12, -72]
      ], '#224a1e');

      // Amazon Jungle
      drawRealisticLandmass([
        [3, -68], [2, -52], [-8, -48], [-12, -62], [-5, -72], [3, -68]
      ], '#163814', 'rgba(0,0,0,0)');

      // EUROPE & UK
      drawRealisticLandmass([
        [71, 28], [69, 16], [62, 5], [58, 6], [54, 8], [51, 2], [48, -4], [43, -9],
        [37, -9], [36, -5], [38, 0], [42, 3], [44, 9], [40, 18], [38, 24], [35, 25],
        [40, 26], [42, 29], [46, 30], [53, 34], [57, 39], [64, 40], [68, 38], [71, 28]
      ], '#35632a');

      // Great Britain & Ireland
      drawRealisticLandmass([[58, -5], [55, -1], [50, 0], [51, -5], [55, -6], [58, -5]], '#35632a');
      drawRealisticLandmass([[55, -8], [53, -6], [51, -10], [54, -10], [55, -8]], '#35632a');

      // AFRICA
      drawRealisticLandmass([
        [36, -5], [37, 10], [33, 12], [32, 25], [31, 32], [28, 34], [22, 38], [12, 44],
        [12, 51], [2, 45], [-4, 40], [-15, 40], [-25, 33], [-34, 18], [-34, 26],
        [-28, 16], [-15, 12], [-5, 12], [4, 9], [5, 2], [5, -4], [10, -14], [15, -17],
        [21, -17], [28, -13], [35, -6], [36, -5]
      ], '#8e723e', 'rgba(28, 136, 172, 0.45)', true);

      // Congo Rainforest
      drawRealisticLandmass([[5, 10], [4, 28], [-8, 28], [-10, 14], [-2, 10], [5, 10]], '#1e481b', 'rgba(0,0,0,0)');

      // ASIA, MIDDLE EAST, INDIA, JAPAN
      drawRealisticLandmass([
        [75, 100], [72, 140], [66, 170], [60, 162], [55, 140], [45, 135], [38, 128],
        [35, 120], [22, 114], [22, 108], [15, 108], [8, 103], [14, 100], [21, 90],
        [22, 70], [25, 62], [15, 74], [8, 77], [20, 70], [25, 60], [30, 50], [35, 35],
        [42, 35], [45, 50], [55, 60], [60, 70], [70, 75], [75, 100]
      ], '#2f5729');

      // Arabian Peninsula & UAE
      drawRealisticLandmass([[32, 35], [30, 48], [24, 58], [14, 53], [12, 44], [20, 38], [28, 34], [32, 35]], '#a8884e', 'rgba(28, 136, 172, 0.35)', true);

      // Himalayas Mountain Snow Ridge
      ctx.beginPath();
      ctx.moveTo(toX(75), toY(35));
      ctx.lineTo(toX(92), toY(28));
      ctx.strokeStyle = '#f1f6fc';
      ctx.lineWidth = 3.8;
      ctx.stroke();

      // Japan
      drawRealisticLandmass([[45, 142], [40, 140], [35, 135], [32, 130], [35, 133], [40, 141], [45, 142]], '#35632a');

      // Singapore & Southeast Asia
      drawRealisticLandmass([[5, 100], [1.35, 103.8], [-6, 106], [-8, 115], [-5, 120], [2, 118], [5, 115]], '#204d1d');

      // AUSTRALIA
      drawRealisticLandmass([
        [-12, 130], [-15, 136], [-12, 142], [-22, 150], [-28, 153], [-37, 150],
        [-38, 140], [-35, 135], [-35, 118], [-32, 115], [-22, 114], [-16, 124], [-12, 130]
      ], '#8d532a', 'rgba(28, 136, 172, 0.45)', true);

      // Australia East Coast Green
      drawRealisticLandmass([[-20, 148], [-28, 153], [-37, 150], [-35, 142], [-25, 145], [-20, 148]], '#355f27', 'rgba(0,0,0,0)');

      // ANTARCTICA
      drawRealisticLandmass([
        [-68, -180], [-66, -120], [-64, -60], [-70, 0], [-66, 60], [-64, 120],
        [-68, 180], [-90, 180], [-90, -180], [-68, -180]
      ], '#eaf0f8', 'rgba(140, 200, 240, 0.5)');

      // 5c. City Night Lights Clusters (USA, Europe, Asia, Australia)
      const drawCityLight = (lon: number, lat: number, r: number) => {
        const x = toX(lon);
        const y = toY(lat);
        const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
        grad.addColorStop(0, 'rgba(255, 235, 160, 0.85)');
        grad.addColorStop(0.5, 'rgba(255, 180, 50, 0.35)');
        grad.addColorStop(1, 'rgba(255, 180, 50, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      };

      // USA Eastern Megalopolis (NY, Boston, DC), West Coast (LA, SF), Chicago
      drawCityLight(-74, 40.7, 7);
      drawCityLight(-71, 42.3, 5);
      drawCityLight(-77, 38.9, 6);
      drawCityLight(-87.6, 41.8, 6);
      drawCityLight(-118.2, 34.0, 7);
      drawCityLight(-122.4, 37.7, 6);
      drawCityLight(-95.3, 29.7, 5);

      // Europe (London, Paris, Berlin, Rome)
      drawCityLight(-0.1, 51.5, 7);
      drawCityLight(2.35, 48.8, 7);
      drawCityLight(13.4, 52.5, 5);
      drawCityLight(12.5, 41.9, 5);

      // Asia & Australia (Tokyo, Singapore, Sydney, Dubai, Hong Kong)
      drawCityLight(139.6, 35.6, 8);
      drawCityLight(103.8, 1.35, 7);
      drawCityLight(151.2, -33.8, 6);
      drawCityLight(55.2, 25.2, 6);
      drawCityLight(114.1, 22.3, 6);
    }

    const earthTexture = new THREE.CanvasTexture(canvas);
    earthTexture.wrapS = THREE.ClampToEdgeWrapping;
    earthTexture.wrapT = THREE.ClampToEdgeWrapping;

    const specularTexture = new THREE.CanvasTexture(specCanvas);

    // 6. MAIN EARTH SPHERE
    const earthGeometry = new THREE.SphereGeometry(1, isLowPowerViewport ? 36 : 48, isLowPowerViewport ? 36 : 48);
    const earthMaterial = new THREE.MeshPhongMaterial({
      map: earthTexture,
      specularMap: specularTexture,
      specular: new THREE.Color(0x3ea0e4),
      shininess: 35,
      emissive: new THREE.Color(0x020814),
      emissiveIntensity: 0.8,
    });
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    earthGroup.add(earthMesh);

    // NASA Blue Marble Seamless Texture Loader
    const textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = 'anonymous';
    const earthDayUrl = 'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg';
    const earthCloudsUrl = 'https://unpkg.com/three-globe/example/img/earth-clouds.png';

    textureLoader.load(
      earthDayUrl,
      (loadedTexture) => {
        loadedTexture.wrapS = THREE.ClampToEdgeWrapping;
        loadedTexture.wrapT = THREE.ClampToEdgeWrapping;
        earthMaterial.map = loadedTexture;
        earthMaterial.needsUpdate = true;
      },
      undefined,
      () => {
        // Fallback procedural canvas is active
      }
    );

    // 7. SEPARATE 3D PARALLAX CLOUD LAYER
    const cloudCanvas = document.createElement('canvas');
    cloudCanvas.width = 1024;
    cloudCanvas.height = 512;
    const cloudCtx = cloudCanvas.getContext('2d');

    if (cloudCtx) {
      cloudCtx.clearRect(0, 0, 1024, 512);
      for (let i = 0; i < (isLowPowerViewport ? 180 : 280); i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 512;
        const radius = 12 + Math.random() * 45;
        const opacity = 0.08 + Math.random() * 0.28;

        const grad = cloudCtx.createRadialGradient(x, y, 0, x, y, radius);
        grad.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
        grad.addColorStop(0.6, `rgba(255, 255, 255, ${opacity * 0.5})`);
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        cloudCtx.fillStyle = grad;
        cloudCtx.beginPath();
        cloudCtx.arc(x, y, radius, 0, Math.PI * 2);
        cloudCtx.fill();
      }
    }

    const cloudTexture = new THREE.CanvasTexture(cloudCanvas);
    const cloudGeometry = new THREE.SphereGeometry(1.015, isLowPowerViewport ? 32 : 40, isLowPowerViewport ? 32 : 40);
    const cloudMaterial = new THREE.MeshStandardMaterial({
      map: cloudTexture,
      transparent: true,
      opacity: 0.68,
      blending: THREE.AdditiveBlending,
      roughness: 0.9,
      metalness: 0.1,
    });
    const cloudsMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
    earthGroup.add(cloudsMesh);
    cloudsMeshRef.current = cloudsMesh;

    textureLoader.load(
      earthCloudsUrl,
      (loadedCloudTex) => {
        cloudMaterial.map = loadedCloudTex;
        cloudMaterial.needsUpdate = true;
      },
      undefined,
      () => {}
    );

    // 8. PHYSICAL RAYLEIGH ATMOSPHERE SCATTERING SHADER
    const atmosphereGeometry = new THREE.SphereGeometry(1.18, isLowPowerViewport ? 36 : 48, isLowPowerViewport ? 36 : 48);
    const atmosphereMaterial = new THREE.ShaderMaterial({
      uniforms: {
        c: { value: 0.28 },
        p: { value: 4.2 },
        glowColor: { value: new THREE.Color(0x38bdf8) },
        viewVector: { value: camera.position },
      },
      vertexShader: `
        uniform vec3 viewVector;
        uniform float c;
        uniform float p;
        varying float intensity;
        void main() {
          vec3 vNormal = normalize( normalMatrix * normal );
          vec3 vNormel = normalize( normalMatrix * viewVector );
          intensity = pow( c - dot(vNormal, vNormel), p );
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        varying float intensity;
        void main() {
          vec3 glow = glowColor * intensity;
          gl_FragColor = vec4( glow, intensity * 0.75 );
        }
      `,
      side: THREE.BackSide,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphereMesh);

    // 9. HIGH-FIDELITY 3D MODERN PASSENGER JET AIRLINER MODEL (TINY & REFINED)
    function buildPassengerJet(goldTrim = false, isSkyBlue = false): THREE.Group {
      const plane = new THREE.Group();
      const bodyMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.35, roughness: 0.25 });
      const wingMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.45, roughness: 0.2 });
      const engineMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.75, roughness: 0.15 });
      const trimMat = new THREE.MeshStandardMaterial({
        color: goldTrim ? 0xb8860b : (isSkyBlue ? 0x0284c7 : 0x1e3a8a),
        metalness: 0.6,
        roughness: 0.2
      });
      const glassMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.1 });

      // Fuselage
      const fuselageGeo = new THREE.CylinderGeometry(0.015, 0.013, 0.14, 14);
      fuselageGeo.rotateX(Math.PI / 2);
      plane.add(new THREE.Mesh(fuselageGeo, bodyMat));

      // Nose
      const noseGeo = new THREE.ConeGeometry(0.015, 0.04, 14);
      noseGeo.rotateX(Math.PI / 2);
      const nose = new THREE.Mesh(noseGeo, bodyMat);
      nose.position.z = 0.09;
      plane.add(nose);

      // Cockpit
      const cockpit = new THREE.Mesh(new THREE.BoxGeometry(0.016, 0.007, 0.018), glassMat);
      cockpit.position.set(0, 0.009, 0.076);
      cockpit.rotation.x = -0.28;
      plane.add(cockpit);

      // Tailcone
      const tailconeGeo = new THREE.ConeGeometry(0.013, 0.045, 14);
      tailconeGeo.rotateX(-Math.PI / 2);
      const tailcone = new THREE.Mesh(tailconeGeo, bodyMat);
      tailcone.position.z = -0.092;
      plane.add(tailcone);

      // Wings
      const wingShape = new THREE.Shape();
      wingShape.moveTo(0, 0.035);
      wingShape.lineTo(0.13, -0.035);
      wingShape.lineTo(0.12, -0.055);
      wingShape.lineTo(0, -0.018);
      wingShape.lineTo(-0.12, -0.055);
      wingShape.lineTo(-0.13, -0.035);
      wingShape.closePath();
      const wingGeo = new THREE.ExtrudeGeometry(wingShape, { depth: 0.003, bevelEnabled: false });
      wingGeo.rotateX(Math.PI / 2);
      const wings = new THREE.Mesh(wingGeo, wingMat);
      wings.position.set(0, -0.002, 0.01);
      plane.add(wings);

      // Winglets
      const w1 = new THREE.Mesh(new THREE.BoxGeometry(0.002, 0.014, 0.01), trimMat);
      w1.position.set(-0.125, 0.006, -0.045);
      plane.add(w1);
      const w2 = new THREE.Mesh(new THREE.BoxGeometry(0.002, 0.014, 0.01), trimMat);
      w2.position.set(0.125, 0.006, -0.045);
      plane.add(w2);

      // Engines
      const makeEngine = (xPos: number) => {
        const eng = new THREE.Group();
        const nacelle = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.007, 0.032, 10), engineMat);
        nacelle.rotation.x = Math.PI / 2;
        eng.add(nacelle);
        eng.position.set(xPos, -0.01, 0.005);
        return eng;
      };
      plane.add(makeEngine(-0.05));
      plane.add(makeEngine(0.05));

      // Tail Fin
      const finShape = new THREE.Shape();
      finShape.moveTo(0, 0);
      finShape.lineTo(0.03, 0);
      finShape.lineTo(0.008, 0.04);
      finShape.lineTo(0, 0.04);
      finShape.closePath();
      const finGeo = new THREE.ExtrudeGeometry(finShape, { depth: 0.002, bevelEnabled: false });
      finGeo.rotateY(Math.PI / 2);
      const fin = new THREE.Mesh(finGeo, trimMat);
      fin.position.set(0, 0.008, -0.105);
      fin.rotation.x = -0.18;
      plane.add(fin);

      // Scaled down to be tiny and refined (Earth remains dominant)
      plane.scale.setScalar(0.24);
      return plane;
    }

    // 10. MULTIPLE FLIGHT CORRIDORS IN BOTH DIRECTIONS (West->East & East->West)
    // Route 1: Transatlantic West -> East (USA to Europe / UK)
    const r1 = 1.27;
    const path1Points = [
      new THREE.Vector3(-r1 * 1.05, 0.28, 0.2),
      new THREE.Vector3(-r1 * 0.55, 0.38, 0.8),
      new THREE.Vector3(0.0, 0.30, r1 * 0.95),
      new THREE.Vector3(r1 * 0.65, 0.15, 0.72),
      new THREE.Vector3(r1 * 1.06, -0.08, 0.15),
      new THREE.Vector3(r1 * 0.68, -0.22, -0.75),
      new THREE.Vector3(0.0, -0.1, -r1 * 0.95),
      new THREE.Vector3(-r1 * 0.68, 0.1, -0.72),
    ];
    const path1Curve = new THREE.CatmullRomCurve3(path1Points, true, 'centripetal');
    const p1Geo = new THREE.BufferGeometry().setFromPoints(path1Curve.getPoints(80));
    const p1Mat = new THREE.LineDashedMaterial({
      color: 0xb8860b,
      dashSize: 0.03,
      gapSize: 0.02,
      transparent: true,
      opacity: 0.4,
    });
    const path1Line = new THREE.Line(p1Geo, p1Mat);
    path1Line.computeLineDistances();
    scene.add(path1Line);

    // Route 2: Transpacific East -> West (Asia/Japan to USA)
    const r2 = 1.33;
    const path2Points = [
      new THREE.Vector3(r2 * 1.05, -0.16, 0.15),
      new THREE.Vector3(r2 * 0.58, -0.32, 0.8),
      new THREE.Vector3(-0.05, -0.24, r2 * 0.96),
      new THREE.Vector3(-r2 * 0.66, -0.08, 0.7),
      new THREE.Vector3(-r2 * 1.05, 0.16, 0.12),
      new THREE.Vector3(-r2 * 0.62, 0.30, -0.76),
      new THREE.Vector3(0.05, 0.18, -r2 * 0.96),
      new THREE.Vector3(r2 * 0.65, 0.02, -0.72),
    ];
    const path2Curve = new THREE.CatmullRomCurve3(path2Points, true, 'centripetal');
    const p2Geo = new THREE.BufferGeometry().setFromPoints(path2Curve.getPoints(80));
    const p2Mat = new THREE.LineDashedMaterial({
      color: 0x38bdf8,
      dashSize: 0.03,
      gapSize: 0.02,
      transparent: true,
      opacity: 0.35,
    });
    const path2Line = new THREE.Line(p2Geo, p2Mat);
    path2Line.computeLineDistances();
    scene.add(path2Line);

    // Route 3: Eurasia West -> East (Europe to UAE & Singapore)
    const r3 = 1.25;
    const path3Points = [
      new THREE.Vector3(-r3 * 0.4, 0.42, 0.82),
      new THREE.Vector3(0.1, 0.28, r3 * 0.96),
      new THREE.Vector3(r3 * 0.72, 0.08, 0.65),
      new THREE.Vector3(r3 * 0.98, -0.22, 0.1),
      new THREE.Vector3(0.5, -0.35, -r3 * 0.8),
      new THREE.Vector3(-0.3, -0.15, -r3 * 0.92),
      new THREE.Vector3(-r3 * 0.88, 0.18, -0.3),
      new THREE.Vector3(-r3 * 0.75, 0.35, 0.4),
    ];
    const path3Curve = new THREE.CatmullRomCurve3(path3Points, true, 'centripetal');
    const p3Geo = new THREE.BufferGeometry().setFromPoints(path3Curve.getPoints(70));
    const p3Mat = new THREE.LineDashedMaterial({
      color: 0xdfba73,
      dashSize: 0.025,
      gapSize: 0.02,
      transparent: true,
      opacity: 0.3,
    });
    const path3Line = new THREE.Line(p3Geo, p3Mat);
    path3Line.computeLineDistances();
    scene.add(path3Line);

    // Route 4: Oceania to Asia East -> West (Australia to Singapore)
    const r4 = 1.29;
    const path4Points = [
      new THREE.Vector3(r4 * 0.8, -0.45, 0.35),
      new THREE.Vector3(r4 * 0.4, -0.25, 0.88),
      new THREE.Vector3(-0.2, 0.05, r4 * 0.96),
      new THREE.Vector3(-r4 * 0.7, 0.3, 0.6),
      new THREE.Vector3(-r4 * 0.95, 0.2, -0.2),
      new THREE.Vector3(-0.4, -0.1, -r4 * 0.9),
      new THREE.Vector3(0.3, -0.35, -r4 * 0.8),
      new THREE.Vector3(r4 * 0.9, -0.4, -0.1),
    ];
    const path4Curve = new THREE.CatmullRomCurve3(path4Points, true, 'centripetal');

    // Route 5: Pan-American West -> East (Canada / USA to South America)
    const r5 = 1.31;
    const path5Points = [
      new THREE.Vector3(-r5 * 0.85, 0.45, 0.2),
      new THREE.Vector3(-r5 * 0.65, 0.15, 0.74),
      new THREE.Vector3(-r5 * 0.3, -0.38, 0.88),
      new THREE.Vector3(0.2, -0.55, 0.7),
      new THREE.Vector3(r5 * 0.8, -0.2, 0.4),
      new THREE.Vector3(r5 * 0.9, 0.25, -0.3),
      new THREE.Vector3(0.1, 0.5, -r5 * 0.8),
      new THREE.Vector3(-r5 * 0.6, 0.5, -0.4),
    ];
    const path5Curve = new THREE.CatmullRomCurve3(path5Points, true, 'centripetal');

    // Instantiate 5 Tiny Aircraft with Staggered Timings & Directions
    const plane1 = buildPassengerJet(true, false);
    scene.add(plane1);

    const plane2 = buildPassengerJet(false, true);
    scene.add(plane2);

    const plane3 = buildPassengerJet(true, false);
    scene.add(plane3);

    const plane4 = buildPassengerJet(false, false);
    scene.add(plane4);

    const plane5 = buildPassengerJet(true, true);
    scene.add(plane5);

    tinyPlanesRef.current = [
      // Plane 1: West -> East (Left to Right)
      { plane: plane1, curve: path1Curve, progress: 0.12, speed: 0.00042, direction: 1, baseScale: 0.25 },
      // Plane 2: East -> West (Right to Left)
      { plane: plane2, curve: path2Curve, progress: 0.58, speed: 0.00035, direction: -1, baseScale: 0.24 },
      // Plane 3: West -> East (Left to Right)
      { plane: plane3, curve: path3Curve, progress: 0.35, speed: 0.00048, direction: 1, baseScale: 0.23 },
      // Plane 4: East -> West (Right to Left)
      { plane: plane4, curve: path4Curve, progress: 0.82, speed: 0.00038, direction: -1, baseScale: 0.25 },
      // Plane 5: West -> East (Left to Right)
      { plane: plane5, curve: path5Curve, progress: 0.05, speed: 0.00032, direction: 1, baseScale: 0.22 },
    ];

    // 11. INTERACTIVE 3D DESTINATION PINS WITH HIT-DETECTION & FLAG LABELS
    markerNodesRef.current = [];
    const raycastableMeshes: THREE.Mesh[] = [];

    DESTINATIONS.forEach((dest) => {
      const pos = latLonToVector3(dest.lat, dest.lon, 1.004);
      const markerGroup = new THREE.Group();
      markerGroup.position.copy(pos);

      // Gold Pin Head
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.018, 16, 16),
        new THREE.MeshStandardMaterial({
          color: 0xb8860b,
          metalness: 0.85,
          roughness: 0.15,
          emissive: 0x7c5e10,
          emissiveIntensity: 0.7,
        })
      );
      markerGroup.add(dot);

      // Pulsing Beacon Ring
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.024, 0.042, 32),
        new THREE.MeshBasicMaterial({
          color: 0xdfba73,
          transparent: true,
          opacity: 0.8,
          side: THREE.DoubleSide,
        })
      );
      ring.lookAt(pos.clone().multiplyScalar(2));
      markerGroup.add(ring);

      // Invisible larger hit sphere for easy clicking/touching
      const hitSphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 12, 12),
        new THREE.MeshBasicMaterial({ visible: false })
      );
      hitSphere.userData = { destinationId: dest.id };
      markerGroup.add(hitSphere);
      raycastableMeshes.push(hitSphere);

      earthGroup.add(markerGroup);

      // Calculate Target Y Rotation to center this destination facing the camera
      const targetRotationY = -((dest.lon + 90) * (Math.PI / 180));
      // Calculate Target X Rotation (latitude centering)
      const targetRotationX = (dest.lat * 0.4) * (Math.PI / 180);

      markerNodesRef.current.push({
        id: dest.id,
        group: markerGroup,
        ring,
        dot,
        hitSphere,
        targetRotationY,
        targetRotationX,
        dest,
      });
    });

    // 12. GOLDEN FLIGHT ARCS CONNECTING USA TO GLOBAL HUBS
    function makeArc(p1: THREE.Vector3, p2: THREE.Vector3, isUSALink = false) {
      const mid = p1.clone().add(p2).multiplyScalar(0.5);
      const d = p1.distanceTo(p2);
      mid.normalize().multiplyScalar(1.0 + Math.min(d * 0.24, 0.35));
      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
      const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(45));
      const mat = new THREE.LineBasicMaterial({
        color: isUSALink ? 0xd4af37 : 0xb8860b,
        transparent: true,
        opacity: isUSALink ? 0.7 : 0.4,
        linewidth: isUSALink ? 2 : 1,
      });
      return new THREE.Line(geo, mat);
    }

    const usaV = latLonToVector3(37.09, -95.71, 1.002);
    const canV = latLonToVector3(56.13, -106.34, 1.002);
    const ukV = latLonToVector3(51.5, -0.12, 1.002);
    const eurV = latLonToVector3(48.85, 2.35, 1.002);
    const sgV = latLonToVector3(1.35, 103.82, 1.002);
    const ausV = latLonToVector3(-25.27, 133.77, 1.002);
    const asiaV = latLonToVector3(35.67, 139.65, 1.002);

    // Radiating visa corridors directly linking USA to the world
    earthGroup.add(makeArc(usaV, eurV, true));
    earthGroup.add(makeArc(usaV, ukV, true));
    earthGroup.add(makeArc(usaV, asiaV, true));
    earthGroup.add(makeArc(usaV, canV, true));
    earthGroup.add(makeArc(usaV, sgV, true));
    earthGroup.add(makeArc(eurV, sgV));
    earthGroup.add(makeArc(sgV, ausV));
    earthGroup.add(makeArc(asiaV, ausV));

    // 13. ANIMATION LOOP
    let animationFrameId: number;
    let lastRenderTime = 0;

    const animate = (timestamp = 0) => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isVisibleRef.current || document.hidden) {
        return;
      }

      const targetFrameMs = isLowPowerViewport ? 40 : 24;
      if (timestamp - lastRenderTime < targetFrameMs) {
        return;
      }
      lastRenderTime = timestamp;

      // Smooth Earth rotational slewing to target destination
      if (targetRotationYRef.current !== null && earthGroupRef.current) {
        const diffY = targetRotationYRef.current - earthGroupRef.current.rotation.y;
        earthGroupRef.current.rotation.y += diffY * 0.055;
        if (Math.abs(diffY) < 0.001) {
          targetRotationYRef.current = null;
        }
      } else if (isRotatingRef.current && !isDraggingRef.current && earthGroupRef.current) {
        earthGroupRef.current.rotation.y += 0.00085;
      }

      if (targetRotationXRef.current !== null && earthGroupRef.current) {
        const diffX = targetRotationXRef.current - earthGroupRef.current.rotation.x;
        earthGroupRef.current.rotation.x += diffX * 0.05;
        if (Math.abs(diffX) < 0.001) {
          targetRotationXRef.current = null;
        }
      }

      // Parallax Cloud Rotation
      if (cloudsMeshRef.current && isRotatingRef.current && !isDraggingRef.current) {
        cloudsMeshRef.current.rotation.y += 0.0003;
      }

      // Animate 5 Tiny Aircraft (Traveling in Both Directions with Staggered Timings)
      if (isRotatingRef.current && tinyPlanesRef.current.length > 0) {
        tinyPlanesRef.current.forEach((item, index) => {
          const { plane, curve, speed, direction, baseScale } = item;
          // Advance progress (Forward or Reverse)
          if (direction === 1) {
            item.progress = (item.progress + speed) % 1.0;
          } else {
            item.progress = (item.progress - speed + 1.0) % 1.0;
          }

          const currentPos = curve.getPointAt(item.progress);
          const lookDelta = direction === 1 ? 0.008 : -0.008;
          const lookProgress = (item.progress + lookDelta + 1.0) % 1.0;
          const lookPos = curve.getPointAt(lookProgress);

          plane.position.copy(currentPos);
          plane.lookAt(lookPos);

          const tangent = lookPos.clone().sub(currentPos).normalize();
          const normal = currentPos.clone().normalize();
          const binormal = new THREE.Vector3().crossVectors(tangent, normal).normalize();
          const bankOffset = index % 2 === 0 ? 0.15 : -0.15;
          plane.up.copy(normal.addScaledVector(binormal, bankOffset).normalize());

          // Depth Cueing: scale & slight lighting cue
          const dist = camera.position.distanceTo(currentPos);
          const depthFactor = THREE.MathUtils.clamp(3.3 / dist, 0.75, 1.15);
          plane.scale.setScalar(baseScale * depthFactor);
        });
      }

      // Destination Pin Beacon Pulse
      const now = Date.now() * 0.003;
      markerNodesRef.current.forEach((m) => {
        const isFocused = m.id === currentFocusedIdRef.current;
        const baseScale = isFocused ? 1.6 : 1.0;
        const pulse = 1 + Math.sin(now) * (isFocused ? 0.38 : 0.12);
        m.ring.scale.setScalar(baseScale * pulse);
        const ringMat = m.ring.material as THREE.MeshBasicMaterial;
        ringMat.opacity = isFocused ? 0.95 : 0.45;
        if (isFocused) {
          (m.dot.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.0;
        } else {
          (m.dot.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.5;
        }
      });

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    // 14. RAYCASTING INTERACTION (CLICK DIRECTLY ON GLOBE PINS)
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      prevMouseXRef.current = e.clientX;
      prevMouseYRef.current = e.clientY;
    };

    const handlePointerClick = (e: MouseEvent) => {
      if (!container || !camera) return;
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(raycastableMeshes, true);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        const destId = hit.userData?.destinationId;
        if (destId) {
          setCurrentFocusedId(destId);
          if (onSelectDestination) {
            onSelectDestination(destId);
          }
          const node = markerNodesRef.current.find((m) => m.id === destId);
          if (node) {
            targetRotationYRef.current = node.targetRotationY;
            targetRotationXRef.current = node.targetRotationX;
          }
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !earthGroupRef.current) return;
      const deltaX = e.clientX - prevMouseXRef.current;
      const deltaY = e.clientY - prevMouseYRef.current;
      earthGroupRef.current.rotation.y += deltaX * 0.004;
      earthGroupRef.current.rotation.x += deltaY * 0.002;
      earthGroupRef.current.rotation.x = Math.max(-0.4, Math.min(0.4, earthGroupRef.current.rotation.x));
      prevMouseXRef.current = e.clientX;
      prevMouseYRef.current = e.clientY;
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        prevMouseXRef.current = e.touches[0].clientX;
        prevMouseYRef.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || !earthGroupRef.current || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevMouseXRef.current;
      const deltaY = e.touches[0].clientY - prevMouseYRef.current;
      earthGroupRef.current.rotation.y += deltaX * 0.004;
      earthGroupRef.current.rotation.x += deltaY * 0.002;
      earthGroupRef.current.rotation.x = Math.max(-0.4, Math.min(0.4, earthGroupRef.current.rotation.x));
      prevMouseXRef.current = e.touches[0].clientX;
      prevMouseYRef.current = e.touches[0].clientY;
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', handlePointerDown);
    dom.addEventListener('click', handlePointerClick);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    dom.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, w < 768 ? 1 : 1.5));
    };

    window.addEventListener('resize', handleResize);

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    visibilityObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      dom.removeEventListener('mousedown', handlePointerDown);
      dom.removeEventListener('click', handlePointerClick);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      dom.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('resize', handleResize);
      visibilityObserver.disconnect();
      renderer.dispose();
    };
  }, [onSelectDestination]);

  // Slew globe when destination changes from UI or external prop
  useEffect(() => {
    if (!currentFocusedId) return;
    const node = markerNodesRef.current.find((m) => m.id === currentFocusedId);
    if (node && earthGroupRef.current) {
      targetRotationYRef.current = node.targetRotationY;
      targetRotationXRef.current = node.targetRotationX;
    }
  }, [currentFocusedId]);

  const activeDest = DESTINATIONS.find((d) => d.id === currentFocusedId) || DESTINATIONS[0];

  const handleSelectCountry = (id: string) => {
    setCurrentFocusedId(id);
    if (onSelectDestination) {
      onSelectDestination(id);
    }
    const node = markerNodesRef.current.find((m) => m.id === id);
    if (node) {
      targetRotationYRef.current = node.targetRotationY;
      targetRotationXRef.current = node.targetRotationX;
    }
  };

  return (
    <div className={`relative w-full h-full select-none ${className}`}>
      {/* 3D Canvas Viewport */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* TOP VISA DESTINATION SELECTOR RIBBON */}
      <div className="absolute top-4 inset-x-4 z-30 flex flex-wrap items-center justify-center gap-2 pointer-events-auto">
        <div className="bg-[#fffdd0]/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#b8860b]/30 shadow-md flex items-center gap-1.5 overflow-x-auto max-w-full">
          <span className="text-[10px] uppercase font-bold text-[#b8860b] tracking-wider px-1 hidden sm:inline">
            Focus Visa Hub:
          </span>
          {DESTINATIONS.map((d) => {
            const isSelected = d.id === currentFocusedId;
            return (
              <button
                key={d.id}
                id={`globe-select-dest-${d.id}`}
                onClick={() => handleSelectCountry(d.id)}
                className={`px-3 py-1 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#b8860b] text-white shadow-xs scale-105'
                    : 'text-[#2d2d2d]/80 hover:bg-[#b8860b]/10 hover:text-[#b8860b]'
                }`}
              >
                <span>{d.flag}</span>
                <span>{d.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* LATEST VISA UPDATES CARD (BOTTOM-RIGHT) */}
      <div className="absolute bottom-16 right-4 sm:right-8 z-30 pointer-events-auto">
        <LatestVisaUpdatesCard
          onOpenUpdates={() => {
            if (onOpenVisaUpdates) {
              onOpenVisaUpdates();
            }
          }}
        />
      </div>

      {/* Orbit Motion Controls Bottom-Left */}
      <div className="absolute bottom-4 left-4 z-30 flex items-center gap-2 bg-[#f5f5dc]/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#2d2d2d]/10 text-xs text-[#2d2d2d]/80 shadow-sm pointer-events-auto">
        <button
          onClick={() => setIsRotating((prev) => !prev)}
          className="flex items-center gap-1.5 hover:text-[#b8860b] transition-colors cursor-pointer"
          title={isRotating ? 'Pause Earth & orbital flight motion' : 'Resume live orbital motion'}
        >
          <span className={`inline-block w-2 h-2 rounded-full ${isRotating ? 'bg-[#b8860b] animate-pulse' : 'bg-stone-400'}`} />
          <span className="font-medium">{isRotating ? 'Orbital Live' : 'Motion Paused'}</span>
        </button>
        <span className="text-[#2d2d2d]/30">|</span>
        <span className="hidden sm:inline text-[11px] text-[#4a3c31]/70">Drag to rotate 3D Earth</span>
      </div>
    </div>
  );
}
