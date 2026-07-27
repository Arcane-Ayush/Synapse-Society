import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as random from "maath/random";
import * as THREE from 'three';

// --- BASIC: Interactive Milky Way ---
export function Stars(props) {
    const ref = useRef()      // For Auto-Rotation
    const sphere = random.inSphere(new Float32Array(5000), { radius: 20 })

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.y -= delta / 50;
        }
    })

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    color="#ffffff"
                    size={0.02}
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={0.6}
                />
            </Points>
        </group>
    )
}

// --- 1. BASIC: Space Dust (Drifting Particles) ---
export function SpaceDust() {
    const count = 300;
    const mesh = useRef();

    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * 15;
            const y = (Math.random() - 0.5) * 15;
            const z = (Math.random() - 0.5) * 10; // Depth
            const speed = 0.005 + Math.random() * 0.01; // Very slow drift
            const factor = 0.2 + Math.random() * 0.8; // Random scale
            temp.push({ x, y, z, speed, factor, initialY: y });
        }
        return temp;
    }, []);

    const dummy = useMemo(() => new THREE.Object3D(), []);

    useFrame((state) => {
        if (!mesh.current) return;
        particles.forEach((p, i) => {
            // Gentle float upwards (heat/gravity)
            p.y += p.speed;

            // Loop back to bottom
            if (p.y > 10) p.y = -10;

            dummy.position.set(p.x, p.y, p.z);
            dummy.scale.setScalar(p.factor * 0.08); // Tiny specs
            dummy.rotation.x += p.speed;
            dummy.updateMatrix();
            mesh.current.setMatrixAt(i, dummy.matrix);
        });
        mesh.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={mesh} args={[null, null, count]}>
            <dodecahedronGeometry args={[0.2, 0]} />
            <meshBasicMaterial color="#a0c4ff" transparent opacity={0.6} />
        </instancedMesh>
    );
}

export function SpaceBackground() {
    return (
        <>
            <Stars />
            <SpaceDust />
        </>
    )
}
