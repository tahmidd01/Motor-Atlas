import { useEffect, useRef, useState } from 'react';
import { Pause, Play, RotateCcw, ZoomIn, ZoomOut, MoveLeft, MoveRight } from 'lucide-react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

interface Asset {
  path: string;
  credit: string;
  license: string;
}
interface Controls {
  reset: () => void;
  zoom: (direction: number) => void;
  orbit: (direction: number) => void;
}
export default function ModelViewer({ model }: { model?: Asset }) {
  const container = useRef<HTMLDivElement>(null);
  const actions = useRef<Controls | undefined>(undefined);
  const auto = useRef(false);
  const [rotating, setRotating] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(!!model);
  useEffect(() => {
    const host = container.current;
    if (!host) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'low-power',
      });
    } catch {
      setError(
        'The interactive exhibit needs WebGL. You can still explore all photographs and specifications.',
      );
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.setClearColor(0x171b17, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    host.appendChild(renderer.domElement);
    renderer.domElement.setAttribute(
      'aria-label',
      model
        ? 'Interactive vehicle model'
        : 'Abstract wheel assembly; drag to orbit and use controls to zoom',
    );
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(4, 2.5, 5);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0.2, 0);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 2;
    controls.maxDistance = 10;
    scene.add(new THREE.HemisphereLight(0xe2eee0, 0x262a23, 3));
    const key = new THREE.DirectionalLight(0xffffff, 5);
    key.position.set(4, 6, 4);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xe87550, 2);
    rim.position.set(-4, 2, -2);
    scene.add(rim);
    const exhibit = new THREE.Group();
    scene.add(exhibit);
    if (model) {
      new GLTFLoader().load(
        model.path,
        (gltf) => {
          const bounds = new THREE.Box3().setFromObject(gltf.scene);
          const size = bounds.getSize(new THREE.Vector3());
          const centre = bounds.getCenter(new THREE.Vector3());
          const scale = 3 / Math.max(size.x, size.y, size.z);
          gltf.scene.position.sub(centre);
          const wrapper = new THREE.Group();
          wrapper.add(gltf.scene);
          wrapper.scale.setScalar(scale);
          exhibit.add(wrapper);
          setLoading(false);
        },
        undefined,
        () => {
          setLoading(false);
          setError(
            'This vehicle asset could not be loaded. Its photographs and specifications remain available.',
          );
        },
      );
    } else {
      const metal = new THREE.MeshStandardMaterial({
        color: 0xb2b8b0,
        metalness: 0.95,
        roughness: 0.22,
      });
      const darkMetal = new THREE.MeshStandardMaterial({
        color: 0x3a4137,
        metalness: 0.8,
        roughness: 0.32,
      });
      const rubber = new THREE.MeshStandardMaterial({ color: 0x111410, roughness: 0.9 });
      const tire = new THREE.Mesh(new THREE.TorusGeometry(1.18, 0.28, 24, 72), rubber);
      exhibit.add(tire);
      for (const z of [-0.13, 0.13]) {
        const edge = new THREE.Mesh(new THREE.TorusGeometry(0.99, 0.055, 12, 64), metal);
        edge.position.z = z;
        exhibit.add(edge);
      }
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.42, 32), metal);
      hub.rotation.x = Math.PI / 2;
      exhibit.add(hub);
      const disk = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.04, 64), darkMetal);
      disk.rotation.x = Math.PI / 2;
      disk.position.z = -0.1;
      exhibit.add(disk);
      for (let i = 0; i < 10; i++) {
        const angle = (i / 10) * Math.PI * 2;
        const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.095, 0.85, 0.14), metal);
        spoke.position.set(Math.sin(angle) * 0.58, Math.cos(angle) * 0.58, 0.12);
        spoke.rotation.z = -angle;
        exhibit.add(spoke);
      }
      const caliper = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 0.6, 0.2),
        new THREE.MeshStandardMaterial({ color: 0xe87550, metalness: 0.3, roughness: 0.45 }),
      );
      caliper.position.set(0.62, 0, -0.07);
      exhibit.add(caliper);
      for (let i = 0; i < 5; i++) {
        const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.06, 8), darkMetal);
        bolt.rotation.x = Math.PI / 2;
        bolt.position.set(
          Math.sin((i / 5) * Math.PI * 2) * 0.13,
          Math.cos((i / 5) * Math.PI * 2) * 0.13,
          0.25,
        );
        exhibit.add(bolt);
      }
      exhibit.rotation.y = -0.25;
    }
    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(4, 64),
      new THREE.MeshStandardMaterial({ color: 0x20271d, roughness: 0.95 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.5;
    scene.add(floor);
    actions.current = {
      reset: () => {
        camera.position.set(4, 2.5, 5);
        controls.target.set(0, 0.2, 0);
        controls.update();
      },
      zoom: (d) => {
        camera.position.multiplyScalar(d > 0 ? 0.85 : 1.15);
        controls.update();
      },
      orbit: (d) => {
        const offset = camera.position.clone().sub(controls.target);
        offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), d * 0.25);
        camera.position.copy(controls.target.clone().add(offset));
        controls.update();
      },
    };
    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    resize();
    let visible = true;
    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    visibility.observe(host);
    let frame = 0;
    const loop = () => {
      frame = requestAnimationFrame(loop);
      if (!visible || document.hidden) return;
      controls.autoRotate = auto.current;
      controls.autoRotateSpeed = 0.8;
      controls.update();
      renderer.render(scene, camera);
    };
    loop();
    const contextLost = (e: Event) => {
      e.preventDefault();
      setError('The graphics context was interrupted. Close and reopen the workshop to retry.');
    };
    renderer.domElement.addEventListener('webglcontextlost', contextLost);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      visibility.disconnect();
      controls.dispose();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => {
            for (const value of Object.values(material)) {
              if (value instanceof THREE.Texture) value.dispose();
            }
            material.dispose();
          });
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
      actions.current = undefined;
    };
  }, [model]);
  return (
    <div className="model-viewer">
      {error ? (
        <div className="viewer-placeholder">
          <p>{error}</p>
        </div>
      ) : (
        <>
          <div ref={container} className="three-canvas" />
          {loading && <p className="viewer-loading">Loading licensed model…</p>}
          <div className="viewer-controls">
            <button
              className="icon-button"
              onClick={() => actions.current?.orbit(-1)}
              aria-label="Orbit left"
            >
              <MoveLeft size={16} />
            </button>
            <button
              className="icon-button"
              onClick={() => actions.current?.orbit(1)}
              aria-label="Orbit right"
            >
              <MoveRight size={16} />
            </button>
            <button
              className="icon-button"
              onClick={() => actions.current?.zoom(1)}
              aria-label="Zoom in"
            >
              <ZoomIn size={17} />
            </button>
            <button
              className="icon-button"
              onClick={() => actions.current?.zoom(-1)}
              aria-label="Zoom out"
            >
              <ZoomOut size={17} />
            </button>
            <button
              className="icon-button"
              onClick={() => actions.current?.reset()}
              aria-label="Reset view"
            >
              <RotateCcw size={17} />
            </button>
            <button
              className="icon-button"
              onClick={() => {
                auto.current = !auto.current;
                setRotating(auto.current);
              }}
              aria-label={rotating ? 'Pause rotation' : 'Start auto rotation'}
              aria-pressed={rotating}
            >
              {rotating ? <Pause size={17} /> : <Play size={17} />}
            </button>
          </div>
          <p className="viewer-credit">
            {model
              ? `${model.credit} · ${model.license}`
              : 'Original procedural wheel study · not a vehicle model'}
          </p>
        </>
      )}
    </div>
  );
}
