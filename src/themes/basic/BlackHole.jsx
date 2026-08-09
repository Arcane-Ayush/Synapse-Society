import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function BlackHoleRing({ count, radius, color, speed, size, opacity, spread }) {
    const ref = useRef();
    // Create a flat ring distribution
    const particles = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const radiusSpread = spread || radius * 0.3; // Use custom spread or default to 30%

        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            // Distribute primarily on ring edge with some spread
            const r = radius + (Math.random() - 0.5) * radiusSpread;

            positions[i * 3] = Math.cos(angle) * r;     // x
            positions[i * 3 + 1] = (Math.random() - 0.5) * 0.2; // y (flat)
            positions[i * 3 + 2] = Math.sin(angle) * r;     // z
        }
        return positions;
    }, [count, radius, spread]);

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.y += delta * speed;
        }
    });

    return (
        <Points ref={ref} positions={particles} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                color={color}
                size={size}
                sizeAttenuation={true}
                depthWrite={false}
                opacity={opacity}
            />
        </Points>
    );
}

const sunVertexShader = `
varying vec3 vNormal;
void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const sunFragmentShader = `
varying vec3 vNormal;
void main() {
    float intensity = pow(0.65 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
    gl_FragColor = vec4(1.0, 0.6, 0.2, 1.0) * intensity + vec4(1.0, 0.9, 0.7, 1.0);
}
`;

const sunGlowVertexShader = `
varying vec3 vNormal;
void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const sunGlowFragmentShader = `
varying vec3 vNormal;
void main() {
    float intensity = pow(0.55 - dot(vNormal, vec3(0, 0, 1.0)), 3.0);
    gl_FragColor = vec4(1.0, 0.5, 0.1, 1.0) * intensity;
}
`;

export function BlackHole(props) {
    const isSolarFlare = typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'orange';

    return (
        <group {...props}>
            <group rotation={[0.6, 0.1, -0.2]}> {/* Tilt the whole system dynamically for a diagonal view */}
                {/* The Void (Event Horizon) or Sun Core */}
                {isSolarFlare ? (
                    <>
                        <mesh>
                            <sphereGeometry args={[0.98, 64, 64]} />
                            <shaderMaterial
                                vertexShader={sunVertexShader}
                                fragmentShader={sunFragmentShader}
                            />
                        </mesh>
                        <mesh>
                            <sphereGeometry args={[1.2, 64, 64]} />
                            <shaderMaterial
                                vertexShader={sunGlowVertexShader}
                                fragmentShader={sunGlowFragmentShader}
                                blending={THREE.AdditiveBlending}
                                side={THREE.BackSide}
                                transparent={true}
                                depthWrite={false}
                            />
                        </mesh>
                    </>
                ) : (
                    <mesh>
                        <sphereGeometry args={[1, 64, 64]} /> {/* Smooth sphere */}
                        <meshBasicMaterial color="#000000" />
                    </mesh>
                )}

                {isSolarFlare ? (
                    <>
                        {/* SOLAR FLARE THEME */}
                        <BlackHoleRing count={3000} radius={1.015} color="#ffedd5" speed={2} size={0.015} opacity={1} spread={0} />
                        <BlackHoleRing count={4000} radius={1.02} color="#fed7aa" speed={2} size={0.015} opacity={1} spread={0} />
                        <BlackHoleRing count={1500} radius={1.2} color="#fdba74" speed={1.5} size={0.015} opacity={0.9} />
                        <BlackHoleRing count={1000} radius={1.25} color="#fb923c" speed={1.45} size={0.015} opacity={0.85} />
                        <BlackHoleRing count={1200} radius={1.3} color="#f97316" speed={1.4} size={0.016} opacity={0.85} />
                        <BlackHoleRing count={1200} radius={1.4} color="#ea580c" speed={1.2} size={0.018} opacity={0.7} />
                        <BlackHoleRing count={1000} radius={1.45} color="#c2410c" speed={1.15} size={0.018} opacity={0.7} />
                        <BlackHoleRing count={1100} radius={1.6} color="#9a3412" speed={1.1} size={0.019} opacity={0.65} />
                        <BlackHoleRing count={1000} radius={1.75} color="#7c2d12" speed={1.05} size={0.019} opacity={0.6} />
                        <BlackHoleRing count={1000} radius={1.8} color="#431407" speed={1.0} size={0.02} opacity={0.6} />

                        {/* Flares / Outermost dust */}
                        <BlackHoleRing count={2000} radius={2} color="#ffedd5" speed={0.8} size={0.02} opacity={0.8} />
                        <BlackHoleRing count={3000} radius={3.5} color="#fdba74" speed={0.4} size={0.025} opacity={0.7} />
                        <BlackHoleRing count={2000} radius={5.5} color="#c2410c" speed={0.1} size={0.03} opacity={0.4} />
                    </>
                ) : (
                    <>
                        {/* DARK NEBULA THEME (DEFAULT) */}
                        <BlackHoleRing count={3000} radius={1.015} color="#ffffff" speed={2} size={0.015} opacity={1} spread={0} />
                        <BlackHoleRing count={4000} radius={1.02} color="#ffffff" speed={2} size={0.015} opacity={1} spread={0} />
                        <BlackHoleRing count={1500} radius={1.2} color="#ffffff" speed={1.5} size={0.015} opacity={0.9} />
                        <BlackHoleRing count={1000} radius={1.25} color="#e0ffff" speed={1.45} size={0.015} opacity={0.85} />
                        <BlackHoleRing count={1200} radius={1.3} color="#e0ffff" speed={1.4} size={0.016} opacity={0.85} />
                        <BlackHoleRing count={1200} radius={1.4} color="#ffd700" speed={1.2} size={0.018} opacity={0.7} />
                        <BlackHoleRing count={1000} radius={1.45} color="#ffcc00" speed={1.15} size={0.018} opacity={0.7} />
                        <BlackHoleRing count={1100} radius={1.6} color="#ffa500" speed={1.1} size={0.019} opacity={0.65} />
                        <BlackHoleRing count={1000} radius={1.75} color="#ff8c00" speed={1.05} size={0.019} opacity={0.6} />
                        <BlackHoleRing count={1000} radius={1.8} color="#ff4500" speed={1.0} size={0.02} opacity={0.6} />
                        <BlackHoleRing count={1500} radius={2.8} color="#9400d3" speed={0.6} size={0.022} opacity={0.5} />

                        <BlackHoleRing count={2000} radius={2} color="#b0e0ff" speed={0.8} size={0.02} opacity={0.8} />
                        <BlackHoleRing count={3000} radius={3.5} color="#ffaa40" speed={0.4} size={0.025} opacity={0.7} />
                        <BlackHoleRing count={2000} radius={5.5} color="#8a2be2" speed={0.1} size={0.03} opacity={0.4} />
                    </>
                )}
            </group>
        </group>
    );
}
