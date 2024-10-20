import React from 'react'
import { useLoader } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export function Frame({ imgLink,rotation, ...props }) {
  const { nodes, materials } = useGLTF('./models/items/frame.glb')

  // Load the image texture using the passed imgLink prop
  const texture = useLoader(THREE.TextureLoader, imgLink)

  return (
    <group {...props} dispose={null} rotation-y={((rotation || 0) * Math.PI) / 2}>
      <group
        position={[0.003, 1.886, 0.064]}
        rotation={[Math.PI / 2, 0, -Math.PI / 2]}
        scale={0.855}>
        {/* Use the image texture as the material */}
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Plane002.geometry}
          position={[0.2, 0, 0.4]}
          rotation={[Math.PI , 0, Math.PI ]}
          >
          <meshStandardMaterial map={texture} />
        </mesh>

        {/* Keep the frame material unchanged */}
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Plane002_1.geometry}
          material={materials.frame}
        />
      </group>
    </group>
  )
}

// Preload the GLTF model
useGLTF.preload('./models/items/frame.glb')
