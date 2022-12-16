import { useCallback, useEffect, useState, useMemo } from 'react';
import { throttle } from 'utils/common';
import { useFindClosesCell } from './useFindClosesCell';

export const useCellStates = ({ skeleton, map, canvas, scale }) => {
    const [hoveredCell, setHoveredCell] = useState(null);
    const [clickedCell, setClickedCell] = useState(null);
    const [fromCell, setFromCell] = useState(null);
    const [toCell, setToCell] = useState(null);

    const findClosesCell = useFindClosesCell(skeleton, scale);
    const cellEq = (c1, c2) => c1 && c2 && c1[0] === c2[0] && c1[1] === c2[1]
        || c1 === c2;
    const isNoGo = useCallback(([ri, ci]) => map[ri][ci] === 0, [map]);

    const onClick = useCallback((event) => {
        const { left, top } = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - left;
        const y = event.clientY - top;
        const cell = findClosesCell(x, y);

        if (!cell || isNoGo(cell)) {
            return;
        }

        if (cellEq(cell, clickedCell)) {
            setFromCell(null);
            setToCell(null);
            setClickedCell(null);

            return;
        }

        setClickedCell(cell);

        if (fromCell) {
            setToCell(cell);
        } else {
            setFromCell(cell);
        }
    }, [clickedCell, fromCell, setClickedCell, setToCell, setFromCell, findClosesCell, isNoGo]);

    const onHover = useCallback((event) => {
        const { left, top } = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - left;
        const y = event.clientY - top;

        const cell = findClosesCell(x, y);

        if (!cell || isNoGo(cell)) {
            setHoveredCell(null);
        }

        setHoveredCell(cell);
    }, [setHoveredCell, findClosesCell, isNoGo]);
    const throttledHover = useMemo(() => throttle(onHover, 100), [onHover]);

    useEffect(() => {
        if (!canvas) {
            return;
        }

        canvas?.addEventListener?.('click', onClick);

        return () => {
            canvas?.removeEventListener?.('click', onClick);
        };
    }, [onClick, canvas]);

    useEffect(() => {
        if (!canvas) {
            return;
        }

        canvas?.addEventListener?.('mousemove', throttledHover);

        return () => {
            canvas?.removeEventListener?.('mousemove', throttledHover);
        };
    }, [throttledHover, canvas]);

    return useMemo(() => ({
        hoveredCell,
        clickedCell,
        fromCell,
        toCell
    }), [hoveredCell, clickedCell, fromCell, toCell]);
};
