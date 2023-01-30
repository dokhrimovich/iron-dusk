import { useCallback, useEffect, useState, useContext } from 'react';
import { GameCanvasContext } from 'GameCanvasContext';

import { useCellStates } from './useCellStates';
import { useGrid } from './useGrid';
import { useTerrain } from './useTerrain';
import { useSkeleton } from './useSkeleton';
import { useGetShortestPath } from './useGetShortestPath';

const map = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ,0, 0, 0, 0 ,0],
    [2, 2, 2, 2, 2, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1],
    [1, 1, 2, 2, 2, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 2, 1, 1, 1, 2, 2, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 0, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ,0, 0, 0, 0 ,0]
];
const enteties = [{
    type: 1,
    coord: [2, 1]
}, {
    type: 1,
    coord: [2, 2]
}];

export const Engine = () => {
    const { canvas: { ctx, el: canvasEl, width, height } } = useContext(GameCanvasContext);
    const skeleton = useSkeleton({ map });
    const getShortestPath = useGetShortestPath({ map });
    const { clickedCell, hoveredCell, fromCell, toCell } = useCellStates({ skeleton, map, canvasEl });
    const [path, setPath] = useState();

    const grid = useGrid({ skeleton, map, clickedCell, hoveredCell, fromCell, toCell, path });
    const terrain = useTerrain({ skeleton, map, enteties });

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
            grid.draw();
            terrain.drawGrass();

            id = window.requestAnimationFrame(draw);
        });

        return () => {
            window.cancelAnimationFrame(id);
        };
    }, [ctx, clearCanvas, grid, terrain, getShortestPath]);

    return null;
};
