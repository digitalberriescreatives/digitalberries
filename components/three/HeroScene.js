'use client';
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, Stars } from '@react-three/drei';
import * as THREE from 'three';

function Football() {
  const group = useRef();
  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.45;
      group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
      group.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.2;
    }
  });
  return (
    <group ref={group}>
      {/* Core sphere - deep black with strong emissive */}
      <mesh castShadow>
        <icosahedronGeometry args={[1.6, 4]} />
        <meshStandardMaterial
          color="#0a0a12"
          roughness={0.25}
          metalness={0.85}
          emissive="#065f46"
          emissiveIntensity={0.6}
        />
      </mesh>
      {/* Bright wireframe overlay */}
      <mesh scale={1.008}>
        <icosahedronGeometry args={[1.6, 2]} />
        <meshBasicMaterial color="#34d399" wireframe transparent opacity={0.85} />
      </mesh>
      {/* Inner glow shell */}
      <mesh scale={1.06}>
        <sphereGeometry args={[1.6, 48, 48]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.12} />
      </mesh>
      {/* Outer soft halo */}
      <mesh scale={1.35}>
        <sphereGeometry args={[1.6, 32, 32]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.05} />
      </mesh>
      {/* Halo rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.2, 0.02, 16, 128]} />
        <meshBasicMaterial color="#6ee7b7" transparent opacity={0.8} />
      </mesh>
      <mesh rotation={[Math.PI / 2, Math.PI / 4, 0]}>
        <torusGeometry args={[2.5, 0.01, 16, 128]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

function Trophy() {
  const t = useRef();
  useFrame((state, delta) => {
    if (t.current) {
      t.current.rotation.y += delta * 0.8;
      t.current.position.y = 2.6 + Math.sin(state.clock.elapsedTime * 1.2) * 0.15;
    }
  });
  return (
    <group ref={t} position={[3.2, 2.6, -0.5]} scale={0.7}>
      <mesh position={[0, -0.9, 0]}>
        <cylinderGeometry args={[0.6, 0.7, 0.22, 32]} />
        <meshStandardMaterial color="#78350f" metalness={0.95} roughness={0.15} emissive="#f59e0b" emissiveIntensity={0.15} />
      </mesh>
      <mesh position={[0, -0.68, 0]}>
        <cylinderGeometry args={[0.44, 0.6, 0.22, 32]} />
        <meshStandardMaterial color="#b45309" metalness={0.95} roughness={0.1} emissive="#f59e0b" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.2, 0.32, 0.75, 32]} />
        <meshStandardMaterial color="#fbbf24" metalness={1} roughness={0.05} emissive="#f59e0b" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[0, 0.62, 0]}>
        <sphereGeometry args={[0.46, 32, 32]} />
        <meshStandardMaterial color="#fde047" metalness={1} roughness={0.05} emissive="#f59e0b" emissiveIntensity={1.1} />
      </mesh>
      <pointLight position={[0, 0.5, 0]} intensity={2.5} color="#fbbf24" distance={4} />
      <Sparkles count={60} scale={3} size={5} speed={0.8} color="#fde047" />
    </group>
  );
}

function Confetti() {
  const count = 260;
  const mesh = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colors = useMemo(() => ['#10b981', '#f59e0b', '#22d3ee', '#e11d48', '#a78bfa', '#fde047'], []);
  const data = useMemo(() =>
    new Array(count).fill(0).map((_, i) => ({
      x: (Math.random() - 0.5) * 22,
      y: Math.random() * 12 + 3,
      z: (Math.random() - 0.5) * 14,
      speed: 0.4 + Math.random() * 1.4,
      rot: Math.random() * Math.PI,
      color: new THREE.Color(colors[i % colors.length]),
    })), [colors]);
  useFrame((state) => {
    if (!mesh.current) return;
    data.forEach((d, i) => {
      d.y -= d.speed * 0.02;
      if (d.y < -4) d.y = 10 + Math.random() * 4;
      dummy.position.set(d.x, d.y, d.z);
      dummy.rotation.set(d.rot + state.clock.elapsedTime * d.speed, d.rot * 0.6, d.rot);
      dummy.scale.setScalar(0.08);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
      mesh.current.setColorAt(i, d.color);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true;
  });
  return (
    <instancedMesh ref={mesh} args={[null, null, count]}>
      <boxGeometry args={[1, 0.5, 0.05]} />
      <meshStandardMaterial vertexColors={false} emissiveIntensity={0.6} transparent opacity={0.9} />
    </instancedMesh>
  );
}

function Field() {
  return (
    <group position={[0, -2.4, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[50, 50, 1, 1]} />
        <meshStandardMaterial color="#052e1a" metalness={0} roughness={1} emissive="#022c22" emissiveIntensity={0.5} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <ringGeometry args={[1.9, 1.96, 128]} />
        <meshBasicMaterial color="#34d399" transparent opacity={0.7} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <ringGeometry args={[0.16, 0.2, 32]} />
        <meshBasicMaterial color="#34d399" transparent opacity={0.9} />
      </mesh>
    </group>
  );
}

function MouseParallax() {
  useFrame((state) => {
    const { pointer, camera } = state;
    camera.position.x += (pointer.x * 1.4 - camera.position.x) * 0.04;
    camera.position.y += (-pointer.y * 0.7 + 0.4 - camera.position.y) * 0.04;
    camera.lookAt(0, 0.1, 0);
  });
  return null;
}

export default function HeroScene() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0.4, 6.5], fov: 45 }}
    >
      <color attach="background" args={['#04040a']} />
      <fog attach="fog" args={['#04040a', 10, 25]} />

      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 5]} intensity={2} color="#a7f3d0" />
      <pointLight position={[-4, 2, -3]} intensity={3} color="#10b981" distance={20} />
      <pointLight position={[4, -2, 3]} intensity={3} color="#f59e0b" distance={20} />
      <pointLight position={[0, 4, 2]} intensity={2} color="#22d3ee" distance={18} />
      <spotLight position={[0, 8, 4]} angle={0.5} penumbra={1} intensity={2.5} color="#ffffff" />

      <Stars radius={90} depth={60} count={3200} factor={4} saturation={0} fade speed={0.6} />
      <Sparkles count={180} scale={14} size={3} speed={0.35} color="#a7f3d0" opacity={1} />

      <Float speed={1.2} rotationIntensity={0.5} floatIntensity={0.7}>
        <Football />
      </Float>

      <Trophy />
      <Confetti />
      <Field />
      <MouseParallax />
    </Canvas>
  );
}
