import { useMemo, useCallback } from 'react';
import { useResourcesContext } from 'Context/ResourcesContext';
import { useGameCanvasContext } from 'Context/GameCanvasContext';
import { COLOR } from '../constants';

export const useGrid = ({ skeleton, clickedCell, hoveredCell, fromCell, toCell, path }) => {
    const { canvas: { ctx } } = useGameCanvasContext();
    const { maps: { arena01: arena } } = useResourcesContext();

    const isNoGoCell = useCallback((ri, ci) => {
        const groundCode = arena.groundLayer[ri][ci];
        const terrainCode = arena.terrainLayer[ri][ci];

        return groundCode === 0 || arena.noGoCodes.includes(groundCode) || arena.noGoCodes.includes(terrainCode);
    }, [arena]);
    const drawCircle = useCallback((x, y) => {
        ctx.strokeStyle = 'white';
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.stroke();
    }, [ctx]);
    const drawText = useCallback((x, y, text) => {
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.font = '10px serif';
        ctx.fillText(text, x, y);
    }, [ctx]);
    const drawCell = useCallback((col, { highlight, color, showCenter }) => {
        const {
            top,
            topRight,
            bottomRight,
            bottom,
            bottomLeft,
            topLeft,
            center
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

        // if (color) {
        //     ctx.fillStyle = color;
        //     ctx.fill();
        // }

        if (showCenter) {
            drawCircle(...center);
        }
    }, [ctx, drawCircle]);
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

    const getColor = useCallback((ri, ci) => {
        if (isNoGoCell(ri, ci)) {
            return COLOR.nogo;
        }

        if (fromCell && fromCell[0] === ri && fromCell[1] === ci) {
            return COLOR.from;
        }

        if (toCell && toCell[0] === ri && toCell[1] === ci) {
            return COLOR.to;
        }

        return null;
    }, [isNoGoCell, fromCell, toCell]);

    const drawGrid = useCallback(() => {
        if (!ctx) {
            return;
        }

        skeleton.forEach((row, ri) => {
            row.forEach((col, ci) => {
                const { center: [x, y] } = col;

                if (isNoGoCell(ri, ci)) {
                    return;
                }

                drawCell(col, {
                    highlight: hoveredCell && hoveredCell[0] === ri && hoveredCell[1] === ci,
                    showCenter: clickedCell && clickedCell[0] === ri && clickedCell[1] === ci,
                    color: getColor(ri, ci)
                });

                drawText(x + 5, y - 5, `[${ri}:${ci}]`);
            });
        });
    }, [ctx, isNoGoCell, skeleton, clickedCell, hoveredCell, drawCell, drawText, getColor]);

    const drawPath = useCallback(() => {
        if (!ctx) {
            return;
        }

        if (path && path.length) {
            const pathCells = path.map(([ri, ci]) => skeleton[ri][ci].center);

            drawDottedPath(pathCells);
        }
    }, [ctx, skeleton, path, drawDottedPath]);

    return useMemo(() => ({
        drawGrid,
        drawPath
    }), [drawGrid, drawPath]);
};
