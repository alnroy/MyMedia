import { Canvas } from '@react-three/fiber';
import { Stars, Float, OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';

function FloatingShapes() {
  return (
    <>
      {/* Animated floating spheres */}
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <mesh position={[-4, 2, -5]}>
          <sphereGeometry args={[0.8, 32, 32]} />
          <meshStandardMaterial
            color="#7f5af0"
            transparent
            opacity={0.4}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
      </Float>

      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1.5}>
        <mesh position={[5, -2, -8]}>
          <sphereGeometry args={[1.2, 32, 32]} />
          <meshStandardMaterial
            color="#00c4ff"
            transparent
            opacity={0.3}
            roughness={0.3}
            metalness={0.7}
          />
        </mesh>
      </Float>

      <Float speed={1.8} rotationIntensity={0.8} floatIntensity={2.5}>
        <mesh position={[2, 3, -6]}>
          <sphereGeometry args={[0.6, 32, 32]} />
          <meshStandardMaterial
            color="#ff6bcb"
            transparent
            opacity={0.35}
            roughness={0.25}
            metalness={0.75}
          />
        </mesh>
      </Float>
    </>
  );
}

export default function ThreeBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <Suspense fallback={null}>
          {/* Soft ambient lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={0.5} color="#7f5af0" />
          <pointLight position={[-10, -10, -5]} intensity={0.3} color="#00c4ff" />

          {/* Starfield background */}
          <Stars
            radius={100}
            depth={50}
            count={3000}
            factor={4}
            saturation={0}
            fade
            speed={0.5}
          />

          {/* Floating 3D shapes */}
          <FloatingShapes />

          {/* Gentle orbit controls */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.3}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
