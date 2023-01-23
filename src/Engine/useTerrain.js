import { useMemo, useCallback, useContext } from 'react';
import { ResourcesContext } from 'ResourceLoaders';

const sqrt3 = Math.sqrt(3);
export const useTerrain = ({ ctx, skeleton, scale, map }) => {
    const { images } = useContext(ResourcesContext);
    const dx = (3 + sqrt3) / 4 * scale;
    const dy = (sqrt3 + 1) / 4 * scale;
    const [ddx, ddy] = [2*dx, 2*dy];
    const [dddy, ddddy] = [3*dy, 4*dy];

    const drawGroundSprite = useCallback((x, y) => {
        const [x1, y1] = [(x - dx) , (y - dy)];

        ctx.drawImage(images.mud01, 0, 0, 60, 34, x1, y1, ddx, ddy);
    }, [ctx, images, dx, dy, ddx, ddy]);

    const drawBoulderSprite = useCallback((x, y) => {
        const [x1, y1] = [(x - dx) , (y - dddy)];

        ctx.drawImage(images.boulder01, 0, 0, 60, 68, x1, y1, ddx, ddddy);
    }, [ctx, images, dx, ddx, dddy, ddddy]);

    const drawGrassBackSprite = useCallback((x, y) => {
        const [x1, y1] = [(x - dx) , (y - dddy)];

        ctx.drawImage(images.grass_back01, 0, 0, 60, 68, x1, y1, ddx, ddddy);
    }, [ctx, images, dx, ddx, dddy, ddddy]);

    const drawGrassFrontSprite = useCallback((x, y) => {
        const [x1, y1] = [(x - dx) , (y - dddy)];

        ctx.drawImage(images.grass_front01, 0, 0, 60, 68, x1, y1, ddx, ddddy);
    }, [ctx, images, dx, ddx, dddy, ddddy]);

    const drawGround = useCallback(() => {
        if (!ctx || !images) {
            return;
        }

        skeleton.forEach((row) => {
            row.slice().reverse().forEach((col) => {
                const { center: [x, y] } = col;

                drawGroundSprite(x, y);
            });
        });
    }, [ctx, skeleton, drawGroundSprite, images]);

    const drawGrass = useCallback(() => {
        if (!ctx || !images) {
            return;
        }

        skeleton.forEach((row, ri) => {
            row.slice().reverse().forEach((col, cri) => {
                const ci = row.length - 1 - cri;
                const { center: [x, y] } = col;

                if (map[ri][ci] === 0) {
                    drawBoulderSprite(x, y);
                }

                if (map[ri][ci] === 2) {
                    drawGrassBackSprite(x, y);
                    drawGrassFrontSprite(x, y);
                }
            });
        });
    }, [ctx, map, skeleton, drawGrassBackSprite, images]);

    // const drawGrassFront = useCallback(() => {
    //     if (!ctx || !images) {
    //         return;
    //     }
    //
    //     skeleton.forEach((row, ri) => {
    //         row.slice().reverse().forEach((col, cri) => {
    //             const ci = row.length - 1 - cri;
    //
    //             if (map[ri][ci] !== 2) {
    //                 return;
    //             }
    //
    //             const { center: [x, y] } = col;
    //
    //             drawGrassFrontSprite(x, y);
    //         });
    //     });
    // }, [ctx, map, skeleton, drawGrassFrontSprite, images]);

    return useMemo(() => ({
        drawGround,
        drawGrass
    }), [drawGround, drawGrass]);
};
