import React, { useEffect, useCallback, useRef, useMemo, useState } from 'react';
import { throttle } from 'utils/common';
import { useEngine } from 'Engine'

import style from './GameCanvas.scss';

const useCanvasContext = () => {
    const [containerRect, setContainerRect] = useState();
    const [ctx, setCtx] = useState();
    const [canvas, setCanvas] = useState();
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
        if (!canvas || !containerRect) {
            return;
        }

        const ratio = 3 / 4;
        const { width, height } = containerRect;
        const screenWidthToBig = width * ratio > height;

        const canvasW = screenWidthToBig ? height / ratio : width;
        const canvasH = screenWidthToBig ? height : width * ratio;

        canvas.width = Math.round(canvasW);
        canvas.height = Math.round(canvasH);

        setWidth(canvas.width);
        setHeight(canvas.height);
    }, [canvas, containerRect, setWidth, setHeight]);

    const throttledResize = useMemo(() => throttle(resize, 3000), [resize]);

    useEffect(() => {
        resize();
        window.addEventListener('resize', throttledResize);

        return () => {
            window.removeEventListener('resize', throttledResize);
        }
    }, [resize, throttledResize]);

    return { containerRef, canvasRef, ctx, width, height };
};

export const GameCanvas = () => {
    const { containerRef, canvasRef, ctx, width, height } = useCanvasContext();

    // const canvasRef = useRef();
    // const containerRef = useRef();
    // const resize = useCallback(() => {
    //     const ratio = 3 / 4;
    //     const { width, height } = containerRef.current.getBoundingClientRect();
    //     const screenWidthToBig = width * ratio > height;
    //
    //     const canvasW = screenWidthToBig ? height / ratio : width;
    //     const canvasH = screenWidthToBig ? height : width * ratio;
    //
    //     canvasRef.current.width = Math.round(canvasW);
    //     canvasRef.current.height = Math.round(canvasH);
    // }, [canvasRef, containerRef]);
    // useEffect(() => {
    //     resize();
    //     window.addEventListener('resize', throttledResize);
    //
    //     return () => {
    //         window.removeEventListener('resize', throttledResize);
    //     }
    // });

    useEngine(ctx, width, height);

    return (
        <div ref={containerRef} className={style.container}>
            <canvas ref={canvasRef} />
        </div>
    );
};
