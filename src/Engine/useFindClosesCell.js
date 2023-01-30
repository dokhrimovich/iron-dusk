import { useCallback, useContext } from 'react';
import { GameCanvasContext } from 'GameCanvasContext';

export const useFindClosesCell = (skeleton) => {
    const { scale } = useContext(GameCanvasContext);

    return useCallback((x, y) => {
        let min = Number.MAX_VALUE;
        let closestCell;

        skeleton.forEach((row, ri) => {
            row.forEach((col, ci) => {
                const { center: [cx, cy] } = col;
                const sqSum = (cx - x)**2 + (cy - y)**2;

                if (sqSum < min) {
                    min = sqSum;
                    closestCell = [ri, ci];
                }
            });
        });

        if (Math.sqrt(min) > scale) {
            return null;
        }

        return closestCell;
    }, [skeleton, scale]);
};
