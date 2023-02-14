import { useMemo, useCallback } from 'react';
import { useResourcesContext } from 'Context/ResourcesContext';
import { useGameStateContext } from 'Context/GameStateContext';
import { useGameCanvasContext } from 'Context/GameCanvasContext';
import { COLOR } from '../constants';

export const useGridLayer = ({ skeleton, hoveredCell }) => {
    const { arena: arenaName, mainState, todoActionsList } = useGameStateContext();
    const { canvas: { ctx } } = useGameCanvasContext();
    const { maps } = useResourcesContext();
    const arena = mainState === 'BATTLE' ? maps[arenaName] : null;
    const moveAction = todoActionsList.find(a => a.type === 'MOVE');

    // const drawCircle = useCallback((x, y) => {
    //     ctx.strokeStyle = 'white';
    //     ctx.beginPath();
    //     ctx.moveTo(x, y);
    //     ctx.arc(x, y, 2, 0, Math.PI * 2);
    //     ctx.stroke();
    // }, [ctx]);
    // const drawText = useCallback((x, y, text) => {
    //     ctx.fillStyle = 'white';
    //     ctx.strokeStyle = 'black';
    //     ctx.font = '10px serif';
    //     ctx.fillText(text, x, y);
    // }, [ctx]);
    const drawCell = useCallback((col, { highlight }) => {
        const {
            top,
            topRight,
            bottomRight,
            bottom,
            bottomLeft,
            topLeft
        } = col;

        ctx.beginPath();
        ctx.moveTo(...top);
        ctx.lineTo(...topRight);
        ctx.lineTo(...bottomRight);
        ctx.lineTo(...bottom);
        ctx.lineTo(...bottomLeft);
        ctx.lineTo(...topLeft);
        ctx.closePath();

        ctx.strokeStyle = highlight ? COLOR.highlight : 'white';
        ctx.lineWidth = highlight ? 2 : 1;
        ctx.stroke();
    }, [ctx]);
    /**
     * @param cell contain array from starting cell to finish
     * Like 0(start) -> 1 -> 2 -> 3 -> 4(finish)
     * @param max - how many steps will be rendered as available
     * if max = 2, the available path will be from Like 0(start) -> 1 -> 2
     * and not available fom 2 -> 3 -> 4(finish)
     */
    const drawDottedPath = useCallback((cells, max) => {
        if (cells.length < 2) {
            return;
        }

        const availableSteps = cells.slice(0, max + 1);
        const nonAvailableSteps = [availableSteps.at(-1), ...cells.slice(max)];

        if (availableSteps.length > 1) {
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 3;
            ctx.setLineDash([3, 3]);
            ctx.beginPath();
            ctx.moveTo(...availableSteps[0]);
            availableSteps.forEach(cell => ctx.lineTo(...cell));

            ctx.stroke();
        }

        if (nonAvailableSteps.length > 1) {
            ctx.strokeStyle = '#BA2828';
            ctx.lineWidth = 3;
            ctx.setLineDash([3, 3]);
            ctx.beginPath();
            ctx.moveTo(...nonAvailableSteps[0]);
            nonAvailableSteps.forEach(cell => ctx.lineTo(...cell));

            ctx.stroke();
        }

        ctx.setLineDash([]);
        ctx.lineWidth = 1;
    }, [ctx]);

    const drawGrid = useCallback(() => {
        if (!ctx || !skeleton) {
            return;
        }

        skeleton.forEach((row, ri) => {
            row.forEach((col, ci) => {
                if (arena.isNoGoCell([ri, ci])) {
                    return;
                }

                drawCell(col, {
                    highlight: hoveredCell && hoveredCell[0] === ri && hoveredCell[1] === ci
                });
            });
        });
    }, [ctx, arena, skeleton, hoveredCell, drawCell]);

    const drawPath = useCallback(() => {
        if (!ctx || !skeleton || !moveAction) {
            return;
        }

        const pathCells = moveAction.cells.map(([ri, ci]) => skeleton[ri][ci].center);

        drawDottedPath(pathCells, moveAction.stepsLeft);
    }, [ctx, skeleton, moveAction, drawDottedPath]);

    return useMemo(() => ({
        drawGrid,
        drawPath
    }), [drawGrid, drawPath]);
};
