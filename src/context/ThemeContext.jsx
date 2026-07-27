// Simplified — single Synapse Society theme
import { createContext, useContext } from 'react';

export const SYNAPSE_THEME = 'synapse';

const ThemeContext = createContext({ theme: SYNAPSE_THEME });

export function ThemeProvider({ children }) {
    return (
        <ThemeContext.Provider value={{ theme: SYNAPSE_THEME }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}

// Kept for any legacy refs — everything is now synapse
export const themes = {
    SYNAPSE: SYNAPSE_THEME,
    BASIC: SYNAPSE_THEME,
    ARCADE: SYNAPSE_THEME,
    ANIME: SYNAPSE_THEME,
};
