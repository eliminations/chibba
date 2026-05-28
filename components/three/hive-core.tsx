"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Icosahedron, Line } from "@react-three/drei";
import * as THREE from "three";
import { lerp } from "@/lib/utils";

const AMBER = new THREE.Color("#F5B841");
const HIVE = new THREE.Color("#FFD54A");
const TOXIC = new THREE.Color("#B8FF5A");
const NEON = new THREE.Color("#FF8A00");

/** Swarm of glowing particles orbiting the hive core. */
function Swarm({ count = 480 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Distribute on a fuzzy sphere shell
      const r = 1.9 + Math.random() * 1.6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      const c = Math.random() > 0.85 ? TOXIC : Math.random() > 0.5 ? HIVE : AMBER;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return { positions, colors };
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = t * 0.08;
    ref.current.rotation.x = Math.sin(t * 0.12) * 0.18;
    const mat = ref.current.material as THREE.PointsMaterial;
    mat.size = 0.045 + Math.sin(t * 2) * 0.012;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        vertexColors
        size={0.05}
        transparent
        opacity={0.9}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

/** Hexagonal ring drawn from line segments. */
function HexRing({
  radius,
  tilt,
  color,
  speed,
}: {
  radius: number;
  tilt: [number, number, number];
  color: string;
  speed: number;
}) {
  const ref = useRef<THREE.Group>(null);
  const points = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i <= 6; i++) {
      const a = (Math.PI / 3) * i;
      pts.push([radius * Math.cos(a), radius * Math.sin(a), 0]);
    }
    return pts;
  }, [radius]);

  useFrame((state) => {
    if (ref.current) ref.current.rotation.z = state.clock.elapsedTime * speed;
  });

  return (
    <group ref={ref} rotation={tilt}>
      <Line points={points} color={color} lineWidth={1.4} transparent opacity={0.6} />
    </group>
  );
}

function Core() {
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();
  const target = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // Pointer mapped to viewport
    target.current.x = (state.pointer.x * viewport.width) / 16;
    target.current.y = (state.pointer.y * viewport.height) / 16;

    if (group.current) {
      group.current.rotation.y = lerp(
        group.current.rotation.y,
        target.current.x + t * 0.05,
        0.05,
      );
      group.current.rotation.x = lerp(
        group.current.rotation.x,
        -target.current.y * 0.6,
        0.05,
      );
    }
    if (inner.current) {
      const s = 0.78 + Math.sin(t * 1.6) * 0.05;
      inner.current.scale.setScalar(s);
      const mat = inner.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.95 + Math.sin(t * 2.2) * 0.4;
    }
  });

  return (
    <group ref={group}>
      {/* Outer wireframe hive shell */}
      <Icosahedron args={[2.1, 1]}>
        <meshBasicMaterial
          color={AMBER}
          wireframe
          transparent
          opacity={0.28}
        />
      </Icosahedron>

      {/* Mid detail shell */}
      <Icosahedron args={[1.6, 1]}>
        <meshBasicMaterial color={HIVE} wireframe transparent opacity={0.4} />
      </Icosahedron>

      {/* Glowing energy core */}
      <Icosahedron ref={inner} args={[0.8, 2]}>
        <meshStandardMaterial
          color="#FFA62B"
          emissive={NEON}
          emissiveIntensity={0.95}
          roughness={0.35}
          metalness={0.5}
        />
      </Icosahedron>

      <HexRing radius={2.6} tilt={[1.2, 0.3, 0]} color="#F5B841" speed={0.18} />
      <HexRing radius={3.0} tilt={[0.4, 1.1, 0.2]} color="#FF8A00" speed={-0.12} />
      <HexRing radius={2.3} tilt={[-0.8, 0.6, 0.5]} color="#B8FF5A" speed={0.22} />

      <Swarm />
    </group>
  );
}

export default function HiveCore({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.35} />
        <pointLight position={[5, 5, 5]} intensity={1.5} color="#FFD54A" />
        <pointLight position={[-6, -3, 2]} intensity={1.0} color="#FF8A00" />
        <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.8}>
          <Core />
        </Float>
      </Canvas>
    </div>
  );
}
