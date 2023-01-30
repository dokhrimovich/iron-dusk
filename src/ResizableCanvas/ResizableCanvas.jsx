import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { throttle } from 'utils/common';
import { useCanvasKeyboardControl } from './useCanvasKeyboardControl';

import style from './ResizableCanvas.scss';

const useCanvas = () => {
    const [containerRect, setContainerRect] = useState();
    const [ctx, setCtx] = useState();
    const [canvasEl, setCanvas] = useState();
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const containerRef = useCallback(node => {
        if (node !== null) {
            setContainerRect(node.getBoundingClientRect());
        }
    }, []);
    const canvasRef = useCallback(node => {
        if (node !== null) {
            setCtx(node.getContext('2d'));
            setCanvas(node);
        }
    }, []);

    const resize = useCallback(() => {
        if (!canvasEl || !containerRect) {
            return;
        }

        const ratio = 3 / 4;
        const { width: w, height: h } = containerRect;
        const screenWidthToBig = w * ratio > h;

        const canvasW = screenWidthToBig ? h / ratio : w;
        const canvasH = screenWidthToBig ? h : w * ratio;

        canvasEl.width = Math.round(canvasW);
        canvasEl.height = Math.round(canvasH);

        setWidth(canvasEl.width);
        setHeight(canvasEl.height);
    }, [canvasEl, containerRect, setWidth, setHeight]);

    const throttledResize = useMemo(() => throttle(resize, 3000), [resize]);

    useEffect(() => {
        resize();
        window.addEventListener('resize', throttledResize);

        return () => {
            window.removeEventListener('resize', throttledResize);
        };
    }, [resize, throttledResize]);

    return { containerRef, canvasRef, ctx, canvasEl, width, height };
};

export const ResizableCanvas = ({ setCanvas, setOffset, setScale }) => {
    const { containerRef, canvasRef, ctx, canvasEl, width, height } = useCanvas();

    useCanvasKeyboardControl({ canvasEl, setOffset, setScale });

    useEffect(() => {
        setCanvas({
            ctx, el: canvasEl, width, height
        });
    }, [setCanvas, ctx, canvasEl, width, height]);

    return (
        <div ref={containerRef} className={style.container}>
            <canvas ref={canvasRef} />
        </div>
    );
};
