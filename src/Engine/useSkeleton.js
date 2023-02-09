import { useMemo } from 'react';
import { useResourcesContext } from 'Context/ResourcesContext';
import { useGameStateContext } from 'Context/GameStateContext';
import { useGameCanvasContext } from 'Context/GameCanvasContext';
import { getHexVerticesOffset } from 'utils/common';

export const useSkeleton = () => {
    const { maps } = useResourcesContext();
    const { arena: arenaName, mainState } = useGameStateContext();
    const { offset: [ displayOffsetX, displayOffsetY ], scale } = useGameCanvasContext();
    const arena = mainState === 'BATTLE' ? maps[arenaName] : null;

    return useMemo(() => {
        if (!arena) {
            return null;
        }

        return arena.groundLayer.map((row, ri) => row.map((col, ci) => {
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
    }, [arena, scale, displayOffsetX, displayOffsetY]);
};
