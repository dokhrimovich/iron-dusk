import { useMemo, useCallback } from 'react';
import { useResourcesContext } from 'Context/ResourcesContext';
import { useGameStateContext } from 'Context/GameStateContext';
import { useGameCanvasContext } from 'Context/GameCanvasContext';
import { COLOR } from '../constants';

export const useGridLayer = ({ skeleton, hoveredCell, path }) => {
    const { arena: arenaName, mainState } = useGameStateContext();
    const { canvas: { ctx } } = useGameCanvasContext();
    const { maps } = useResourcesContext();
    const arena = mainState === 'BATTLE' ? maps[arenaName] : null;

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
    const drawDottedPath = useCallback((cells) => {
        if (cells.length < 2) {
            return;
        }

        ctx.strokeStyle = 'white';
        ctx.lineWidth = 3;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(...cells[0]);
        cells.forEach(cell => ctx.lineTo(...cell));

        ctx.stroke();

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
        if (!ctx || !skeleton || !path || !path.length) {
            return;
        }

        const pathCells = path.map(([ri, ci]) => skeleton[ri][ci].center);

        drawDottedPath(pathCells);
    }, [ctx, skeleton, path, drawDottedPath]);

    return useMemo(() => ({
        drawGrid,
        drawPath
    }), [drawGrid, drawPath]);
};
