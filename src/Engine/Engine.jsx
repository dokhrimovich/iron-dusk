import React, { useCallback, useEffect, useState } from 'react';
import { useGameCanvasContext } from 'Context/GameCanvasContext';
import { useGameStateContext, SWITCH_TO_BATTLE, SET_WHOSE_TURN } from 'Context/GameStateContext';

import { warrior } from 'GameElements/BattleCharacters/warrior';

import { useCellStates } from './useCellStates';
import { useGridLayer } from './Layers/useGridLayer';
import { useTerrainLayer } from './Layers/useTerrainLayer';
import { useSkeleton } from './useSkeleton';
import { useGetShortestPath } from './useGetShortestPath';

export const Engine = () => {
    const { teamAllys, dispatch } = useGameStateContext();

    const { canvas: { ctx, el: canvasEl, width, height } } = useGameCanvasContext();
    const skeleton = useSkeleton();
    const getShortestPath = useGetShortestPath();
    const { hoveredCell, lastClickedCell } = useCellStates({ skeleton, canvasEl });
    const [path, setPath] = useState();

    const gridLayer = useGridLayer({ skeleton, path, hoveredCell });
    const terrainLayer = useTerrainLayer({ skeleton });

    const clearCanvas = useCallback(() => {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, width, height);
    }, [ctx, width, height]);

    useEffect(() => {
        dispatch({
            type: SWITCH_TO_BATTLE,
            arena: 'arena01',
            teamAllys: [
                warrior([2, 1]),
                warrior([2, 2])
            ],
            teamEnemies: []
        });
    }, [dispatch]);

    useEffect(() => {
        if (!teamAllys?.length) {
            return;
        }

        dispatch({
            type: SET_WHOSE_TURN,
            whoseTurn: teamAllys[0].id
        });
    }, [teamAllys, dispatch]);

    useEffect(() => {
        let id = window.requestAnimationFrame(function draw() {
            if (!ctx) {
                return;
            }

            clearCanvas();

            terrainLayer.drawGround();
            gridLayer.drawGrid();
            terrainLayer.drawGroundTop();
            gridLayer.drawPath();

            id = window.requestAnimationFrame(draw);
        });

        return () => {
            window.cancelAnimationFrame(id);
        };
    }, [ctx, clearCanvas, gridLayer, terrainLayer, getShortestPath]);

    return teamAllys
        ?.filter(ally => ally?.Component)
        ?.map(ally => {
            const Component = ally?.Component;

            return <Component key={ally.key} setPath={setPath} lastClickedCell={lastClickedCell} />;
        });
};
