import { useMemo, useCallback } from 'react';
import { COLOR } from './constants';

export const useGrid = ({ ctx, map, skeleton, clickedCell, hoveredCell, fromCell, toCell, path }) => {
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

        if (color) {
            ctx.fillStyle = color;
            ctx.fill();
        }

        if (showCenter) {
            drawCircle(...center);
        }
    }, [ctx, drawCircle]);
    const drawPath = useCallback((cells) => {
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
        const isNoGoCell = map[ri][ci] === 0;

        if (isNoGoCell) {
            return COLOR.nogo;
        }

        if (fromCell && fromCell[0] === ri && fromCell[1] === ci) {
            return COLOR.from;
        }

        if (toCell && toCell[0] === ri && toCell[1] === ci) {
            return COLOR.to;
        }

        return null;
    }, [map, fromCell, toCell]);

    const draw = useCallback(() => {
        if (!ctx) {
            return;
        }

        skeleton.forEach((row, ri) => {
            row.forEach((col, ci) => {
                const { center: [x, y] } = col;

                drawCell(col, {
                    highlight: hoveredCell && hoveredCell[0] === ri && hoveredCell[1] === ci,
                    showCenter: clickedCell && clickedCell[0] === ri && clickedCell[1] === ci,
                    color: getColor(ri, ci)
                });

                drawText(x + 5, y - 5, `[${ri}:${ci}]`);
            });
        });

        if (path && path.length) {
            const pathCells = path.map(([ri, ci]) => skeleton[ri][ci].center);

            drawPath(pathCells);
        }
    }, [ctx, skeleton, clickedCell, hoveredCell, path, drawCell, drawText, drawPath, getColor]);

    return useMemo(() => ({
        draw
    }), [draw]);
};
