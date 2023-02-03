import { useMemo, useContext } from 'react';
import { GameCanvasContext } from 'GameCanvasContext';
import { ResourcesContext } from 'ResourcesContext';
import { getHexVerticesOffset } from 'utils/common';

export const useSkeleton = () => {
    const { maps: { arena01: arena } } = useContext(ResourcesContext);
    const { offset: [ displayOffsetX, displayOffsetY ], scale } = useContext(GameCanvasContext);

    return useMemo(() => {
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
