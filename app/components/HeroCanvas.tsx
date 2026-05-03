"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars, Environment } from "@react-three/drei";
import { EffectComposer, Bloom, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";

/* Pause render loop when hero scrolls out of viewport.
   Saves significant GPU/battery — Three.js otherwise renders
   60fps even when invisible. Returns "always" / "demand". */
function useFrameloopForVisibility(): "always" | "demand" {
  const [mode, setMode] = useState<"always" | "demand">("always");
  useEffect(() => {
    const target = document.querySelector("section");
    if (!target) return;
    const obs = new IntersectionObserver(
      ([entry]) => setMode(entry.isIntersecting ? "always" : "demand"),
      { threshold: 0.01 }
    );
    obs.observe(target);
    return () => obs.disconnect();
  }, []);
  return mode;
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

/* Mouse-following highlight — a small amber point light tracks the cursor
   in screen space, giving the gold star real-time specular highlights
   (the way polished metal catches light as you tilt it). */
function MouseHighlight({ reduced }: { reduced: boolean }) {
  const lightRef = useRef<THREE.PointLight>(null!);
  const { mouse, viewport } = useThree();
  const target = useMemo(() => new THREE.Vector3(0, 0, 1.5), []);
  useFrame(() => {
    if (!lightRef.current || reduced) return;
    target.x = mouse.x * viewport.width * 0.6;
    target.y = mouse.y * viewport.height * 0.6;
    target.z = 1.5;
    // Smooth lerp toward cursor
    lightRef.current.position.lerp(target, 0.12);
  });
  return (
    <pointLight
      ref={lightRef}
      color={"#fde68a"} /* amber-200 — warm highlight */
      intensity={2.2}
      distance={6}
      decay={2}
    />
  );
}

export default function HeroCanvas() {
  const reduced = !!useReducedMotion();
  const visibilityFrameloop = useFrameloopForVisibility();
  // Reduced-motion users always render on demand (one frame, no animation)
  const frameloop = reduced ? "demand" : visibilityFrameloop;

  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ position: [0, 0.2, 4.6], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop={frameloop}
    >
      <ambientLight intensity={0.55} color={"#a7f3d0"} />
      <directionalLight position={[3, 4, 5]} intensity={1.6} color={"#fde68a"} castShadow />
      <pointLight position={[-3, -2, 2]} intensity={1.2} color={"#10b981"} />
      <pointLight position={[0, 0, 3]} intensity={1.0} color={"#fbbf24"} />
      <MouseHighlight reduced={reduced} />

      <Suspense fallback={null}>
        <Environment preset="sunset" />
        <MinaretRing />
        <OrbitRing radius={2.0} speed={0.25} count={8} size={0.045} color={"#fbbf24"} reduced={reduced} />
        <OrbitRing radius={2.7} speed={-0.15} count={12} size={0.025} color={"#fde68a"} reduced={reduced} />
        <ParticleField count={420} reduced={reduced} />
        <Stars radius={20} depth={30} count={1200} factor={2.4} saturation={0} fade speed={reduced ? 0 : 0.4} />

        {/* Premium post-processing — bloom on emissive surfaces (gold star,
            orbit dots, particles) gives true luminous glow; subtle chromatic
            aberration adds a luxe optical edge. Disabled for reduced-motion. */}
        {!reduced && (
          <EffectComposer multisampling={0} enableNormalPass={false}>
            <Bloom
              intensity={0.85}
              luminanceThreshold={0.35}
              luminanceSmoothing={0.6}
              mipmapBlur
              radius={0.7}
            />
            <ChromaticAberration
              blendFunction={BlendFunction.NORMAL}
              offset={[0.0008, 0.0008]}
              radialModulation={false}
              modulationOffset={0}
            />
          </EffectComposer>
        )}
      </Suspense>

      <ParallaxRig reduced={reduced} />
    </Canvas>
  );
}
