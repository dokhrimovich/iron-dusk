import { useMemo, useCallback } from 'react';
import { cellEq } from 'utils/map';

import { useResourcesContext } from 'Context/ResourcesContext';
import { useGameStateContext } from 'Context/GameStateContext';
import { useGameCanvasContext } from 'Context/GameCanvasContext';
import { safeDrawImage } from 'utils/common';

export const useTerrainLayer = ({ skeleton }) => {
    const { canvas: { ctx }, scale } = useGameCanvasContext();
    const { arena: arenaName, mainState, teamAllys, whoseTurn } = useGameStateContext();
    const { images, maps } = useResourcesContext();
    const arena = mainState === 'BATTLE' ? maps[arenaName] : null;

    const findGroundImage = useCallback((ri, ci) => {
        const code = arena.groundLayer[ri][ci];

        return arena.mapCodes[code];
    }, [arena]);

    const findTerrainImage = useCallback((ri, ci) => {
        const code = arena.terrainLayer[ri][ci];

        return arena.mapCodes[code];
    }, [arena]);

    const drawSprite = useCallback((x, y, img) => {
        const { image, offsets } = img || {};

        if (!image) {
            return;
        }

        const { dx, dy, cw, ch } = offsets;
        const [dX, dY, cW, cH] = [dx * scale, dy * scale, cw * scale, ch * scale];
        const [cX, cY] = [(x - dX) , (y - dY)];

        safeDrawImage(ctx, image, 0, 0, image.width, image.height, cX, cY, cW, cH);
    }, [ctx, scale]);

    const drawGround = useCallback(() => {
        if (!ctx || !arena) {
            return;
        }

        skeleton.forEach((row, ri) => {
            row.slice().reverse().forEach((col, ci) => {
                const image = findGroundImage(ri, ci);
                const { center: [x, y] } = col;

                if (Array.isArray(image)) {
                    image.forEach(img => drawSprite(x, y, images[img]));
                } else {
                    drawSprite(x, y, images[image]);
                }
            });
        });
    }, [ctx, arena, skeleton, findGroundImage, drawSprite, images]);

    const drawGroundTop = useCallback(() => {
        if (!ctx || !arena) {
            return;
        }

        skeleton.forEach((row, ri) => {
            row.slice().reverse().forEach((col, cri) => {
                const ci = row.length - 1 - cri;
                const { center: [x, y] } = col;
                const ally = teamAllys.find(character => cellEq(character.cell, [ri, ci]));
                const isActiveAlly = ally && ally.id === whoseTurn;

                const allySprite = ally && images[ally.sprite];

                const image = findTerrainImage(ri, ci);

                if (Array.isArray(image) && ally) {
                    drawSprite(x, y, images[image[0]]);
                    isActiveAlly && drawSprite(x, y, images.active_character_marker_back);
                    drawSprite(x, y, allySprite);
                    isActiveAlly && drawSprite(x, y, images.active_character_marker_front);
                    drawSprite(x, y, images[image[1]]);

                    return;
                }

                if (image) {
                    if (Array.isArray(image)) {
                        image.forEach(img => drawSprite(x, y, images[img]));
                    } else {
                        drawSprite(x, y, images[image]);
                    }
                }

                if (ally) {
                    isActiveAlly && drawSprite(x, y, images.active_character_marker_back);
                    drawSprite(x, y, allySprite);
                    isActiveAlly && drawSprite(x, y, images.active_character_marker_front);
                }
            });
        });
    }, [ctx, arena, skeleton, drawSprite, findTerrainImage, images, teamAllys, whoseTurn]);

    return useMemo(() => ({
        drawGround,
        drawGroundTop
    }), [drawGround, drawGroundTop]);
};
