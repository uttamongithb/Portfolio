/**
 * Layout3.tsx — Project Showcase / Card Carousel
 *
 * Floating project cards with:
 *   • Real project screenshot image in the top half of each card
 *   • Project title, short description, and tech tags in the bottom half
 *   • Canvas texture renders the full card face (image + text)
 *   • Taller cards (CARD_H = 1.8) to fit image + description
 *   • lookAt + rotateY(PI) → front face outward (camera-facing)
 */
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ─── Real project data from Portfolio ─────────────────────────────────────────
const PROJECTS = [
    {
        name: 'ShopNow E-commerce (MERN)',
        desc: 'Full-stack MERN e-commerce with secure payments, admin dashboard, and order tracking.',
        tech: 'React · Node.js · MongoDB · Stripe',
        color: '#E07A5F',
        bg: '#2A1410',
        image: '/shopnow.png',
    },
    {
        name: 'ShopNow E-commerce UI',
        desc: 'React + Tailwind storefront with search, product detail, cart, and order flows.',
        tech: 'React · Tailwind · Vite · Router',
        color: '#C9A87C',
        bg: '#1E1810',
        image: '/shopnow-ui.png',
    },
    {
        name: 'Realtime Chat Site',
        desc: 'Express + Socket.IO chat with login/signup and 1-to-1 realtime messaging.',
        tech: 'Express · Socket.IO · Node.js',
        color: '#81A594',
        bg: '#10201C',
        image: '/realtime-chat.png',
    },
    {
        name: 'Payroll Management System',
        desc: 'Role-based MERN payroll system with JWT auth, leave approvals, and analytics dashboards.',
        tech: 'React · TypeScript · Express · MongoDB',
        color: '#81A594',
        bg: '#10201C',
        image: '/payroll-dashboard.png',
    },
    {
        name: 'ShopHub E-commerce Store',
        desc: 'Production-ready MERN store with Stripe, admin panel, customer reviews, and JWT auth.',
        tech: 'React · Express · MongoDB · Stripe',
        color: '#7B8DC4',
        bg: '#10142A',
        image: '/shophub-store.png',
    },
    {
        name: 'Expense Management System',
        desc: 'Enterprise expense platform with OCR receipts, approvals, analytics, and role-based access.',
        tech: 'React · NestJS · Firebase · TypeScript',
        color: '#6FA8DC',
        bg: '#0E1823',
        image: '/expense-management.png',
    },
    {
        name: 'IdeaShare Platform',
        desc: 'MERN platform for sharing ideas with GSAP animations and Socket.IO realtime updates.',
        tech: 'React · Socket.IO · GSAP · MongoDB',
        color: '#B89961',
        bg: '#231A10',
        image: '/ideashare-platform.png',
    },
]

// Card geometry — taller for image + text
const CARD_W = 2.2
const CARD_H = 1.85
const CARD_D = 0.055
const ORBIT_R = 3.7

