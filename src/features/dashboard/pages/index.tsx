import type { ReactElement } from 'react'
import { useRef, useState } from 'react'
import { OrbitControls } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'

type RotatingNode = {
  rotation: {
    x: number
    y: number
    z: number
  }
  position?: {
    y: number
  }
}

type ShapeName = 'cube' | 'sphere' | 'torus'

function LightingRig(): ReactElement {
  return (
    <group name="lighting-rig">
      <ambientLight intensity={0.35} />
      <directionalLight castShadow position={[4, 6, 3]} intensity={1.5} />
      <pointLight position={[-3, 2, -2]} intensity={18} color="#38bdf8" />
    </group>
  )
}

function SceneHelpers(): ReactElement {
  return (
    <group name="scene-helpers">
      <gridHelper args={[10, 10, '#52525b', '#27272a']} position={[0, -1.25, 0]} />
      <axesHelper args={[3]} />
    </group>
  )
}

function AnimatedShapes(): ReactElement {
  const groupRef = useRef<RotatingNode | null>(null)
  const cubeRef = useRef<RotatingNode | null>(null)
  const torusRef = useRef<RotatingNode | null>(null)
  const [activeShape, setActiveShape] = useState<ShapeName>('cube')

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.2

    if (cubeRef.current) {
      cubeRef.current.rotation.x += delta * 0.6
      cubeRef.current.rotation.y += delta * 0.9
    }

    if (torusRef.current) {
      torusRef.current.rotation.z += delta * 1.1
      if (torusRef.current.position) {
        torusRef.current.position.y = Math.sin(Date.now() * 0.001) * 0.2
      }
    }
  })

  return (
    <group ref={(group) => (groupRef.current = group)} name="animated-shapes">
      <mesh
        castShadow
        name="standard-material-cube"
        onPointerDown={() => setActiveShape('cube')}
        position={[-2.1, 0, 0]}
        ref={(mesh) => (cubeRef.current = mesh)}
      >
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        <meshStandardMaterial
          color={activeShape === 'cube' ? '#22c55e' : '#166534'}
          metalness={0.15}
          name="cube-material"
          roughness={0.3}
        />
      </mesh>

      <mesh
        castShadow
        name="physical-material-sphere"
        onPointerDown={() => setActiveShape('sphere')}
        position={[0, 0, 0]}
      >
        <sphereGeometry args={[0.8, 48, 32]} />
        <meshPhysicalMaterial
          clearcoat={0.8}
          color={activeShape === 'sphere' ? '#f97316' : '#c2410c'}
          metalness={0.05}
          name="sphere-material"
          roughness={0.18}
        />
      </mesh>

      <mesh
        castShadow
        name="wireframe-torus"
        onPointerDown={() => setActiveShape('torus')}
        position={[2.1, 0, 0]}
        ref={(mesh) => (torusRef.current = mesh)}
        scale={1.1}
      >
        <torusKnotGeometry args={[0.55, 0.18, 128, 16]} />
        <meshBasicMaterial color={activeShape === 'torus' ? '#38bdf8' : '#2563eb'} wireframe />
      </mesh>
    </group>
  )
}

function ShadowPlane(): ReactElement {
  return (
    <mesh name="shadow-plane" receiveShadow position={[0, -1.25, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[10, 10]} />
      <meshStandardMaterial color="#18181b" roughness={0.85} />
    </mesh>
  )
}

export function DashboardPage(): ReactElement {
  return (
    <div className="h-screen w-screen bg-zinc-950">
      <Canvas camera={{ position: [4.5, 2.8, 6], fov: 45 }} shadows>
        <color attach="background" args={['#09090b']} />
        <fog attach="fog" args={['#09090b', 6, 14]} />
        <LightingRig />
        <AnimatedShapes />
        <ShadowPlane />
        <SceneHelpers />
        <OrbitControls enableDamping makeDefault />
      </Canvas>
    </div>
  )
}
