import { useCallback, useEffect, useState } from 'react';

export const useClickOnCell = ({ skeleton, canvas, scale }) => {
    const [cell, setCell] = useState(null);
    const onClick = useCallback((event) => {
        const { left, top } = event.currentTarget.getBoundingClientRect();
        const clickX = event.clientX - left;
        const clickY = event.clientY - top;
        let min = Number.MAX_VALUE;
        let closestCell;

        skeleton.forEach((row, ri) => {
            row.forEach((col, ci) => {
                const { center: [x, y] } = col;
                const sqSum = (x - clickX)**2 + (y - clickY)**2;

                if (sqSum < min) {
                    min = sqSum;
                    closestCell = [ri, ci];
                }
            });
        });

        if (Math.sqrt(min) > scale) {
            closestCell = null;
        }

        setCell(closestCell);
    }, [skeleton, setCell]);

    useEffect(() => {
        if (!canvas) {
            return;
        }

        canvas?.addEventListener?.('click', onClick);

        return () => {
            canvas?.removeEventListener?.('click', onClick);
        }
    }, [onClick, canvas]);

    return cell;
};
