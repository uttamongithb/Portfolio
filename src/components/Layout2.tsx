/**
 * Layout2.tsx — Dynamic Tech Stack
 *
 * Behaviour copied EXACTLY from Layout3:
 *   • Single shared orbitAngle ref → all cards rotate together at same speed
 *   • ORBIT_R = 3.1 (same as Layout3) → all cards equidistant from center
 *   • Evenly spaced: (i / TECHS.length) * PI * 2  (same formula as Layout3)
 *   • Scale: 0.85 + fadeIn * 0.15 (same zoom-in as Layout3)
 *   • orbit speed: dt * 0.12 (same as Layout3)
 *   • Card bob: sin(clock * 0.65 + phase) * 0.14 (same as Layout3)
 *   • lookAt(0, y, 0) + rotateY(PI) → front face outward (same as Layout3)
 *
 * Added on top of Layout3 base: orbital rings + glass core + grid floor.
 */
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ─── Tech data ────────────────────────────────────────────────────────────────
type TechIcon = 'code' | 'server' | 'smartphone' | 'globe' | 'database'
type TechBrand =
    | 'react'
    | 'nextjs'
    | 'tailwind'
    | 'nodejs'
    | 'express'
    | 'mongodb'
    | 'reactnative'
    | 'expo'
    | 'uiux'
    | 'figma'
    | 'postgresql'
    | 'sql'

const TECHS = [
    {
        title: 'Frontend Dev',
        desc: 'React, Next.js, Tailwind',
        icon: 'code' as TechIcon,
        chips: [
            { brand: 'react' as TechBrand, label: 'React' },
            { brand: 'nextjs' as TechBrand, label: 'Next.js' },
            { brand: 'tailwind' as TechBrand, label: 'Tailwind' },
        ],
        color: '#B495FF',
        bg: '#050A18'
    },
    {
        title: 'Backend Dev',
        desc: 'Node.js, Express, MongoDB',
        icon: 'server' as TechIcon,
        chips: [
            { brand: 'nodejs' as TechBrand, label: 'Node.js' },
            { brand: 'express' as TechBrand, label: 'Express' },
            { brand: 'mongodb' as TechBrand, label: 'MongoDB' },
        ],
        color: '#B495FF',
        bg: '#050A18'
    },
    {
        title: 'Mobile App',
        desc: 'React Native, Expo',
        icon: 'smartphone' as TechIcon,
        chips: [
            { brand: 'reactnative' as TechBrand, label: 'React Native' },
            { brand: 'expo' as TechBrand, label: 'Expo' },
        ],
        color: '#B495FF',
        bg: '#050A18'
    },
    {
        title: 'Web Design',
        desc: 'Modern UI/UX',
        icon: 'globe' as TechIcon,
        chips: [
            { brand: 'uiux' as TechBrand, label: 'UI/UX' },
            { brand: 'figma' as TechBrand, label: 'Figma' },
        ],
        color: '#B495FF',
        bg: '#050A18'
    },
    {
        title: 'Database',
        desc: 'MongoDB, PostgreSQL',
        icon: 'database' as TechIcon,
        chips: [
            { brand: 'mongodb' as TechBrand, label: 'MongoDB' },
            { brand: 'postgresql' as TechBrand, label: 'PostgreSQL' },
            { brand: 'sql' as TechBrand, label: 'SQL' },
        ],
        color: '#B495FF',
        bg: '#050A18'
    },
]

// ── Card & orbit constants — identical to Layout3 ─────────────────────────────
const CARD_W = 2.0
const CARD_H = 1.3
const CARD_D = 0.055
const ORBIT_R = 3.1   // same as Layout3

