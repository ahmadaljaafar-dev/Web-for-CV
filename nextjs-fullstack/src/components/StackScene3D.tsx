"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { StackIllustrationStatic } from "./StackIllustrationStatic";

function StackLayers({
  scrollProgress,
  reducedMotion,
}: {
  scrollProgress: number;
  reducedMotion: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const pulseRef = useRef<THREE.Mesh>(null);
  const topLayerRef = useRef<THREE.Group>(null);
  const bottomLayerRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    if (groupRef.current && !reducedMotion) {
      const targetRotY = -0.35 + state.pointer.x * 0.16;
      const targetRotX = 0.28 + state.pointer.y * 0.08;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotY,
        Math.min(1, delta * 3.5)
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotX,
        Math.min(1, delta * 3.5)
      );
    }

    const extraGap = reducedMotion ? 0 : scrollProgress * 0.55;
    if (topLayerRef.current) {
      topLayerRef.current.position.y = THREE.MathUtils.lerp(
        topLayerRef.current.position.y,
        1.25 + extraGap,
        Math.min(1, delta * 5)
      );
    }
    if (bottomLayerRef.current) {
      bottomLayerRef.current.position.y = THREE.MathUtils.lerp(
        bottomLayerRef.current.position.y,
        -1.25 - extraGap,
        Math.min(1, delta * 5)
      );
    }

    if (pulseRef.current && !reducedMotion) {
      // Smooth round-trip light pulse: UI -> API -> Database -> API -> UI
      const span = 1.25 + extraGap;
      const cycle = Math.sin(t * 1.8);
      pulseRef.current.position.y = cycle * span;
      const scale = 1 + 0.25 * Math.abs(Math.cos(t * 3.6));
      pulseRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group ref={groupRef} rotation={[0.28, -0.35, 0]}>
      {/* Central request beam */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 3.2, 16]} />
        <meshBasicMaterial color="#38BDF8" transparent opacity={0.45} />
      </mesh>

      {/* Travelling light pulse */}
      <mesh ref={pulseRef} position={[0, 0, 0]}>
        <sphereGeometry args={[0.13, 24, 24]} />
        <meshStandardMaterial
          color="#60A5FA"
          emissive="#38BDF8"
          emissiveIntensity={2.6}
          roughness={0.1}
        />
      </mesh>

      {/* Layer 1: User Interface */}
      <group ref={topLayerRef} position={[0, 1.25, 0]}>
        <RoundedBox args={[3.2, 0.22, 2.1]} radius={0.08} smoothness={4}>
          <meshStandardMaterial
            color="#181C26"
            metalness={0.45}
            roughness={0.35}
            emissive="#1D4ED8"
            emissiveIntensity={0.22}
          />
        </RoundedBox>
        <Html position={[1.75, 0.05, 0]} center distanceFactor={8}>
          <div className="pointer-events-none whitespace-nowrap rounded border border-electric/40 bg-graphite-900/90 px-2.5 py-1 font-mono text-[11px] text-warm-white shadow-lg">
            <span className="text-electric-glow">01</span> UI
          </div>
        </Html>
      </group>

      {/* Layer 2: API & Automation */}
      <group position={[0, 0, 0]}>
        <RoundedBox args={[3.2, 0.22, 2.1]} radius={0.08} smoothness={4}>
          <meshStandardMaterial
            color="#141925"
            metalness={0.5}
            roughness={0.3}
            emissive="#0284C7"
            emissiveIntensity={0.32}
          />
        </RoundedBox>
        <Html position={[1.75, 0.05, 0]} center distanceFactor={8}>
          <div className="pointer-events-none whitespace-nowrap rounded border border-electric-glow/50 bg-graphite-900/90 px-2.5 py-1 font-mono text-[11px] text-warm-white shadow-lg">
            <span className="text-electric-glow">02</span> API
          </div>
        </Html>
      </group>

      {/* Layer 3: Database */}
      <group ref={bottomLayerRef} position={[0, -1.25, 0]}>
        <RoundedBox args={[3.2, 0.22, 2.1]} radius={0.08} smoothness={4}>
          <meshStandardMaterial
            color="#181C26"
            metalness={0.55}
            roughness={0.35}
            emissive="#2563EB"
            emissiveIntensity={0.24}
          />
        </RoundedBox>
        <Html position={[1.75, 0.05, 0]} center distanceFactor={8}>
          <div className="pointer-events-none whitespace-nowrap rounded border border-electric/40 bg-graphite-900/90 px-2.5 py-1 font-mono text-[11px] text-warm-white shadow-lg">
            <span className="text-electric-glow">03</span> DB
          </div>
        </Html>
      </group>
    </group>
  );
}

export function StackScene3D() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const mqDesktop = window.matchMedia("(min-width: 768px)");
    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => {
      setIsDesktop(mqDesktop.matches);
      setReducedMotion(mqMotion.matches);
    };
    update();

    mqDesktop.addEventListener("change", update);
    mqMotion.addEventListener("change", update);

    const onScroll = () => {
      const ratio = Math.min(1, Math.max(0, window.scrollY / 600));
      setScrollProgress(ratio);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      mqDesktop.removeEventListener("change", update);
      mqMotion.removeEventListener("change", update);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  if (!isDesktop) {
    return <StackIllustrationStatic />;
  }

  return (
    <div
      className="relative h-[420px] w-full overflow-hidden rounded-2xl border border-graphite-700/80 bg-gradient-to-b from-graphite-900 to-graphite-950"
      aria-label="Interactive 3D three-layer stack: User Interface, API, and Database"
    >
      <div className="pointer-events-none absolute left-4 top-4 z-10 flex items-center gap-2 rounded-full border border-graphite-700 bg-graphite-900/85 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-warm-muted">
        <span className="h-2 w-2 rounded-full bg-electric-glow" />
        Request Signal · Live Stack
      </div>
      <Canvas camera={{ position: [0, 0.3, 6.2], fov: 38 }} dpr={[1, 2]}>
        <ambientLight intensity={0.75} />
        <directionalLight position={[5, 6, 5]} intensity={1.4} color="#F4F1EA" />
        <pointLight position={[-4, 1, 3]} intensity={1.6} color="#3B82F6" />
        <StackLayers scrollProgress={scrollProgress} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}
