import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Box, Cylinder, Sphere } from '@react-three/drei'

export function ArcadeCabinet() {
    const group = useRef()
    const particlesRef = useRef()

    useFrame((state) => {
        const t = state.clock.getElapsedTime();

        // Cabinet Float/Bob
        if (group.current) {
            group.current.position.y = Math.sin(t * 1.5) * 0.1 - 0.5; // Bobbing
            group.current.rotation.y = Math.sin(t * 0.5) * 0.15; // Gentle sway
        }

        // Floating Pixels Orbit
        if (particlesRef.current) {
            particlesRef.current.rotation.y = t * 0.2;
            particlesRef.current.children.forEach((child, i) => {
                child.position.y += Math.sin(t * 3 + i) * 0.002;
                child.rotation.x += 0.02;
                child.rotation.z += 0.02;
            })
        }
    });

    const cabinetMat = <meshStandardMaterial color="#1a0b2e" roughness={0.3} metalness={0.8} />;
    const trimMat = <meshStandardMaterial color="#df00ff" emissive="#df00ff" emissiveIntensity={0.5} />;
    const screenMat = <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={0.8} />;

    // Floating Pixels
    const pixels = useMemo(() => {
        return [...Array(12)].map((_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            const radius = 2 + Math.random() * 0.5;
            const y = (Math.random() - 0.5) * 2;
            return (
                <Box
                    key={i}
                    args={[0.15, 0.15, 0.15]}
                    position={[Math.cos(angle) * radius, y, Math.sin(angle) * radius]}
                >
                    <meshStandardMaterial
                        color={Math.random() > 0.5 ? "#00f0ff" : "#ff00ff"}
                        emissive={Math.random() > 0.5 ? "#00f0ff" : "#ff00ff"}
                        emissiveIntensity={1}
                    />
                </Box>
            )
        });
    }, []);

    return (
        <group scale={[0.8, 0.8, 0.8]}>
            <group ref={group}>
                {/* 1. Base / Main Body */}
                <Box args={[1.2, 1.2, 1.2]} position={[0, -0.6, 0]}>{cabinetMat}</Box>

                {/* 2. Screen Housing & Marquee */}
                <group position={[0, 0.6, -0.2]}>
                    {/* Back Spine */}
                    <Box args={[1.2, 1.2, 0.8]} position={[0, 0, -0.2]}>{cabinetMat}</Box>
                    {/* Top Overhang (Marquee) */}
                    <Box args={[1.3, 0.3, 1.4]} position={[0, 0.75, 0.1]}>{trimMat}</Box>
                    {/* Marquee Text Area */}
                    <Box args={[1.1, 0.2, 0.1]} position={[0, 0.75, 0.81]}>
                        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} />
                    </Box>

                    {/* Screen */}
                    <Box args={[1.0, 0.8, 0.1]} position={[0, 0.1, 0.25]} rotation={[-0.2, 0, 0]}>
                        {screenMat}
                    </Box>
                </group>

                {/* 3. Control Deck */}
                <group position={[0, 0.1, 0.6]}>
                    <Box args={[1.4, 0.1, 0.6]} position={[0, 0, 0]} rotation={[0.2, 0, 0]}>{trimMat}</Box>

                    {/* Joystick */}
                    <group position={[-0.4, 0.1, 0.1]} rotation={[0.2, 0, 0.2]}>
                        <Cylinder args={[0.05, 0.05, 0.3]} position={[0, 0.15, 0]}><meshStandardMaterial color="#888" /></Cylinder>
                        <Sphere args={[0.1]} position={[0, 0.35, 0]}><meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={0.5} /></Sphere>
                    </group>

                    {/* Buttons */}
                    <Cylinder args={[0.08, 0.08, 0.05]} position={[0.2, 0.08, 0.1]} rotation={[0.2, 0, 0]}><meshStandardMaterial color="#00ff00" emissive="#00ff00" /></Cylinder>
                    <Cylinder args={[0.08, 0.08, 0.05]} position={[0.4, 0.08, 0.0]} rotation={[0.2, 0, 0]}><meshStandardMaterial color="#ffff00" emissive="#ffff00" /></Cylinder>
                </group>

                {/* 4. Side Panels / Neon Strips */}
                <Box args={[0.1, 2.6, 1.2]} position={[-0.65, 0.1, 0]}>{trimMat}</Box>
                <Box args={[0.1, 2.6, 1.2]} position={[0.65, 0.1, 0]}>{trimMat}</Box>
            </group>

            {/* Orbiting Pixels */}
            <group ref={particlesRef}>
                {pixels}
            </group>
        </group>
    )
}
