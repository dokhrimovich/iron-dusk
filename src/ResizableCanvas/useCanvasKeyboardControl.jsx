import { useCallback, useEffect, useRef } from 'react';

const listenToKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

export const useCanvasKeyboardControl = ({ canvasEl, setScale, setOffset }) => {
    const presetKeysRef = useRef(new Set());
    const scrollDiffRef = useRef([0, 0]);
    const scrollEndIdRef = useRef();
    const onKeydown = useCallback((event) => {
        if (listenToKeys.includes(event.key)) {
            event.preventDefault();
            presetKeysRef.current.add(event.key);
        }
    }, [presetKeysRef]);
    const onKeyup = useCallback((event) => {
        if (listenToKeys.includes(event.key)) {
            event.preventDefault();
            presetKeysRef.current.delete(event.key);
        }
    }, [presetKeysRef]);
    const onScrollEnd = useCallback(() => {
        scrollDiffRef.current = [0, 0];
    }, [scrollDiffRef]);
    const onScroll = useCallback((event) => {
        event.preventDefault();

        scrollDiffRef.current = [event.deltaX, event.deltaY, event.ctrlKey];

        if (scrollEndIdRef.current) {
            window.clearTimeout(scrollEndIdRef.current);
        }

        scrollEndIdRef.current = window.setTimeout(onScrollEnd, 100);
    }, [onScrollEnd]);

    useEffect(() => {
        window.document.documentElement.addEventListener('keydown', onKeydown);
        window.document.documentElement.addEventListener('keyup', onKeyup);

        canvasEl?.addEventListener('wheel', onScroll);

        return () => {
            window.document.documentElement.removeEventListener('keydown', onKeydown);
            window.document.documentElement.removeEventListener('keyup', onKeyup);

            canvasEl?.removeEventListener('wheel', onScroll);
        };
    }, [onKeydown, onKeyup, canvasEl, onScroll]);

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

            const [scrollDx, scrollDy, scrollWithCtrl] = scrollDiffRef.current;

            if (dX || dY) {
                setOffset(([x, y]) => [x + dX, y + dY]);
            } else if (!scrollWithCtrl && (scrollDx || scrollDy)) {
                setOffset(([x, y]) => [x - scrollDx, y - scrollDy]);
            } else if (scrollWithCtrl) {
                setScale(s => s - scrollDx / 2 - scrollDy / 2);
            }

            prev = timestamp;
            id = window.requestAnimationFrame(move);
        });

        return () => {
            window.cancelAnimationFrame(id);
            prev = 0;
        };
    }, [presetKeysRef, setOffset, setScale]);
};