function drawTechIcon(ctx: CanvasRenderingContext2D, icon: TechIcon, cx: number, cy: number, color: string) {
    ctx.strokeStyle = color
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    if (icon === 'code') {
        ctx.beginPath()
        ctx.moveTo(cx - 12, cy - 10)
        ctx.lineTo(cx - 20, cy)
        ctx.lineTo(cx - 12, cy + 10)
        ctx.moveTo(cx + 12, cy - 10)
        ctx.lineTo(cx + 20, cy)
        ctx.lineTo(cx + 12, cy + 10)
        ctx.stroke()
        return
    }

    if (icon === 'server') {
        ctx.strokeRect(cx - 18, cy - 14, 36, 11)
        ctx.strokeRect(cx - 18, cy + 3, 36, 11)
        ctx.beginPath()
        ctx.moveTo(cx - 12, cy - 9)
        ctx.lineTo(cx - 3, cy - 9)
        ctx.moveTo(cx - 12, cy + 8)
        ctx.lineTo(cx - 3, cy + 8)
        ctx.stroke()
        return
    }

    if (icon === 'smartphone') {
        ctx.strokeRect(cx - 10, cy - 16, 20, 32)
        ctx.beginPath()
        ctx.arc(cx, cy + 11, 1.8, 0, Math.PI * 2)
        ctx.stroke()
        return
    }

    if (icon === 'globe') {
        ctx.beginPath()
        ctx.arc(cx, cy, 15, 0, Math.PI * 2)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(cx - 15, cy)
        ctx.lineTo(cx + 15, cy)
        ctx.moveTo(cx, cy - 15)
        ctx.lineTo(cx, cy + 15)
        ctx.moveTo(cx - 9, cy - 12)
        ctx.quadraticCurveTo(cx - 2, cy, cx - 9, cy + 12)
        ctx.moveTo(cx + 9, cy - 12)
        ctx.quadraticCurveTo(cx + 2, cy, cx + 9, cy + 12)
        ctx.stroke()
        return
    }

    ctx.beginPath()
    ctx.ellipse(cx, cy - 10, 14, 6, 0, 0, Math.PI * 2)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(cx - 14, cy - 10)
    ctx.lineTo(cx - 14, cy + 10)
    ctx.moveTo(cx + 14, cy - 10)
    ctx.lineTo(cx + 14, cy + 10)
    ctx.stroke()
    ctx.beginPath()
    ctx.ellipse(cx, cy, 14, 6, 0, 0, Math.PI)
    ctx.stroke()
    ctx.beginPath()
    ctx.ellipse(cx, cy + 10, 14, 6, 0, Math.PI, Math.PI * 2)
    ctx.stroke()
}

