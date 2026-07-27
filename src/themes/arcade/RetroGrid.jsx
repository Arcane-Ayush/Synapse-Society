import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

// --- Retro Grid ---
export function RetroGrid() {
    const gridRef = useRef();

    useFrame((state) => {
        if (!gridRef.current) return;
        // Move the grid towards the camera (z-axis) to create forward momentum
        // Modulo ensures it loops infinitely
        const t = state.clock.getElapsedTime();
        gridRef.current.position.z = (t * 2) % 2;
        gridRef.current.position.y = -2; // Floor level
    });

    return (
        <group rotation={[0, 0, 0]} ref={gridRef}>
            {/* A large grid helper */}
            <gridHelper args={[60, 60, 0xff00ff, 0x4200ff]} position={[0, 0, 0]} />
            {/* Add a secondary grid for detail */}
            <gridHelper args={[60, 120, 0x200040, 0x100020]} position={[0, -0.05, 0]} />
        </group>
    );
}

export function ArcadeBackground() {
    return (
        <>
            {/* Fog to hide the grid edge */}
            <fog attach="fog" args={['#1a0b2e', 5, 20]} />
            <RetroGrid />
        </>
    )
}
