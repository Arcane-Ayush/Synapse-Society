import { Monitor, Gamepad2, ShipWheel } from "lucide-react";

export const THEMES = {
    BASIC: "basic",
    ARCADE: "arcade",
    ANIME: "anime",
};

export const THEME_OPTIONS = [
    { id: THEMES.BASIC, icon: Monitor, label: "Basic" },
    { id: THEMES.ARCADE, icon: Gamepad2, label: "Arcade" },
    { id: THEMES.ANIME, icon: ShipWheel, label: "Anime" },
];