function drawBrandIcon(ctx: CanvasRenderingContext2D, brand: TechBrand, cx: number, cy: number, color: string) {
    ctx.save()
    ctx.strokeStyle = color
    ctx.fillStyle = color
    ctx.lineWidth = 1.9
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    if (brand === 'react' || brand === 'reactnative') {
        ctx.beginPath(); ctx.ellipse(cx, cy, 5.6, 2.2, 0, 0, Math.PI * 2); ctx.stroke()
        ctx.beginPath(); ctx.ellipse(cx, cy, 5.6, 2.2, Math.PI / 3, 0, Math.PI * 2); ctx.stroke()
        ctx.beginPath(); ctx.ellipse(cx, cy, 5.6, 2.2, -Math.PI / 3, 0, Math.PI * 2); ctx.stroke()
        ctx.beginPath(); ctx.arc(cx, cy, 1.2, 0, Math.PI * 2); ctx.fill()
        ctx.restore(); return
    }

    if (brand === 'nextjs') {
        ctx.beginPath(); ctx.arc(cx, cy, 6.2, 0, Math.PI * 2); ctx.fillStyle = '#0E111A'; ctx.fill()
        ctx.fillStyle = '#F5F7FF'; ctx.font = '700 8.5px Inter, sans-serif'; ctx.textAlign = 'center'; ctx.fillText('N', cx, cy + 3)
        ctx.restore(); return
    }

    if (brand === 'tailwind') {
        ctx.strokeStyle = '#38BDF8'
        ctx.beginPath(); ctx.moveTo(cx - 6, cy + 1.2); ctx.quadraticCurveTo(cx - 1, cy - 4.5, cx + 4.5, cy - 1.4); ctx.stroke()
        ctx.beginPath(); ctx.moveTo(cx - 4.5, cy + 3.8); ctx.quadraticCurveTo(cx + 0.6, cy - 1.6, cx + 6.5, cy + 1.8); ctx.stroke()
        ctx.restore(); return
    }

    if (brand === 'nodejs') {
        ctx.strokeStyle = '#7FCB52'
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i - Math.PI / 6
            const px = cx + Math.cos(angle) * 6.2
            const py = cy + Math.sin(angle) * 6.2
            if (i === 0) ctx.moveTo(px, py)
            else ctx.lineTo(px, py)
        }
        ctx.closePath(); ctx.stroke()
        ctx.fillStyle = '#7FCB52'; ctx.font = '700 7px Inter, sans-serif'; ctx.textAlign = 'center'; ctx.fillText('N', cx, cy + 2.4)
        ctx.restore(); return
    }

    if (brand === 'express') {
        ctx.strokeStyle = '#F5F7FF'
        ctx.beginPath(); ctx.moveTo(cx - 6, cy - 3); ctx.lineTo(cx + 6, cy - 3); ctx.stroke()
        ctx.beginPath(); ctx.moveTo(cx - 6, cy + 1); ctx.lineTo(cx + 4, cy + 1); ctx.stroke()
        ctx.beginPath(); ctx.moveTo(cx - 4, cy + 5); ctx.lineTo(cx + 6, cy + 5); ctx.stroke()
        ctx.restore(); return
    }

    if (brand === 'mongodb') {
        ctx.fillStyle = '#47A248'
        ctx.beginPath();
        ctx.moveTo(cx, cy - 7); ctx.quadraticCurveTo(cx + 4, cy - 1.5, cx, cy + 7)
        ctx.quadraticCurveTo(cx - 4, cy - 1.5, cx, cy - 7); ctx.fill()
        ctx.restore(); return
    }

    if (brand === 'expo') {
        ctx.strokeStyle = '#F5F7FF'
        ctx.beginPath();
        ctx.moveTo(cx, cy - 6.2); ctx.lineTo(cx + 5.8, cy + 4.5); ctx.lineTo(cx - 5.8, cy + 4.5); ctx.closePath(); ctx.stroke()
        ctx.restore(); return
    }

    if (brand === 'figma') {
        const r = 2.6
        ctx.fillStyle = '#F24E1E'; ctx.beginPath(); ctx.arc(cx - 2.4, cy - 4.3, r, 0, Math.PI * 2); ctx.fill()
        ctx.fillStyle = '#FF7262'; ctx.beginPath(); ctx.arc(cx + 2.4, cy - 4.3, r, 0, Math.PI * 2); ctx.fill()
        ctx.fillStyle = '#A259FF'; ctx.beginPath(); ctx.arc(cx - 2.4, cy, r, 0, Math.PI * 2); ctx.fill()
        ctx.fillStyle = '#1ABCFE'; ctx.beginPath(); ctx.arc(cx + 2.4, cy, r, 0, Math.PI * 2); ctx.fill()
        ctx.fillStyle = '#0ACF83'; ctx.beginPath(); ctx.arc(cx - 2.4, cy + 4.3, r, 0, Math.PI * 2); ctx.fill()
        ctx.restore(); return
    }

    if (brand === 'postgresql') {
        ctx.fillStyle = '#336791'
        ctx.beginPath(); ctx.ellipse(cx, cy, 6.2, 4.6, 0, 0, Math.PI * 2); ctx.fill()
        ctx.fillStyle = '#F5F7FF'; ctx.font = '700 7.2px Inter, sans-serif'; ctx.textAlign = 'center'; ctx.fillText('PG', cx, cy + 2.4)
        ctx.restore(); return
    }

    // sql
    ctx.strokeStyle = '#5CA4EA'
    ctx.beginPath(); ctx.ellipse(cx, cy - 3.2, 6.2, 2.6, 0, 0, Math.PI * 2); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(cx - 6.2, cy - 3.2); ctx.lineTo(cx - 6.2, cy + 4.4); ctx.moveTo(cx + 6.2, cy - 3.2); ctx.lineTo(cx + 6.2, cy + 4.4); ctx.stroke()
    ctx.beginPath(); ctx.ellipse(cx, cy + 4.4, 6.2, 2.6, 0, Math.PI, Math.PI * 2); ctx.stroke()
    ctx.restore()
}

