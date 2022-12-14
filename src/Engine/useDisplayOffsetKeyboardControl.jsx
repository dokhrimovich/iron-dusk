import { useCallback, useEffect, useRef, useState } from 'react';

const defaultDisplayOffsetX = 10;
const defaultDisplayOffsetY = 400;

export const useDisplayOffsetKeyboardControl = ({ canvas }) => {
    const [offset, setOffset] = useState([defaultDisplayOffsetX, defaultDisplayOffsetY]);
    const presetKeysRef = useRef(new Set());
    const scrollDiffRef = useRef([0, 0]);
    const scrollEndIdRef = useRef();
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
    const onScrollEnd = useCallback(() => {
        scrollDiffRef.current = [0, 0];
    }, [scrollDiffRef]);
    const onScroll = useCallback((event) => {
        scrollDiffRef.current = [event.deltaX, event.deltaY];

        if (scrollEndIdRef.current) {
            window.clearTimeout(scrollEndIdRef.current);
        }

        scrollEndIdRef.current = window.setTimeout(onScrollEnd, 100);
    }, [onScrollEnd]);

    useEffect(() => {
        window.document.documentElement.addEventListener('keydown', onKeydown);
        window.document.documentElement.addEventListener('keyup', onKeyup);

        canvas?.addEventListener('wheel', onScroll);
        // canvas?.addEventListener('scrollend', onScrollEnd);

        return () => {
            window.document.documentElement.removeEventListener('keydown', onKeydown);
            window.document.documentElement.removeEventListener('keyup', onKeyup);

            canvas?.removeEventListener('wheel', onScroll);
        };
    }, [onKeydown, onKeyup, canvas, onScroll]);

    useEffect(() => {
        let id;
        let prev = 0;

        id = window.requestAnimationFrame(function move(timestamp) {
            const diff = !prev ? 0 : (timestamp - prev) * 0.2;
            let dX = 0;
            let dY = 0;

            if (presetKeysRef.current.has('ArrowUp')) {
                dY = diff;
            }

            if (presetKeysRef.current.has('ArrowDown')) {
                dY = -diff;
            }

            if (presetKeysRef.current.has('ArrowLeft')) {
                dX = diff;
            }

            if (presetKeysRef.current.has('ArrowRight')) {
                dX = -diff;
            }

            const [scrollDx, scrollDy] = scrollDiffRef.current;

            (dX || dY) && setOffset(([x, y]) => [x + dX, y + dY]);
            (scrollDx || scrollDy) && setOffset(([x, y]) => [x - scrollDx, y - scrollDy]);
            prev = timestamp;
            id = window.requestAnimationFrame(move);
        });

        return () => {
            window.cancelAnimationFrame(id);
            prev = 0;
        };
    }, [presetKeysRef, setOffset]);

    return [...offset];
};
