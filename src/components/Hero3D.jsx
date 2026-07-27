import { useRef, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere, Box, Cylinder, Cone, MeshDistortMaterial } from '@react-three/drei'
import { useTheme, themes } from '../context/ThemeContext'
import { BlackHole } from '../themes/basic/BlackHole'
import { ArcadeCabinet } from '../themes/arcade/ArcadeCabinet'
import { AnimeHut } from '../themes/anime/AnimeHut'

//basic sphere
function BasicHero(props) {
    // Reverted scale to 0.75 as per "fine" state
    return <BlackHole {...props} scale={[0.75, 0.75, 0.75]} />
}

export function Hero3D() {
    //we are destructuring here... 
    const { theme } = useTheme();

    return (
        <div className="h-[400px] w-full md:h-[500px]">
            <Canvas camera={{ position: [0, 1, 5], fov: 45 }}>
                {/*short circuiting true && (then render)*/}
                {theme === themes.BASIC && (
                    <>
                        <ambientLight intensity={0.5} />
                        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
                        <pointLight position={[-10, -10, -10]} intensity={1} />
                        <BasicHero />
                    </>
                )}

                {theme === themes.ARCADE && (
                    <>
                        <color attach="background" args={['#1a0b2e']} />
                        <ambientLight intensity={0.2} />
                        <pointLight position={[10, 10, 10]} intensity={1.5} color="#00ff00" />
                        <pointLight position={[-10, -10, -10]} intensity={1.5} color="#ff00ff" />
                        <ArcadeCabinet />
                    </>
                )}

                {theme === themes.ANIME && (
                    <>
                        <ambientLight intensity={0.8} />
                        <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow />
                        <directionalLight position={[-5, 5, -5]} intensity={0.5} />
                        <AnimeHut />
                    </>
                )}

                <OrbitControls enableZoom={false} autoRotate={false} />
            </Canvas>
        </div>
    )
}