function drawChip(ctx: CanvasRenderingContext2D, x: number, y: number, chip: { brand: TechBrand; label: string }, accent: string) {
    const width = Math.max(66, chip.label.length * 8.3 + 36)
    const height = 24

    ctx.fillStyle = 'rgba(255,255,255,0.06)'
    ctx.strokeStyle = 'rgba(180,149,255,0.28)'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.roundRect(x, y, width, height, 999)
    ctx.fill()
    ctx.stroke()

    drawBrandIcon(ctx, chip.brand, x + 12, y + 12.2, accent)

    ctx.fillStyle = '#D8E0F3'
    ctx.font = '600 11.2px Inter, sans-serif'
    ctx.textAlign = 'start'
    ctx.fillText(chip.label, x + 22, y + 16)
    ctx.textAlign = 'start'

    return width
}

// ─── Canvas texture with reference card style ─────────────────────────────────
function makeTechTexture(
    title: string,
    desc: string,
    icon: TechIcon,
    chips: Array<{ brand: TechBrand; label: string }>,
    color: string,
    bg: string
): THREE.CanvasTexture {
    const W = 512, H = 320
    const canvas = document.createElement('canvas')
    canvas.width = W; canvas.height = H
    const ctx = canvas.getContext('2d')!

    // Background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, H)
    bgGrad.addColorStop(0, '#070D1D')
    bgGrad.addColorStop(1, bg)
    ctx.fillStyle = bgGrad
    ctx.fillRect(0, 0, W, H)

    const glassGrad = ctx.createLinearGradient(0, 0, 0, H * 0.48)
    glassGrad.addColorStop(0, 'rgba(255,255,255,0.07)')
    glassGrad.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = glassGrad
    ctx.fillRect(0, 0, W, H * 0.48)

    // Border
    ctx.strokeStyle = 'rgba(105,129,182,0.34)'
    ctx.lineWidth = 2
    ctx.strokeRect(2, 2, W - 4, H - 4)

    // Glow
    const grad = ctx.createRadialGradient(W * 0.5, H * 0.5, 0, W * 0.5, H * 0.5, W * 0.6)
    grad.addColorStop(0, `${color}22`)
    grad.addColorStop(1, 'transparent')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, W, H)

    // Top accent line
    const topLine = ctx.createLinearGradient(0, 0, W, 0)
    topLine.addColorStop(0, 'rgba(180,149,255,0)')
    topLine.addColorStop(0.5, 'rgba(180,149,255,0.6)')
    topLine.addColorStop(1, 'rgba(180,149,255,0)')
    ctx.fillStyle = topLine
    ctx.fillRect(0, 0, W, 4)

    // Tiny decorative spark icons
    ctx.fillStyle = 'rgba(180,149,255,0.55)'
    ctx.font = '600 14px Inter, sans-serif'
    ctx.fillText('✦', W * 0.22, 48)
    ctx.fillText('✦', W * 0.78, 48)

    // Icon badge
    ctx.beginPath()
    ctx.arc(W / 2, 78, 34, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(255,255,255,0.05)'
    ctx.fill()
    ctx.strokeStyle = 'rgba(180,149,255,0.28)'
    ctx.lineWidth = 2
    ctx.stroke()

    drawTechIcon(ctx, icon, W / 2, 78, color)

    // Title
    ctx.fillStyle = '#FAF7F2'
    ctx.textAlign = 'center'
    ctx.font = '700 38px Inter, sans-serif'
    ctx.fillText(title, W / 2, 182)

    // Description
    ctx.fillStyle = 'rgba(211, 220, 241, 0.88)'
    ctx.font = '400 20px Inter, sans-serif'
    ctx.fillText(desc, W / 2, 220)

    // Extra mini icon chips
    const spacing = 10
    const chipWidths = chips.map((chip) => Math.max(66, chip.label.length * 8.3 + 36))
    const totalWidth = chipWidths.reduce((sum, width) => sum + width, 0) + spacing * (chips.length - 1)
    let x = (W - totalWidth) / 2
    const y = 255
    chips.forEach((chip) => {
        const width = drawChip(ctx, x, y, chip, color)
        x += width + spacing
    })

    ctx.textAlign = 'start'

    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
}

