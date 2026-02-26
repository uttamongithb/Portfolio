/**
 * HeroScene.tsx — Multi-layout canvas orchestrator (v2)
 *
 * Passes both progressRef and mouseRef to each layout.
 * Camera lerps between three positions based on scroll progress.
 * Scene background cross-fades from warm ivory to charcoal.
 */
import { Suspense, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import Layout1 from './Layout1'
import Layout2 from './Layout2'
import Layout3 from './Layout3'

// ─── Camera positions ─────────────────────────────────────────────────────────
const CAM_POS: [number, number, number][] = [
    [0, -0.5, 14],   // Layout 1 — cosmic night, slight upward gaze
    [0, 0.5, 10],    // Layout 2 — camera moves CLOSER from L1 (zoom-in entry, same as L3)
    [0, 0.5, 9],    // Layout 3 — closer for carousel
]

const BG_COLORS = [
    new THREE.Color('#F8F5F0'),   // very light warm grey/beige — Layout 1
    new THREE.Color('#14141E'),   // deep dark blue-black — Layout 2
    new THREE.Color('#1A1A1A'),   // charcoal — Layout 3
]

// ─── Inner scene controller ───────────────────────────────────────────────────
function SceneController({
    progressRef,
}: {
    progressRef: React.MutableRefObject<number>
}) {
    const { camera, scene } = useThree()
    const camTarget = useRef(new THREE.Vector3(...CAM_POS[0]))
    const bgCurrent = useRef(BG_COLORS[0].clone())

    useFrame(() => {
        const p = progressRef.current

        // t12: 0 at Layout1, 1 at Layout2 (transition around p=0.38–0.55)
        const t12 = THREE.MathUtils.clamp((p - 0.38) / 0.18, 0, 1)
        // t23: 0 at Layout2, 1 at Layout3 (transition around p=0.72–0.88)
        const t23 = THREE.MathUtils.clamp((p - 0.72) / 0.18, 0, 1)

        // Camera position: blend L1→L2→L3
        const c1 = new THREE.Vector3(...CAM_POS[0])
        const c2 = new THREE.Vector3(...CAM_POS[1])
        const c3 = new THREE.Vector3(...CAM_POS[2])
        camTarget.current.copy(c1.lerp(c2, t12).lerp(c3, t23))
        camera.position.lerp(camTarget.current, 0.05)
        camera.lookAt(0, 0, 0)

        // Background colour
        const bg12 = BG_COLORS[0].clone().lerp(BG_COLORS[1], t12)
        bg12.lerp(BG_COLORS[2], t23)
        bgCurrent.current.lerp(bg12, 0.04)

        if (scene.background instanceof THREE.Color) {
            scene.background.copy(bgCurrent.current)
        }
    })

    return null
}

// ─── HeroScene ────────────────────────────────────────────────────────────────
interface HeroSceneProps {
    progressRef: React.MutableRefObject<number>
    mouseRef: React.MutableRefObject<{ x: number; y: number }>
}

export default function HeroScene({ progressRef, mouseRef }: HeroSceneProps) {
    return (
        <Canvas
            camera={{ position: CAM_POS[0], fov: 44, near: 0.1, far: 250 }}
            dpr={[1, Math.min(window.devicePixelRatio, 2)]}
            gl={{ antialias: true, powerPreference: 'high-performance' }}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
            onCreated={({ scene }) => {
                scene.background = BG_COLORS[0].clone()
            }}
        >
            {/* Global lights (always on) */}
            <ambientLight intensity={0.55} color="#FFF8F0" />
            <directionalLight position={[5, 6, 8]} intensity={3.0} color="#FFE8D0" castShadow />
            <directionalLight position={[-4, 2, -4]} intensity={0.9} color="#A0B8D8" />
            <SceneController progressRef={progressRef} />

            <Suspense fallback={null}>
                <Layout1 progressRef={progressRef} _mouseRef={mouseRef} />
                <Layout2 progressRef={progressRef} mouseRef={mouseRef} />
                <Layout3 progressRef={progressRef} mouseRef={mouseRef} />
            </Suspense>
        </Canvas>
    )
}
