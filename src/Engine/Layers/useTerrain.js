import { useMemo, useCallback } from 'react';
import { useGameCanvasContext } from 'Context/GameCanvasContext';
import { useResourcesContext } from 'Context/ResourcesContext';
import { safeDrawImage } from 'utils/common';

export const useTerrain = ({ skeleton, enteties }) => {
    const { canvas: { ctx }, scale } = useGameCanvasContext();
    const { images, maps: { arena01: arena } } = useResourcesContext();

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
        if (!ctx) {
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
    }, [ctx, skeleton, findGroundImage, drawSprite, images]);

    const drawGroundTop = useCallback(() => {
        if (!ctx) {
            return;
        }

        skeleton.forEach((row, ri) => {
            row.slice().reverse().forEach((col, cri) => {
                const ci = row.length - 1 - cri;
                const { center: [x, y] } = col;
                const someone = enteties.find(e => e.coord[0] === ri && e.coord[1] === ci);

                const image = findTerrainImage(ri, ci);

                if (Array.isArray(image) && someone?.type === 1) {
                    drawSprite(x, y, images[image[0]]);
                    drawSprite(x, y, images.warrior01);
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

                if (someone?.type === 1) {
                    drawSprite(x, y, images.warrior01);
                }
            });
        });
    }, [ctx, skeleton, drawSprite, findTerrainImage, images, enteties]);

    return useMemo(() => ({
        drawGround,
        drawGroundTop
    }), [drawGround, drawGroundTop]);
};
