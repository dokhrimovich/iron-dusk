import { useCallback, useEffect } from 'react';
import { getOffset } from 'utils/common';
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

const scale = 50;

export const useEngine = (ctx, width, height) => {
    const [displayOffsetX, displayOffsetY] = useDisplayOffsetKeyboardControl();
    const drawCircle = useCallback((x, y) => {
        ctx.strokeStyle = 'white';
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.stroke();
    }, [ctx]);
    const clearCanvas = useCallback((w, h) => {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, w, h);
    }, [ctx]);
   //
   // useEffect(() => {
   //      if (!ctx) {
   //          return;
   //      }
   //
   //      map.forEach((columnsInRow, rowI) => {
   //          columnsInRow.forEach((col, colI) => {
   //              const [x, y] = getOffset(rowI, colI);
   //
   //              drawCircle(x * scale + displayOffsetX, y * scale + displayOffsetY);
   //          })
   //      });
   //  }, [ctx]);

   useEffect(() => {
        let id;

        id = window.requestAnimationFrame(function draw() {
            if (!ctx) {
                return;
            }

            clearCanvas(width, height);

            map.forEach((columnsInRow, rowI) => {
                columnsInRow.forEach((col, colI) => {
                    const [x, y] = getOffset(rowI, colI);

                    drawCircle(x * scale + displayOffsetX, y * scale + displayOffsetY);
                })
            });
            id = window.requestAnimationFrame(draw);
        });

        return () => {
            window.cancelAnimationFrame(id);
        }
    }, [ctx, width, height, displayOffsetX, displayOffsetY]);

};
