import { useState, useCallback } from 'react';
import { useIsMounted } from 'common/useIsMounted';

export const useGameCanvas = () => {
    const isMounted = useIsMounted();
    const [canvas, setCanvas] = useState({});
    const setCanvasSafe = useCallback((val) => {
        isMounted() && setCanvas(val);
    }, [isMounted, setCanvas]);

    return { canvas, setCanvas: setCanvasSafe };
};

const defaultDisplayOffsetX = 10;
const defaultDisplayOffsetY = 400;

export const useOffset = () => {
    const isMounted = useIsMounted();
    const [offset, setOffset] = useState([defaultDisplayOffsetX, defaultDisplayOffsetY]);
    const setOffsetSafe = useCallback((val) => {
        isMounted() && setOffset(val);
    }, [isMounted, setOffset]);

    return { offset, setOffset: setOffsetSafe };
};

const defaultScale = 50;
const minScale = 25;
const maxScale = 75;

export const useScale = () => {
    const isMounted = useIsMounted();
    const [scale, setScale] = useState(defaultScale);
    const setScaleSafe = useCallback((val) => {
        if (!isMounted()) {
            return;
        }

        if (typeof val === 'number' && val > minScale && val < maxScale) {
            setScale(val);

            return;
        }

        if (typeof val === 'function') {
            setScale((prev) => {
                const newVal = val(prev);

                return newVal > minScale && newVal < maxScale ? newVal : prev;
            });
        }
    }, [isMounted]);

    return { scale, setScale: setScaleSafe };
};
