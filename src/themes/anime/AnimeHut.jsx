import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Box, Cylinder, Cone, Sphere } from '@react-three/drei'

export function AnimeHut() {
    const group = useRef()
    const smokeRef = useRef()

    useFrame((state) => {
        const t = state.clock.getElapsedTime();

        // Island Float
        if (group.current) {
            group.current.position.y = Math.sin(t * 1) * 0.1 - 1;
            group.current.rotation.y = Math.sin(t * 0.2) * 0.1;
        }

        // Smoke Animation
        if (smokeRef.current) {
            smokeRef.current.children.forEach((child, i) => {
                child.position.y += 0.01;
                child.scale.setScalar(1 + Math.sin(t * 2 + i) * 0.2);
                if (child.position.y > 1.5) child.position.y = 0; // Reset
            })
        }
    });

    // Materials
    const wallMat = <meshStandardMaterial color="#fcebd5" />; // Cream walls
    const roofMat = <meshStandardMaterial color="#ff6b6b" />; // Red/Pink roof
    const grassMat = <meshStandardMaterial color="#95d070" />; // Soft Green
    const woodMat = <meshStandardMaterial color="#8b5a2b" />;

    return (
        <group ref={group} scale={[0.8, 0.8, 0.8]} position={[0, -1, 0]}>
            {/* Floating Island Base */}
            <Cylinder args={[2.5, 1.5, 1, 32]} position={[0, -0.5, 0]}>
                <meshStandardMaterial color="#7c6a52" />
            </Cylinder>
            <Cylinder args={[2.5, 2.5, 0.2, 32]} position={[0, 0.1, 0]}>{grassMat}</Cylinder>

            {/* HOUSE */}
            <group position={[0, 0.2, 0]}>
                {/* Main Box then Roof , then Door*/}
                <Box args={[1.5, 1.2, 1.2]} position={[0, 0.6, 0]}>{wallMat}</Box>
                {/* Roof */}
                <Cone args={[1.3, 1, 4]} position={[0, 1.7, 0]} rotation={[0, Math.PI / 4, 0]}>{roofMat}</Cone>

                {/* Door */}
                <Box args={[0.4, 0.7, 0.1]} position={[0, 0.35, 0.61]}><meshStandardMaterial color="#5d4037" /></Box>
                <Sphere args={[0.04]} position={[0.15, 0.35, 0.66]}><meshStandardMaterial color="#ffd700" /></Sphere>

                {/* Window */}
                <Box args={[0.4, 0.4, 0.1]} position={[0, 0.8, 0.61]}><meshStandardMaterial color="#87ceeb" /></Box>

                {/* Chimney */}
                <Box args={[0.3, 0.8, 0.3]} position={[0.5, 1.5, 0.3]}>{woodMat}</Box>

                {/* Smoke Particles */}
                <group position={[0.5, 1.9, 0.3]} ref={smokeRef}>
                    <Sphere args={[0.15]} position={[0, 0, 0]}><meshStandardMaterial color="#ffffff" transparent opacity={0.6} /></Sphere>
                    <Sphere args={[0.2]} position={[0.1, 0.4, 0]}><meshStandardMaterial color="#ffffff" transparent opacity={0.5} /></Sphere>
                    <Sphere args={[0.25]} position={[-0.1, 0.8, 0]}><meshStandardMaterial color="#ffffff" transparent opacity={0.4} /></Sphere>
                </group>
            </group>

            {/* Trees */}
            <group position={[-1.5, 0.2, 0.5]}>
                <Cylinder args={[0.1, 0.15, 0.8, 8]} position={[0, 0.4, 0]}>{woodMat}</Cylinder>
                <Cone args={[0.6, 1.2, 8]} position={[0, 1.0, 0]}>{grassMat}</Cone>
            </group>

            <group position={[1.4, 0.2, -0.8]} scale={[0.8, 0.8, 0.8]}>
                <Cylinder args={[0.1, 0.15, 0.8, 8]} position={[0, 0.4, 0]}>{woodMat}</Cylinder>
                <Cone args={[0.6, 1.2, 8]} position={[0, 1.0, 0]}>{grassMat}</Cone>
            </group>

            {/* Clouds */}
            <Sphere args={[0.4]} position={[-1.8, 2, -1]}><meshStandardMaterial color="#ffffff" opacity={0.9} transparent /></Sphere>
            <Sphere args={[0.3]} position={[1.8, 2.5, 1]}><meshStandardMaterial color="#ffffff" opacity={0.9} transparent /></Sphere>
        </group>
    )
}
