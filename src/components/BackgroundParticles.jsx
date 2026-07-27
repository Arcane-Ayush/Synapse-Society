import { Canvas } from '@react-three/fiber'
import { useTheme, themes } from '../context/ThemeContext';
import { cn } from '../utils/cn';
import { SpaceBackground } from '../themes/basic/SpaceBackground';
import { ArcadeBackground } from '../themes/arcade/RetroGrid';
import { AnimeBackground } from '../themes/anime/Sakura';

export function BackgroundParticles() {
    const { theme } = useTheme();

    return (
        <div className="fixed inset-0 -z-10 h-full w-full pointer-events-none transition-colors duration-700">

            {/* Dynamic Background Colors/Gradients outside Canvas for performance */}
            <div className={cn(
                "absolute inset-0 -z-10 transition-all duration-700",
                theme === themes.BASIC && "bg-neutral-950",
                theme === themes.ARCADE && "bg-[#0f0518] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-[#0f0518] to-[#0f0518]",
                theme === themes.ANIME && "bg-sky-50"
            )} />

            <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
                {theme === themes.BASIC && (
                    <SpaceBackground />
                )}

                {theme === themes.ARCADE && (
                    <ArcadeBackground />
                )}

                {theme === themes.ANIME && (
                    <AnimeBackground />
                )}
            </Canvas>
        </div>
    )
}