// ─── Canvas factory — image top half, text bottom half ───────────────────────
function makeCardTexture(
    name: string,
    desc: string,
    tech: string,
    color: string,
    bg: string,
    imgEl: HTMLImageElement | null
): THREE.CanvasTexture {
    const W = 512, H = 426   // maintain card aspect ratio (CARD_W/CARD_H ≈ 1.19)
    const IMG_H = 200         // image occupies top ~47%
    const TEXT_Y = IMG_H + 4  // text area starts after image

    const canvas = document.createElement('canvas')
    canvas.width = W; canvas.height = H
    const ctx = canvas.getContext('2d')!

    // ── Background (text area) ─────────────────────────────────────────────────
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, W, H)

    // ── Project screenshot in top half ────────────────────────────────────────
    if (imgEl && imgEl.complete) {
        // Clip to top area
        ctx.save()
        ctx.beginPath()
        ctx.rect(0, 0, W, IMG_H)
        ctx.clip()
        // Draw image cover-fit into the top area
        const aspect = imgEl.naturalWidth / imgEl.naturalHeight
        let dw = W, dh = W / aspect
        if (dh < IMG_H) { dh = IMG_H; dw = IMG_H * aspect }
        const dx = (W - dw) / 2, dy = (IMG_H - dh) / 2
        ctx.drawImage(imgEl, dx, dy, dw, dh)
        // Darken overlay for readability
        ctx.fillStyle = 'rgba(0,0,0,0.25)'
        ctx.fillRect(0, 0, W, IMG_H)
        ctx.restore()
    } else {
        // Fallback: solid color placeholder
        ctx.fillStyle = color + '44'
        ctx.fillRect(0, 0, W, IMG_H)
        ctx.fillStyle = color + '99'
        ctx.font = 'bold 28px Inter, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(name, W / 2, IMG_H / 2 + 8)
        ctx.textAlign = 'left'
    }

    // ── Divider between image and text ────────────────────────────────────────
    ctx.fillStyle = color
    ctx.fillRect(0, IMG_H, W, 3)

    // ── Radial glow in text area ───────────────────────────────────────────────
    const glow = ctx.createRadialGradient(W * 0.5, TEXT_Y + 80, 0, W * 0.5, TEXT_Y + 80, W * 0.55)
    glow.addColorStop(0, color + '14')
    glow.addColorStop(1, 'transparent')
    ctx.fillStyle = glow
    ctx.fillRect(0, TEXT_Y, W, H - TEXT_Y)

    // ── Project name ──────────────────────────────────────────────────────────
    ctx.fillStyle = '#FAF7F2'
    ctx.font = '600 28px "Cormorant Garamond", serif'
    ctx.fillText(name, 24, TEXT_Y + 34)

    // ── Short description (word-wrapped to 2 lines) ────────────────────────────
    ctx.fillStyle = 'rgba(250,247,242,0.75)'
    ctx.font = '400 16px Inter, sans-serif'
    // Simple word-wrap over 2 lines max
    const words = desc.split(' ')
    let line1 = '', line2 = ''
    let building = ''
    let wrappedLine = false
    for (const word of words) {
        const test = building ? building + ' ' + word : word
        if (ctx.measureText(test).width < W - 48) {
            building = test
        } else {
            if (!wrappedLine) { line1 = building; building = word; wrappedLine = true }
            else { line2 = building + (building ? ' ' : '') + word; building = '' }
        }
    }
    if (!wrappedLine) { line1 = building } else if (building) { line2 = building }
    ctx.fillText(line1, 24, TEXT_Y + 62)
    if (line2) ctx.fillText(line2.length > 60 ? line2.substring(0, 57) + '…' : line2, 24, TEXT_Y + 82)

    // ── Tech tags ─────────────────────────────────────────────────────────────
    ctx.fillStyle = color + 'BB'
    ctx.font = '400 15px Inter, sans-serif'
    ctx.fillText(tech, 24, TEXT_Y + 108)

    // ── Corner accent dot ─────────────────────────────────────────────────────
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(W - 24, H - 24, 7, 0, Math.PI * 2)
    ctx.fill()

    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
}

// ─── Single project card ───────────────────────────────────────────────────────
function ProjectCard({ project, angleOffset, orbitRef }: {
    project: typeof PROJECTS[0]
    angleOffset: number
    orbitRef: React.MutableRefObject<number>
}) {
    const ref = useRef<THREE.Group>(null!)
    const phase = useMemo(() => Math.random() * Math.PI * 2, [])

    // Load image and build canvas texture
    const screenMat = useMemo(() => {
        const mat = new THREE.MeshStandardMaterial({
            emissive: new THREE.Color(project.color),
            emissiveIntensity: 0.12,
            roughness: 0.15,
            metalness: 0.05,
        })

        // Load image, then build texture
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.src = project.image
        const buildTex = () => {
            const tex = makeCardTexture(project.name, project.desc, project.tech, project.color, project.bg, img)
            mat.map = tex
            mat.emissiveMap = tex
            mat.needsUpdate = true
        }
        img.onload = buildTex
        img.onerror = () => {
            // Build with null image (fallback)
            const tex = makeCardTexture(project.name, project.desc, project.tech, project.color, project.bg, null)
            mat.map = tex
            mat.emissiveMap = tex
            mat.needsUpdate = true
        }
        // Attempt build immediately if already loaded (cached)
        if (img.complete) buildTex()

        return mat
    }, [project])

    const bodyMat = useMemo(
        () => new THREE.MeshStandardMaterial({ color: '#111', metalness: 0.7, roughness: 0.3 }),
        []
    )

    useFrame(({ clock }) => {
        if (!ref.current) return
        const angle = orbitRef.current + angleOffset
        const x = Math.cos(angle) * ORBIT_R
        const z = Math.sin(angle) * ORBIT_R
        const y = Math.sin(clock.getElapsedTime() * 0.65 + phase) * 0.14
        ref.current.position.set(x, y, z)
        ref.current.lookAt(0, ref.current.position.y, 0)
        ref.current.rotateY(Math.PI)
    })

    return (
        <group ref={ref}>
            {/* Card body */}
            <mesh material={bodyMat} castShadow>
                <boxGeometry args={[CARD_W, CARD_H, CARD_D]} />
            </mesh>
            {/* Screen face — canvas texture (image + text) */}
            <mesh position={[0, 0, CARD_D / 2 + 0.001]} material={screenMat}>
                <planeGeometry args={[CARD_W - 0.04, CARD_H - 0.04]} />
            </mesh>
            {/* Back glow */}
            <mesh position={[0, 0, -CARD_D / 2 - 0.002]}>
                <planeGeometry args={[CARD_W, CARD_H]} />
                <meshBasicMaterial color={project.color} transparent opacity={0.08} side={THREE.BackSide} />
            </mesh>
        </group>
    )
}

