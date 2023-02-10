const sqrt3 = Math.sqrt(3);
const cellWidth = (3 + sqrt3) / 2;
const cellHeight = (sqrt3 + 1) / 2;

/**
 * Will return:
 * 1-st param: offset from center of the cell to the left edge where sprite should be placed.
 * 2-d param: how much sprite will take space horizontally on the canvas.
 * Sprite with width 60px should fill in one cell. Therefor offset for such sprite should be half the width of the cell.
 */
const getSpriteOffsetX = (width) => {
    const ratio = width / 60;
    const onCanvasWidth = cellWidth * ratio;

    return [onCanvasWidth / 2, onCanvasWidth];
};
/**
 * Will return:
 * 1-st param: offset from center of the cell to the top edge where sprite should be placed.
 * 2-d param: how much sprite will take space vertically on the canvas.
 * Sprite with height 68px should fill in one cell. Where middle 34px should fit in the cell
 * and bottom 17px are reserved for overlapping or additional parts to be rendered (like shadow)
 */
const getSpriteOffsetY = (height) => {
    if (height === 34) {
        return [cellHeight/2, cellHeight];
    }

    const ratio = height / 34;
    const onCanvasHeight = (cellHeight) * ratio;

    return [onCanvasHeight - cellHeight, onCanvasHeight];
};

export const getImageOffsets = (width, height) => {
    const [dx, cw] = getSpriteOffsetX(width);
    const [dy, ch] = getSpriteOffsetY(height);

    return { dx, cw, dy, ch };
};

const safeDrawImage = (ctx, img, ...params) => {
    if (!img || typeof img === 'string') {
        return;
    }

    ctx.drawImage(img, ...params);
};

export const createDrawWithContext = (sprite, offsets) => {
    return ({ ctx, images, scale }) => {
        function drawSpriteFn([x, y]) {
            const image = images[sprite];
            const { dx, cw, dy, ch } = offsets;
            const [dX, dY, cW, cH] = [dx * scale, dy * scale, cw * scale, ch * scale];
            const [cX, cY] = [(x - dX) , (y - dY)];

            safeDrawImage(ctx, image, 0, 0, image.width, image.height, cX, cY, cW, cH);
        }

        drawSpriteFn.drawSprite = drawSpriteFn;

        return drawSpriteFn;
    };
};

export const createDrawWrapperWithContext = (sprites, offsets) => {
    return ({ ctx, images, scale }) => {
        function drawSpriteFn([x, y], drawInTheMiddle) {
            const imageBack = images[sprites[0]];
            const imageFront = images[sprites[1]];
            const { dx, cw, dy, ch } = offsets;
            const [dX, dY, cW, cH] = [dx * scale, dy * scale, cw * scale, ch * scale];
            const [cX, cY] = [(x - dX) , (y - dY)];

            safeDrawImage(ctx, imageBack, 0, 0, imageBack.width, imageBack.height, cX, cY, cW, cH);
            drawInTheMiddle?.([x, y]);
            safeDrawImage(ctx, imageFront, 0, 0, imageFront.width, imageFront.height, cX, cY, cW, cH);
        }

        drawSpriteFn.drawSprite = drawSpriteFn;

        return drawSpriteFn;
    };
};
