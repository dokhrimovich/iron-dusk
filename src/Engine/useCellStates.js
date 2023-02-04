import { useCallback, useEffect, useState, useMemo } from 'react';
import { throttle } from 'utils/common';
import { useResourcesContext } from 'Context/ResourcesContext';

import { useFindClosesCell } from './useFindClosesCell';

export const useCellStates = ({ skeleton, canvasEl }) => {
    const { maps: { arena01: arena } } = useResourcesContext();

    const [hoveredCell, setHoveredCell] = useState(null);
    const [clickedCell, setClickedCell] = useState(null);
    const [fromCell, setFromCell] = useState(null);
    const [toCell, setToCell] = useState(null);

    const findClosesCell = useFindClosesCell(skeleton);
    const cellEq = (c1, c2) => c1 && c2 && c1[0] === c2[0] && c1[1] === c2[1]
        || c1 === c2;
    const isNoGo = useCallback(([ri, ci]) => {
        const groundCode = arena.groundLayer[ri][ci];
        const terrainCode = arena.terrainLayer[ri][ci];

        return groundCode === 0 || arena.noGoCodes.includes(groundCode) || arena.noGoCodes.includes(terrainCode);
    }, [arena]);

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
        canvasEl?.addEventListener?.('click', onClick);

        return () => {
            canvasEl?.removeEventListener?.('click', onClick);
        };
    }, [onClick, canvasEl]);

    useEffect(() => {
        canvasEl?.addEventListener?.('mousemove', throttledHover);

        return () => {
            canvasEl?.removeEventListener?.('mousemove', throttledHover);
        };
    }, [throttledHover, canvasEl]);

    return useMemo(() => ({
        hoveredCell,
        clickedCell,
        fromCell,
        toCell
    }), [hoveredCell, clickedCell, fromCell, toCell]);
};
