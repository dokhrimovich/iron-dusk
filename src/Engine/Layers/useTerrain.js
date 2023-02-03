import { useMemo, useCallback, useContext } from 'react';
import { GameCanvasContext } from 'GameCanvasContext';
import { ResourcesContext } from 'ResourcesContext';
import { safeDrawImage } from 'utils/common';

const sqrt3 = Math.sqrt(3);
const cellWidthRaw = (3 + sqrt3) / 2;
const cellHeightRaw = (sqrt3 + 1) / 2;

export const useTerrain = ({ skeleton, enteties }) => {
    const { canvas: { ctx }, scale } = useContext(GameCanvasContext);
    const { images, maps: { arena01: arena } } = useContext(ResourcesContext);

    /**
     * Will return:
     * 1-st param: offset from center of the cell to the left edge where sprite should be placed.
     * 2-d param: how much sprite will take space horizontally on the canvas.
     * Sprite with width 60px should fill in one cell. Therefor offset for such sprite should be half the width of the cell.
     */
    const getSpriteOffsetX = useCallback((width) => {
        const cellWidth = cellWidthRaw * scale;
        const ratio = width / 60;
        const onCanvasWidth = cellWidth * ratio;

        return [onCanvasWidth / 2, onCanvasWidth];
    }, [scale]);
    /**
     * Will return:
     * 1-st param: offset from center of the cell to the top edge where sprite should be placed.
     * 2-d param: how much sprite will take space vertically on the canvas.
     * Sprite with height 68px should fill in one cell. Where middle 34px should fit in the cell
     * and bottom 17px are reserved for overlapping or additional parts to be rendered (like shadow)
     */
    const getSpriteOffsetY = useCallback((height) => {
        const cellHeight = cellHeightRaw * scale;

        if (height === 34) {
            return [cellHeight/2, cellHeight];
        }

        const ratio = height / 34;
        const onCanvasHeight = (cellHeight) * ratio;

        return [onCanvasHeight - cellHeight, onCanvasHeight];
    }, [scale]);

    const findGroundImage = useCallback((ri, ci) => {
        const code = arena.groundLayer[ri][ci];

        return arena.mapCodes[code];
    }, [arena]);

    const findTerrainImage = useCallback((ri, ci) => {
        const code = arena.terrainLayer[ri][ci];

        return arena.mapCodes[code];
    }, [arena]);

    const drawSprite = useCallback((x, y, img) => {
        const [dx, cw] = getSpriteOffsetX(img.width);
        const [dy, ch] = getSpriteOffsetY(img.height);
        const [cx, cy] = [(x - dx) , (y - dy)];

        safeDrawImage(ctx, img, 0, 0, img.width, img.height, cx, cy, cw, ch);
    }, [ctx, getSpriteOffsetX, getSpriteOffsetY]);

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
