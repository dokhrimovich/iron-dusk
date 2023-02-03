import React, { useEffect, useCallback, useMemo, useState, useRef } from 'react';
import { throttle } from 'utils/common';
import { useCanvasKeyboardControl } from './useCanvasKeyboardControl';

import style from './ResizableCanvas.scss';

const useCanvas = ({ containerRef }) => {
    const [ctx, setCtx] = useState();
    const [canvasEl, setCanvas] = useState();
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

    const canvasRef = useCallback(node => {
        if (node !== null) {
            setCtx(node.getContext('2d'));
            setCanvas(node);
        }
    }, []);

    const resizeCanvas = useCallback((containerEl) => {
        if (!canvasEl) {
            return;
        }

        const ratio = 3 / 4;
        const containerRect = containerEl.getBoundingClientRect();
        const { width: w, height: h } = containerRect;
        const screenWidthToBig = w * ratio > h;

        const canvasW = screenWidthToBig ? h / ratio : w;
        const canvasH = screenWidthToBig ? h : w * ratio;

        canvasEl.width = Math.round(canvasW);
        canvasEl.height = Math.round(canvasH);

        setWidth(canvasEl.width);
        setHeight(canvasEl.height);
    }, [canvasEl, setWidth, setHeight]);

    const onResize = useCallback(() => resizeCanvas(containerRef.current), [resizeCanvas, containerRef]);
    const throttledOnResize = useMemo(() => throttle(onResize, 3000), [onResize]);

    useEffect(() => {
        resizeCanvas(containerRef.current);
        window.addEventListener('resize', throttledOnResize);

        return () => {
            window.removeEventListener('resize', throttledOnResize);
        };
    }, [resizeCanvas, throttledOnResize]);

    return { containerRef, canvasRef, ctx, canvasEl, width, height };
};

export const ResizableCanvas = ({ setCanvas, setOffset, setScale }) => {
    const containerRef = useRef();
    const { canvasRef, ctx, canvasEl, width, height } = useCanvas({ containerRef });

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