// ─── TechCard — copied EXACTLY from Layout3 ProjectCard ──────────────────────
function TechCard({ tech, angleOffset, orbitRef }: {
    tech: typeof TECHS[0]
    angleOffset: number
    orbitRef: React.MutableRefObject<number>
}) {
    const ref = useRef<THREE.Group>(null!)
    const phase = useMemo(() => Math.random() * Math.PI * 2, [])

    const screenMat = useMemo(() => {
        const tex = makeTechTexture(tech.title, tech.desc, tech.icon, tech.chips, tech.color, tech.bg)
        tex.colorSpace = THREE.SRGBColorSpace
        return new THREE.MeshStandardMaterial({
            map: tex,
            emissiveMap: tex,
            emissive: new THREE.Color('#8B6FE0'),
            emissiveIntensity: 0.14,
            roughness: 0.15,
            metalness: 0.05,
        })
    }, [tech])

    const bodyMat = useMemo(
        () => new THREE.MeshStandardMaterial({ color: '#111', metalness: 0.7, roughness: 0.3 }),
        []
    )

    // ── useFrame: IDENTICAL to Layout3 ProjectCard.useFrame ───────────────────
    useFrame(({ clock }) => {
        if (!ref.current) return
        const angle = orbitRef.current + angleOffset        // shared base + offset
        const x = Math.cos(angle) * ORBIT_R
        const z = Math.sin(angle) * ORBIT_R
        const y = Math.sin(clock.getElapsedTime() * 0.65 + phase) * 0.14
        ref.current.position.set(x, y, z)
        ref.current.lookAt(0, ref.current.position.y, 0)   // always face center
        ref.current.rotateY(Math.PI)                        // flip so front faces outward
    })

    return (
        <group ref={ref}>
            {/* Card body */}
            <mesh material={bodyMat} castShadow>
                <boxGeometry args={[CARD_W, CARD_H, CARD_D]} />
            </mesh>
            {/* Screen face (front) — same as Layout3 */}
            <mesh position={[0, 0, CARD_D / 2 + 0.001]} material={screenMat}>
                <planeGeometry args={[CARD_W - 0.04, CARD_H - 0.04]} />
            </mesh>
            {/* Thin edge glow strip — same as Layout3 */}
            <mesh position={[0, 0, -CARD_D / 2 - 0.002]}>
                <planeGeometry args={[CARD_W, CARD_H]} />
                <meshBasicMaterial color={tech.color} transparent opacity={0.08} side={THREE.BackSide} />
            </mesh>
        </group>
    )
}

// ─── Orbital rings (decorative, independent of card orbit) ───────────────────
const RING_RADII = [2.6, 3.5, 4.4]
const RING_TILTS = [0.35, 0.72, 0.18]
const RING_COLORS = ['#E07A5F', '#81A594', '#C9A87C']

function OrbitalRing({ radius, tilt, color }: { radius: number; tilt: number; color: string }) {
    const mat = useMemo(
        () => new THREE.MeshStandardMaterial({
            color: new THREE.Color(color), emissive: new THREE.Color(color),
            emissiveIntensity: 0.55, metalness: 0.9, roughness: 0.1,
            transparent: true, opacity: 0.38,
        }),
        [color]
    )
    const ref = useRef<THREE.Mesh>(null!)
    const spd = useRef(0.055 + Math.random() * 0.06)
    useFrame((_, dt) => { if (ref.current) ref.current.rotation.z += spd.current * dt })
    return (
        <mesh ref={ref} rotation={[tilt, 0, 0]} material={mat}>
            <torusGeometry args={[radius, 0.012, 6, 120]} />
        </mesh>
    )
}

