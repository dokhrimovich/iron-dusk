import { useCallback, useEffect, useState, useMemo } from 'react';
import { throttle } from 'utils/common';
import { useGameStateContext } from 'Context/GameStateContext';
import { useResourcesContext } from 'Context/ResourcesContext';

import { useFindClosesCell } from './useFindClosesCell';

export const useCellStates = ({ skeleton, canvasEl }) => {
    const { arena: arenaName, mainState } = useGameStateContext();
    const { maps } = useResourcesContext();
    const arena = mainState === 'BATTLE' ? maps[arenaName] : null;

    const [hoveredCell, setHoveredCell] = useState(null);
    const [lastClickedCell, setLastClickedCell] = useState(null);

    const findClosesCell = useFindClosesCell(skeleton);

    const onClick = useCallback((event) => {
        event.preventDefault();

        const { left, top } = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - left;
        const y = event.clientY - top;
        const cell = findClosesCell(x, y);

        if (!cell || arena.isNoGoCell(cell)) {
            return;
        }

        setLastClickedCell({ cell, timeStamp: Date.now() });
    }, [arena, setLastClickedCell, findClosesCell]);

    const onHover = useCallback((event) => {
        const { left, top } = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - left;
        const y = event.clientY - top;

        const cell = findClosesCell(x, y);

        if (!cell || arena.isNoGoCell(cell)) {
            setHoveredCell(null);
        }

        setHoveredCell(cell);
    }, [arena, setHoveredCell, findClosesCell]);
    const throttledHover = useMemo(() => throttle(onHover, 100), [onHover]);

    useEffect(() => {
        if (!skeleton) {
            return;
        }

        canvasEl?.addEventListener?.('click', onClick);

        return () => {
            canvasEl?.removeEventListener?.('click', onClick);
        };
    }, [onClick, canvasEl, skeleton]);

    useEffect(() => {
        if (!skeleton) {
            return;
        }

        canvasEl?.addEventListener?.('mousemove', throttledHover);

        return () => {
            canvasEl?.removeEventListener?.('mousemove', throttledHover);
        };
    }, [throttledHover, canvasEl, skeleton]);

    return useMemo(() => ({
        hoveredCell,
        lastClickedCell
    }), [hoveredCell, lastClickedCell]);
};
