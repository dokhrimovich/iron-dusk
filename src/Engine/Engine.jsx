import { useCallback, useEffect, useState } from 'react';
import { useGameCanvasContext } from 'Context/GameCanvasContext';

import { useCellStates } from './useCellStates';
import { useGrid } from './Layers/useGrid';
import { useTerrain } from './Layers/useTerrain';
import { useSkeleton } from './useSkeleton';
import { useGetShortestPath } from './useGetShortestPath';

const enteties = [{
    type: 1,
    coord: [2, 1]
}, {
    type: 1,
    coord: [2, 2]
}];

export const Engine = () => {
    const { canvas: { ctx, el: canvasEl, width, height } } = useGameCanvasContext();
    const skeleton = useSkeleton();
    const getShortestPath = useGetShortestPath();
    const { clickedCell, hoveredCell, fromCell, toCell } = useCellStates({ skeleton, canvasEl });
    const [path, setPath] = useState();

    const grid = useGrid({ skeleton, clickedCell, hoveredCell, fromCell, toCell, path });
    const terrain = useTerrain({ skeleton, enteties });

    const clearCanvas = useCallback(() => {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, width, height);
    }, [ctx, width, height]);

    useEffect(() => {
        let isMounted = true;

        if (!fromCell || !toCell) {
            setPath(null);

            return;
        }

        (async () => {
            const { path: shortestPath } = await getShortestPath(fromCell, toCell);

            isMounted && setPath(shortestPath);
        })();

        return () => {
            isMounted = false;
        };
    }, [fromCell, toCell, setPath, getShortestPath]);

    useEffect(() => {
        let id = window.requestAnimationFrame(function draw() {
            if (!ctx) {
                return;
            }

            clearCanvas();

            terrain.drawGround();
            grid.drawGrid();
            terrain.drawGroundTop();
            grid.drawPath();

            id = window.requestAnimationFrame(draw);
        });

        return () => {
            window.cancelAnimationFrame(id);
        };
    }, [ctx, clearCanvas, grid, terrain, getShortestPath]);

    return null;
};
