import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp } from 'lucide-react';

export function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    onClick={scrollToTop}
                    className="fixed bottom-6 right-6 p-3 rounded-full z-50 shadow-lg cursor-pointer transition-colors"
                    style={{
                        background: 'rgba(var(--synapse-violet-rgb), 0.8)',
                        color: '#FFF',
                        border: '1px solid rgba(var(--synapse-violet-light-rgb), 0.5)',
                        backdropFilter: 'blur(8px)',
                    }}
                    whileHover={{ scale: 1.1, background: 'rgba(var(--synapse-violet-light-rgb), 0.9)' }}
                    whileTap={{ scale: 0.9 }}
                >
                    <ChevronUp size={24} />
                </motion.button>
            )}
        </AnimatePresence>
    );
}