// ─── Glass core sphere ────────────────────────────────────────────────────────
function GlassCore() {
    const mat = useMemo(
        () => new THREE.MeshPhysicalMaterial({
            color: new THREE.Color('#90C0E4'), metalness: 0.0, roughness: 0.05,
            transmission: 0.92, thickness: 1.5,
            emissive: new THREE.Color('#4080B0'), emissiveIntensity: 0.18,
            transparent: true,
        }),
        []
    )
    const ref = useRef<THREE.Mesh>(null!)
    useFrame(({ clock }) => {
        const s = 0.97 + 0.05 * Math.sin(clock.getElapsedTime() * 1.3)
        if (ref.current) ref.current.scale.setScalar(s)
    })
    return (
        <>
            <mesh ref={ref} material={mat}><sphereGeometry args={[0.95, 32, 32]} /></mesh>
            <mesh rotation={[Math.PI / 2.2, 0, 0]}>
                <torusGeometry args={[1.45, 0.04, 8, 80]} />
                <meshStandardMaterial color="#C9A87C" emissive="#C9A87C" emissiveIntensity={0.6}
                    metalness={0.9} roughness={0.1} transparent opacity={0.65} />
            </mesh>
        </>
    )
}

// ─── Grid floor ───────────────────────────────────────────────────────────────
function GridFloor() {
    const grid = useMemo(() => {
        const g = new THREE.GridHelper(22, 22, '#2A2A40', '#1E1E30')
        g.position.y = -2.8
        const mat = g.material as THREE.Material
        if (!Array.isArray(mat)) { mat.transparent = true; mat.opacity = 0.18 }
        return g
    }, [])
    return <primitive object={grid} />
}

// ─── Layout 2 — root ──────────────────────────────────────────────────────────
interface L2Props {
    progressRef: React.MutableRefObject<number>
    mouseRef: React.MutableRefObject<{ x: number; y: number }>
}

export default function Layout2({ progressRef, mouseRef }: L2Props) {
    const groupRef = useRef<THREE.Group>(null!)
    const orbitAngle = useRef(0)   // shared orbit angle — same pattern as Layout3

    // ── useFrame: IDENTICAL to Layout3's root useFrame ────────────────────────
    useFrame((_, dt) => {
        if (!groupRef.current) return
        const p = progressRef.current

        // IDENTICAL to Layout3 — only fadeIn controls visibility + scale
        // Hard cut at p=0.72 when Layout3 takes over (no exit zoom-out)
        const fadeIn = THREE.MathUtils.clamp((p - 0.40) / 0.14, 0, 1)
        groupRef.current.visible = fadeIn > 0.01 && p < 0.72

        // Scale in from center — SAME formula as Layout3 (0.85 → 1.0)
        const s = 0.85 + fadeIn * 0.15
        groupRef.current.scale.setScalar(s)

        // Orbit advance — SAME speed as Layout3 (dt * 0.12)
        orbitAngle.current += dt * 0.12

        // Mouse parallax — SAME as Layout3
        groupRef.current.rotation.y +=
            (mouseRef.current.x * 0.08 - groupRef.current.rotation.y) * 0.03
    })

    // Even angular spacing — SAME formula as Layout3
    const angleOffsets = TECHS.map((_, i) => (i / TECHS.length) * Math.PI * 2)

    return (
        <group ref={groupRef}>
            <GlassCore />
            <pointLight position={[0, 0, 0]} intensity={3} color="#60A8F0" distance={6} decay={2} />

            {/* Decorative orbital rings */}
            {RING_RADII.map((r, i) => (
                <OrbitalRing key={i} radius={r} tilt={RING_TILTS[i]} color={RING_COLORS[i]} />
            ))}

            {/* Tech cards — same orbit as Layout3 */}
            {TECHS.map((t, i) => (
                <TechCard
                    key={i}
                    tech={t}
                    angleOffset={angleOffsets[i]}
                    orbitRef={orbitAngle}
                />
            ))}

            <GridFloor />
        </group>
    )
}
