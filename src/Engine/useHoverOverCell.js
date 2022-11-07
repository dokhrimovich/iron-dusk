import { useCallback, useEffect, useState, useMemo } from 'react';
import { throttle } from 'utils/common';
import { useFindClosesCell } from './useFindClosesCell';

export const useHoverOverCell = ({ skeleton, canvas, scale }) => {
    const [cell, setCell] = useState(null);
    const findClosesCell = useFindClosesCell(skeleton, scale);

    const onHover = useCallback((event) => {
        const { left, top } = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - left;
        const y = event.clientY - top;

        setCell(findClosesCell(x, y));
    }, [setCell, findClosesCell]);
    const throttledHover = useMemo(() => throttle(onHover, 100), [onHover]);

    useEffect(() => {
        if (!canvas) {
            return;
        }

        canvas?.addEventListener?.('mousemove', throttledHover);

        return () => {
            canvas?.removeEventListener?.('mousemove', throttledHover);
        }
    }, [throttledHover, canvas]);

    return cell;
};