// ─── Central pulsing orb ──────────────────────────────────────────────────────
function CenterOrb() {
    const ref = useRef<THREE.Mesh>(null!)
    const mat = useMemo(
        () => new THREE.MeshStandardMaterial({
            color: new THREE.Color('#FFF0D0'),
            emissive: new THREE.Color('#F0A050'),
            emissiveIntensity: 1.2,
            roughness: 0.0,
            metalness: 0.2,
        }),
        []
    )
    useFrame(({ clock }) => {
        const s = 0.85 + 0.20 * Math.sin(clock.getElapsedTime() * 1.2)
        if (ref.current) ref.current.scale.setScalar(s)
    })
    return (
        <>
            <mesh ref={ref} material={mat}><sphereGeometry args={[0.35, 24, 24]} /></mesh>
            <pointLight position={[0, 0, 0]} intensity={6} color="#FFCC80" distance={8} decay={2} />
        </>
    )
}

// ─── Sparse gold dust ─────────────────────────────────────────────────────────
const DUST_N = 35
function GoldDust() {
    const mRef = useRef<THREE.InstancedMesh>(null!)
    const dummy = useMemo(() => new THREE.Object3D(), [])
    const mat = useMemo(() =>
        new THREE.MeshBasicMaterial({ color: '#C9A87C', transparent: true, opacity: 0.35 }), [])
    const d = useMemo(() => {
        const px = new Float32Array(DUST_N), py = new Float32Array(DUST_N)
        const pz = new Float32Array(DUST_N), vy = new Float32Array(DUST_N), sz = new Float32Array(DUST_N)
        for (let i = 0; i < DUST_N; i++) {
            px[i] = (Math.random() - 0.5) * 10; py[i] = (Math.random() - 0.5) * 3
            pz[i] = (Math.random() - 0.5) * 8; vy[i] = Math.random() * 0.004 + 0.001
            sz[i] = Math.random() * 0.022 + 0.006
        }
        return { px, py, pz, vy, sz }
    }, [])
    useFrame(() => {
        if (!mRef.current) return
        for (let i = 0; i < DUST_N; i++) {
            d.py[i] += d.vy[i]; if (d.py[i] > 2.2) d.py[i] = -2.2
            dummy.position.set(d.px[i], d.py[i], d.pz[i])
            dummy.scale.setScalar(d.sz[i]); dummy.updateMatrix()
            mRef.current.setMatrixAt(i, dummy.matrix)
        }
        mRef.current.instanceMatrix.needsUpdate = true
    })
    return (
        <instancedMesh ref={mRef} args={[undefined, undefined, DUST_N]} material={mat}>
            <sphereGeometry args={[1, 4, 4]} />
        </instancedMesh>
    )
}

// ─── Layout 3 ─────────────────────────────────────────────────────────────────
interface L3Props {
    progressRef: React.MutableRefObject<number>
    mouseRef: React.MutableRefObject<{ x: number; y: number }>
}

export default function Layout3({ progressRef, mouseRef }: L3Props) {
    const groupRef = useRef<THREE.Group>(null!)
    const orbitAngle = useRef(0)

    useFrame((_, dt) => {
        if (!groupRef.current) return
        const p = progressRef.current
        const fadeIn = THREE.MathUtils.clamp((p - 0.72) / 0.14, 0, 1)
        groupRef.current.visible = fadeIn > 0.01
        // Scale in from center
        const s = 0.85 + fadeIn * 0.15
        groupRef.current.scale.setScalar(s)
        // Orbit advance
        orbitAngle.current += dt * 0.12
        // Mouse parallax
        groupRef.current.rotation.y +=
            (mouseRef.current.x * 0.08 - groupRef.current.rotation.y) * 0.03
    })

    const angleOffsets = PROJECTS.map((_, i) => (i / PROJECTS.length) * Math.PI * 2)

    return (
        <group ref={groupRef}>
            <ambientLight intensity={0.25} color="#F8D8B0" />
            <directionalLight position={[3, 5, 3]} intensity={2} color="#FFF5E8" castShadow />

            <CenterOrb />
            <GoldDust />

            {PROJECTS.map((proj, i) => (
                <ProjectCard
                    key={i}
                    project={proj}
                    angleOffset={angleOffsets[i]}
                    orbitRef={orbitAngle}
                />
            ))}
        </group>
    )
}
