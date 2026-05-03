"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Stars, Environment } from "@react-three/drei";
import * as THREE from "three";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);
  return reduced;
}

/* -------------------------------------------------------------
   Islamic 8-point star (Rub el Hizb) — extruded as 3D geometry.
   Drawn from polar coords: alternating outer/inner radii.
------------------------------------------------------------- */
function IslamicStarGeometry({
  outer = 1.4,
  inner = 0.78,
  depth = 0.25,
  bevel = 0.06,
}: {
  outer?: number;
  inner?: number;
  depth?: number;
  bevel?: number;
}) {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    const points = 8;
    for (let i = 0; i < points * 2; i++) {
      const r = i % 2 === 0 ? outer : inner;
      const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      if (i === 0) s.moveTo(x, y);
      else s.lineTo(x, y);
    }
    s.closePath();
    return s;
  }, [outer, inner]);

  const geom = useMemo(() => {
    const g = new THREE.ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: true,
      bevelThickness: bevel,
      bevelSize: bevel,
      bevelSegments: 6,
      curveSegments: 24,
    });
    g.center();
    return g;
  }, [shape, depth, bevel]);

  return <primitive object={geom} attach="geometry" />;
}

function CenterStar({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (!ref.current || reduced) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.z = t * 0.18;
    ref.current.rotation.x = Math.sin(t * 0.4) * 0.08;
    ref.current.rotation.y = Math.cos(t * 0.3) * 0.12;
  });
  return (
    <Float
      speed={reduced ? 0 : 1.2}
      rotationIntensity={reduced ? 0 : 0.2}
      floatIntensity={reduced ? 0 : 0.6}
    >
      {/* Polished gold star — meshPhysicalMaterial gives reliable premium sheen */}
      <mesh ref={ref} castShadow receiveShadow>
        <IslamicStarGeometry />
        <meshPhysicalMaterial
          color={"#f59e0b"} /* amber-500 */
          emissive={"#fbbf24"} /* amber-400 */
          emissiveIntensity={0.35}
          metalness={1}
          roughness={0.18}
          clearcoat={1}
          clearcoatRoughness={0.08}
          reflectivity={0.9}
          envMapIntensity={1.4}
        />
      </mesh>
      {/* Subtle emerald inner halo behind the star */}
      <mesh position={[0, 0, -0.35]} scale={1.05}>
        <IslamicStarGeometry outer={1.42} inner={0.8} depth={0.05} bevel={0.02} />
        <meshBasicMaterial color={"#10b981"} transparent opacity={0.18} />
      </mesh>
    </Float>
  );
}

function OrbitRing({
  radius,
  speed,
  count = 8,
  size = 0.05,
  color = "#fbbf24",
  reduced = false,
}: {
  radius: number;
  speed: number;
  count?: number;
  size?: number;
  color?: string;
  reduced?: boolean;
}) {
  const ref = useRef<THREE.Group>(null!);
  useFrame((state) => {
    if (!ref.current || reduced) return;
    ref.current.rotation.z = state.clock.elapsedTime * speed;
  });
  const dots = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => {
        const a = (i / count) * Math.PI * 2;
        return [Math.cos(a) * radius, Math.sin(a) * radius, 0] as const;
      }),
    [count, radius]
  );
  return (
    <group ref={ref}>
      {dots.map((p, i) => (
        <mesh key={i} position={p as unknown as [number, number, number]}>
          <sphereGeometry args={[size, 16, 16]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={1.6}
            metalness={0.7}
            roughness={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}

function MinaretRing() {
  /* Decorative emerald arches drawn as torus segments */
  return (
    <group>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.2]}>
        <torusGeometry args={[2.4, 0.012, 12, 128]} />
        <meshStandardMaterial
          color={"#10b981"}
          emissive={"#10b981"}
          emissiveIntensity={0.6}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.2]}>
        <torusGeometry args={[2.7, 0.006, 12, 128]} />
        <meshStandardMaterial
          color={"#34d399"}
          emissive={"#34d399"}
          emissiveIntensity={0.4}
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>
    </group>
  );
}

function ParticleField({ count = 380, reduced = false }: { count?: number; reduced?: boolean }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 4 + Math.random() * 6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6;
      arr[i * 3 + 2] = r * Math.cos(phi) - 2;
    }
    return arr;
  }, [count]);

  const ref = useRef<THREE.Points>(null!);
  useFrame((state) => {
    if (!ref.current || reduced) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.02;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        sizeAttenuation
        color={"#fde68a"} /* amber-200 */
        transparent
        opacity={0.7}
        depthWrite={false}
      />
    </points>
  );
}

function ParallaxRig({ reduced }: { reduced: boolean }) {
  const { camera, mouse } = useThree();
  useFrame(() => {
    if (reduced) return;
    camera.position.x += (mouse.x * 0.6 - camera.position.x) * 0.05;
    camera.position.y += (mouse.y * 0.4 + 0.2 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function HeroCanvas() {
  const reduced = usePrefersReducedMotion();
  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ position: [0, 0.2, 4.6], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop={reduced ? "demand" : "always"}
    >
      <ambientLight intensity={0.55} color={"#a7f3d0"} />
      <directionalLight position={[3, 4, 5]} intensity={1.6} color={"#fde68a"} castShadow />
      <pointLight position={[-3, -2, 2]} intensity={1.2} color={"#10b981"} />
      <pointLight position={[0, 0, 3]} intensity={1.0} color={"#fbbf24"} />

      <Suspense fallback={null}>
        <Environment preset="sunset" />
        <CenterStar reduced={reduced} />
        <MinaretRing />
        <OrbitRing radius={2.0} speed={0.25} count={8} size={0.045} color={"#fbbf24"} reduced={reduced} />
        <OrbitRing radius={2.7} speed={-0.15} count={12} size={0.025} color={"#fde68a"} reduced={reduced} />
        <ParticleField count={420} reduced={reduced} />
        <Stars radius={20} depth={30} count={1200} factor={2.4} saturation={0} fade speed={reduced ? 0 : 0.4} />
      </Suspense>

      <ParallaxRig reduced={reduced} />
    </Canvas>
  );
}
