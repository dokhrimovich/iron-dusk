import { useCallback, useEffect, useMemo } from 'react';
import { getHexVerticesOffset } from 'utils/common';
import { useDisplayOffsetKeyboardControl } from './useDisplayOffsetKeyboardControl';
import { useCellStates } from './useCellStates';
import { useGrid } from './useGrid';
import { useGetShortestPath } from './useGetShortestPath';

const map = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ,0, 0, 0, 0 ,0],
    [1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1],
    [1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ,0, 0, 0, 0 ,0]
];

const SCALE = 50;

const useSkeleton = (scale, displayOffsetX, displayOffsetY) => {
    return useMemo(() => {
        return map.map((row, ri) => row.map((col, ci) => {
            const {
                center: [x, y],
                top: [topX, topY],
                topRight: [topRightX, topRightY],
                bottomRight: [bottomRightX, bottomRightY],
                bottom: [bottomX, bottomY],
                bottomLeft: [bottomLeftX, bottomLeftY],
                topLeft: [topLeftX, topLeftY]
            } = getHexVerticesOffset(ri, ci);

            return {
                center: [x * scale + displayOffsetX, y * scale + displayOffsetY],
                top: [topX * scale + displayOffsetX, topY * scale + displayOffsetY],
                topRight: [topRightX * scale + displayOffsetX, topRightY * scale + displayOffsetY],
                bottomRight: [bottomRightX * scale + displayOffsetX, bottomRightY * scale + displayOffsetY],
                bottom: [bottomX * scale + displayOffsetX, bottomY * scale + displayOffsetY],
                bottomLeft: [bottomLeftX * scale + displayOffsetX, bottomLeftY * scale + displayOffsetY],
                topLeft: [topLeftX * scale + displayOffsetX, topLeftY * scale + displayOffsetY]
            };
        }));
    }, [scale, displayOffsetX, displayOffsetY]);
};

export const useEngine = ({ ctx, canvas, width, height }) => {
    const [displayOffsetX, displayOffsetY] = useDisplayOffsetKeyboardControl();
    const skeleton = useSkeleton(SCALE, displayOffsetX, displayOffsetY);
    const getShortestPath = useGetShortestPath({ map });
    const { clickedCell, hoveredCell, fromCell, toCell } = useCellStates({ skeleton, map, canvas, scale: SCALE });

    const grid = useGrid({ ctx, skeleton, map, clickedCell, hoveredCell, fromCell, toCell });

    const clearCanvas = useCallback(() => {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, width, height);
    }, [ctx, width, height]);

    useEffect(() => {
        // todo WIP
        window.getShortestPath = getShortestPath;

        let id = window.requestAnimationFrame(function draw() {
            if (!ctx) {
                return;
            }

            clearCanvas();

            grid.draw();

            id = window.requestAnimationFrame(draw);
        });

        return () => {
            window.cancelAnimationFrame(id);
        };
    }, [ctx, clearCanvas, grid, getShortestPath]);
};
