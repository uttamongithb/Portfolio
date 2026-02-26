/**
 * Layout1.tsx — Light Gallery Hero (Option A: Floating Geometric Portrait)
 * Implements a sophisticated, light-themed 3D gallery space featuring an
 * abstract faceted bust, orbiting pearl-white geometries, and floating dust motes.
 */
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import * as THREE from 'three'



// ─── Layout 1 Entry (Minimalist Text Only) ───────────────────────────────────
export default function Layout1({
    progressRef,
}: {
    progressRef: React.MutableRefObject<number>
    _mouseRef?: React.MutableRefObject<{ x: number; y: number }>
}) {
    const groupRef = useRef<THREE.Group>(null!)

    // Fade out as user scrolls to layout 2
    useFrame(() => {
        if (!groupRef.current) return
        const p = progressRef.current
        const vis = THREE.MathUtils.clamp(1 - (p - 0.3) / 0.15, 0, 1)
        groupRef.current.visible = vis > 0.01
        groupRef.current.scale.setScalar(0.95 + vis * 0.05)
    })

    return (
        <group ref={groupRef}>
            {/* Minimal clean ambient light for flat look */}
            <ambientLight intensity={1.0} color="#F8F5F0" />
            <Environment preset="city" />
        </group>
    )
}
