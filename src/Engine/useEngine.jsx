import { useCallback, useEffect, useMemo } from 'react';
import { getHexVerticesOffset } from 'utils/common';
import { useDisplayOffsetKeyboardControl } from './useDisplayOffsetKeyboardControl';

const map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

const SCALE = 50;

const useSkeleton = (scale, displayOffsetX, displayOffsetY) => {
    return useMemo(() => {
        return map.map((row, ri) => row.map((col, ci) => {
            const {
                center: [x, y],
                top: [topX, topY],
                topRight: [topRightX, topRightY],
                bottomRight: [bottomRightX, bottomRightY],
                bottom: [bottomX, bottomY],
                bottomLeft: [bottomLeftX, bottomLeftY],
                topLeft: [topLeftX, topLeftY]
            } = getHexVerticesOffset(ri, ci);

            return {
                center: [x * scale + displayOffsetX, y * scale + displayOffsetY],
                top: [topX * scale + displayOffsetX, topY * scale + displayOffsetY],
                topRight: [topRightX * scale + displayOffsetX, topRightY * scale + displayOffsetY],
                bottomRight: [bottomRightX * scale + displayOffsetX, bottomRightY * scale + displayOffsetY],
                bottom: [bottomX * scale + displayOffsetX, bottomY * scale + displayOffsetY],
                bottomLeft: [bottomLeftX * scale + displayOffsetX, bottomLeftY * scale + displayOffsetY],
                topLeft: [topLeftX * scale + displayOffsetX, topLeftY * scale + displayOffsetY]
            };
        }));
    }, [displayOffsetX, displayOffsetY]);
};


export const useEngine = (ctx, width, height) => {
    const [displayOffsetX, displayOffsetY] = useDisplayOffsetKeyboardControl();
    const skeleton = useSkeleton(SCALE, displayOffsetX, displayOffsetY);
    const drawCircle = useCallback((x, y) => {
        ctx.strokeStyle = 'white';
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.stroke();
    }, [ctx]);
    const drawText = useCallback((x, y, text) => {
        ctx.fillStyle  = 'white';
        ctx.strokeStyle = 'black';
        ctx.font = '10px serif';
        ctx.fillText(text, x, y);
    }, [ctx]);
    const drawHex = useCallback((col) => {
        const {
            top,
            topRight,
            bottomRight,
            bottom,
            bottomLeft,
            topLeft
        } = col;

        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;
        ctx.moveTo(...top);
        ctx.lineTo(...topRight);
        ctx.lineTo(...bottomRight);
        ctx.lineTo(...bottom);
        ctx.lineTo(...bottomLeft);
        ctx.lineTo(...topLeft);
        ctx.lineTo(...top);
        ctx.stroke();
    }, [ctx]);
    const clearCanvas = useCallback((w, h) => {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, w, h);
    }, [ctx]);

   useEffect(() => {
        let id;

        id = window.requestAnimationFrame(function draw() {
            if (!ctx) {
                return;
            }

            clearCanvas(width, height);

            skeleton.forEach((row, ri) => {
                row.forEach((col, ci) => {
                    const { center: [x, y] } = col;

                    drawCircle(x, y);
                    drawText(x + 5, y - 5, `[${ri}:${ci}]`);
                    drawHex(col);
                })
            });
            id = window.requestAnimationFrame(draw);
        });

        return () => {
            window.cancelAnimationFrame(id);
        }
    }, [ctx, width, height, displayOffsetX, displayOffsetY]);
};
