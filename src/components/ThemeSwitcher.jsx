import { useTheme } from "../context/ThemeContext";
import { THEME_OPTIONS } from "../themes/config";
import { cn } from "../utils/cn";

export function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();

    return (
        <div className="fixed bottom-6 right-6 z-50 flex gap-2 p-2 rounded-full bg-black/80 border border-white/20 backdrop-blur-xl shadow-2xl scale-75 md:scale-100 origin-bottom-right">
            {THEME_OPTIONS.map((option) => {
                const Icon = option.icon;
                const isActive = theme === option.id;

                return (
                    <button
                        key={option.id}
                        onClick={() => setTheme(option.id)}
                        className={cn(
                            "relative p-3 rounded-full transition-all duration-300 group",
                            isActive ? "text-white bg-white/20" : "text-gray-400 hover:text-white hover:bg-white/10"
                        )}
                        title={option.label}
                    >
                        <Icon size={20} className="relative z-10" />
                        {isActive && (
                            <div
                                className="absolute inset-0 rounded-full border border-white/30 animate-in fade-in zoom-in duration-300"
                            />
                        )}
                    </button>
                );
            })}
        </div>
    );
}
