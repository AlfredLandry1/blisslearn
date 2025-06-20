import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Line, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// Génère des points sur une sphère
function generateSpherePoints(count: number, radius: number) {
  const points = [];
  for (let i = 0; i < count; i++) {
    const phi = Math.acos(1 - 2 * Math.random());
    const theta = 2 * Math.PI * Math.random();
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);
    points.push([x, y, z]);
  }
  return points;
}

function GlobePoints({ count = 2000, radius = 2 }) {
  const points = useMemo(() => generateSpherePoints(count, radius), [count, radius]);
  const flatPoints = useMemo(() => points.flat(), [points]);
  const ref = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.0015;
    }
  });

  return (
    <Points ref={ref} positions={new Float32Array(flatPoints)} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#60a5fa"
        size={0.035}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </Points>
  );
}

function GlobeLines({ points, lines = 400 }: { points: number[][]; lines?: number }) {
  // Génère des lignes entre des points aléatoires
  const linesData = useMemo(() => {
    const arr = [];
    for (let i = 0; i < lines; i++) {
      const a = points[Math.floor(Math.random() * points.length)];
      const b = points[Math.floor(Math.random() * points.length)];
      arr.push([a, b]);
    }
    return arr;
  }, [points, lines]);

  return (
    <>
      {linesData.map((line, i) => (
        <Line
          key={i}
          points={line as [number, number, number][]}
          color="#38bdf8"
          lineWidth={0.5}
          transparent
          opacity={0.25}
        />
      ))}
    </>
  );
}

export const GlobeBackground = ({
  pointCount = 2000,
  lineCount = 400,
  radius = 2,
  style = {},
  className = "",
}: {
  pointCount?: number;
  lineCount?: number;
  radius?: number;
  style?: React.CSSProperties;
  className?: string;
}) => {
  const points = useMemo(() => generateSpherePoints(pointCount, radius), [pointCount, radius]);

  return (
    <div
      className={"absolute inset-0 w-full h-full z-0 pointer-events-none " + className}
      style={{ ...style }}
    >
      <Canvas camera={{ position: [0, 0, 6], fov: 60 }} dpr={[1, 2]}>
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} intensity={1.2} color="#38bdf8" />
        <GlobePoints count={pointCount} radius={radius} />
        <GlobeLines points={points} lines={lineCount} />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.7} />
      </Canvas>
    </div>
  );
}; 