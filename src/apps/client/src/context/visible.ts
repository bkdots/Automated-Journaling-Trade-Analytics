import { createContext, useState, useMemo } from "react";

export const VisibleModeContext = createContext({
    toggleVisibility: () => {},
    isVisible: true
});

export const useVisibility = (): [boolean, { toggleVisibility: () => void; }] => {
    const [isVisible, setIsVisible] = useState(true)

    const visibilityControls = useMemo(
        () => ({
            toggleVisibility: () => setIsVisible(prev => !prev),
        }),
        []
    );

    return [isVisible, visibilityControls];
};