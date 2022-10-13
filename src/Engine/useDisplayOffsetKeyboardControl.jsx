import { useCallback, useEffect, useRef, useState } from 'react';

const defaultDisplayOffsetX = 10;
const defaultDisplayOffsetY = 400;

export const useDisplayOffsetKeyboardControl = () => {
    const [displayOffsetX, setDisplayOffsetX] = useState(defaultDisplayOffsetX);
    const [displayOffsetY, setDisplayOffsetY] = useState(defaultDisplayOffsetY);
    const presetKeysRef = useRef(new Set());
    const onKeydown = useCallback((event) => {
        switch (event.key) {
            case 'ArrowUp':
            case 'ArrowDown':
            case 'ArrowLeft':
            case 'ArrowRight':
                presetKeysRef.current.add(event.key);
                event.preventDefault();
        }
    }, [presetKeysRef]);
    const onKeyup = useCallback((event) => {
        switch (event.key) {
            case 'ArrowUp':
            case 'ArrowDown':
            case 'ArrowLeft':
            case 'ArrowRight':
                presetKeysRef.current.delete(event.key);
                event.preventDefault();
        }
    }, [presetKeysRef]);

    useEffect(() => {
        let isMounted = true;
        window.document.documentElement.addEventListener('keydown', onKeydown)
        window.document.documentElement.addEventListener('keyup', onKeyup)

        return () => {
            isMounted = false;
            window.document.documentElement.removeEventListener('keydown', onKeydown);
            window.document.documentElement.removeEventListener('keyup', onKeyup);
        }
    }, [onKeydown, onKeyup]);

    useEffect(() => {
        let id;
        let prev = 0;

        id = window.requestAnimationFrame(function move(timestamp) {
            const diff = !prev ? 0 : (timestamp - prev) * 0.1;

            if (presetKeysRef.current.has('ArrowUp')) {
                setDisplayOffsetY(prevY => prevY + diff);
            }

            if (presetKeysRef.current.has('ArrowDown')) {
                setDisplayOffsetY(prevY => prevY - diff);
            }

            if (presetKeysRef.current.has('ArrowLeft')) {
                setDisplayOffsetX(prevX => prevX + diff);
            }

            if (presetKeysRef.current.has('ArrowRight')) {
                setDisplayOffsetX(prevX => prevX - diff);
            }

            prev = timestamp;
            id = window.requestAnimationFrame(move);
        });

        return () => {
            window.cancelAnimationFrame(id);
            prev = 0;
        }
    }, [presetKeysRef, setDisplayOffsetX, setDisplayOffsetY]);

    return [displayOffsetX, displayOffsetY];
};
