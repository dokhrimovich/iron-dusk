import { useMemo, useCallback, useContext } from 'react';
import { ResourcesContext } from 'ResourceLoaders';
import { safeDrawImage } from 'utils/common';

const sqrt3 = Math.sqrt(3);
export const useTerrain = ({ ctx, skeleton, scale, map, enteties }) => {
    const { images } = useContext(ResourcesContext);
    const cellWidth = (3 + sqrt3) / 2 * scale;
    const cellHeight = (sqrt3 + 1) / 2 * scale;
    const d60x34 = useMemo(() => [cellWidth/2, cellHeight/2, cellWidth, cellHeight], [cellWidth, cellHeight]);
    const d60x68 = useMemo(() => [cellWidth/2, cellHeight + cellHeight/2, cellWidth, cellHeight*2], [cellWidth, cellHeight]);
    const d120x136 = useMemo(() => [cellWidth + cellWidth/2, cellHeight*3 + cellHeight/2, cellWidth*2, cellHeight*4], [cellWidth, cellHeight]);

    const drawSprite60x34 = useCallback((x, y, img) => {
        const [dx, dy, cw, ch] = d60x34;
        const [cx, cy] = [(x - dx) , (y - dy)];

        safeDrawImage(ctx, img, 0, 0, 60, 34, cx, cy, cw, ch);
    }, [ctx, d60x34]);

    const drawSprite60x68 = useCallback((x, y, img) => {
        const [dx, dy, cw, ch] = d60x68;
        const [cx, cy] = [(x - dx) , (y - dy)];

        safeDrawImage(ctx, img, 0, 0, 60, 68, cx, cy, cw, ch);
    }, [ctx, d60x68]);

    const drawSprite160x136 = useCallback((x, y, img) => {
        const [dx, dy, cw, ch] = d120x136;
        const [cx, cy] = [(x - dx) , (y - dy)];

        safeDrawImage(ctx, img, 0, 0, 120, 136, cx, cy, cw, ch);
    }, [ctx, d120x136]);

    const drawGround = useCallback(() => {
        if (!ctx || !images) {
            return;
        }

        skeleton.forEach((row) => {
            row.slice().reverse().forEach((col) => {
                const { center: [x, y] } = col;

                drawSprite60x34(x, y, images.mud01);
            });
        });
    }, [ctx, skeleton, drawSprite60x34, images]);

    const drawGrass = useCallback(() => {
        if (!ctx || !images) {
            return;
        }

        skeleton.forEach((row, ri) => {
            row.slice().reverse().forEach((col, cri) => {
                const ci = row.length - 1 - cri;
                const { center: [x, y] } = col;
                const someone = enteties.find(e => e.coord[0] === ri && e.coord[1] === ci);

                if (map[ri][ci] === 0) {
                    drawSprite60x68(x, y, images.boulder01);
                }

                if (map[ri][ci] === 2) {
                    drawSprite60x68(x, y, images.grass_back01);
                    someone?.type === 1 && drawSprite160x136(x, y, images.warrior01);
                    drawSprite60x68(x, y, images.grass_front01);
                }
            });
        });
    }, [ctx, map, skeleton, drawSprite60x68, drawSprite160x136, images, enteties]);

    return useMemo(() => ({
        drawGround,
        drawGrass
    }), [drawGround, drawGrass]);
};
