import React, { useCallback, useEffect } from 'react';
import { useGameCanvasContext } from 'Context/GameCanvasContext';
import { useGameStateContext } from 'Context/GameStateContext';

import { warrior, beast } from 'GameElements/BattleCharacters';

import { useCellStates } from './useCellStates';
import { useGridLayer } from './Layers/useGridLayer';
import { useTerrainLayer } from './Layers/useTerrainLayer';
import { useSkeleton } from './useSkeleton';
import { useExecuteActions } from './Actions';

export const Engine = () => {
    const { teamAllys, switchToBattle } = useGameStateContext();
    const { canvas: { ctx, el: canvasEl, width, height } } = useGameCanvasContext();

    const skeleton = useSkeleton();
    const executeActions = useExecuteActions();
    const { hoveredCell, lastClickedCell } = useCellStates({ skeleton, canvasEl });

    const gridLayer = useGridLayer({ skeleton, hoveredCell });
    const terrainLayer = useTerrainLayer({ skeleton });

    const clearCanvas = useCallback(() => {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, width, height);
    }, [ctx, width, height]);

    useEffect(() => {
        switchToBattle({
            arena: 'arena01',
            teamAllys: [
                warrior([2, 1]),
                warrior([2, 2])
            ],
            teamEnemies: [
                beast([7, 3])
            ]
        });
    }, [switchToBattle]);

    useEffect(() => {
        let id = window.requestAnimationFrame(function draw(timestamp) {
            if (!ctx) {
                return;
            }

            clearCanvas();

            terrainLayer.drawGround(timestamp);
            gridLayer.drawGrid(timestamp);
            terrainLayer.drawGroundTop(timestamp);
            gridLayer.drawPath(timestamp);

            id = window.requestAnimationFrame(draw);
        });

        return () => {
            window.cancelAnimationFrame(id);
        };
    }, [ctx, clearCanvas, gridLayer, terrainLayer]);

    return teamAllys
        ?.filter(ally => ally?.Component)
        ?.map(ally => {
            const Component = ally?.Component;

            return <Component key={ally.key} executeActions={executeActions} lastClickedCell={lastClickedCell} />;
        });
};
