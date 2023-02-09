export const throttle = (fn, delay) => {
    let prevCall = 0;

    return (...args) => {
        let now = new Date().getTime();

        if (now - prevCall > delay) {
            prevCall = now;
            fn(...args);
        }
    };
};

const sqrt3 = Math.sqrt(3);

/**
 * @returns x, y coordinates
 * row from top to bottom [0-<number of rows -1>]
 * columns from left to right [0-<number of columns -1>]
 * odd rows have 1 column more then even rows
 * (0;0),(0;1),(0;2),(0;3),(0;4)
 *    (1;0),(1;1),(1;2),(1;3)
 * (2;0),(2;1),(2;2),(2;3),(2;4)
 */
export const getOffset = (row, col) => {
    const isOddRow = row % 2 > 0;

    const rowOffsetX = (3 * sqrt3 / 4) * row;
    const rowOffsetY = -(3 / 4) * row;

    const halfOffsetX = isOddRow ? 3 / 4 : 0;
    const halfOffsetY = isOddRow ? sqrt3 / 4 : 0;

    const colOffsetX = (3 / 2) * col;
    const colOffsetY = (sqrt3 / 2) * col;

    return [rowOffsetX + halfOffsetX + colOffsetX, -(rowOffsetY + halfOffsetY + colOffsetY)];
};
/**
 * @param row
 * @param col
 *        1
 *      /  \
 *   6/     \2
 *   |       |
 *  A.  .   .B
 *  |   c   |
 * 5\      /3
 *   \   /
 *     4
 */
export const getHexVerticesOffset = (row, col) => {
    const [centerX, centerY] = getOffset(row, col); // c
    const topX = centerX - sqrt3 / 2; // 1
    const topY = centerY - 1/2; // 1

    const topRightX = centerX + (3 - sqrt3) / 4; // 2
    const topRightY = centerY - (sqrt3 + 1) / 4; // 2

    const bottomRightX = centerX + (3 + sqrt3) / 4; // 3
    const bottomRightY = centerY - (sqrt3 - 1) / 4; // 3

    const bottomX = centerX + sqrt3 / 2; // 4
    const bottomY = centerY + 1/2; // 4

    const bottomLeftX = centerX - (3 - sqrt3) / 4; // 5
    const bottomLeftY = centerY + (sqrt3 + 1) / 4; // 5

    const topLeftX = centerX - (3 + sqrt3) / 4; // 6
    const topLeftY = centerY + (sqrt3 - 1) / 4; // 6

    return {
        center: [centerX, centerY],
        top: [topX, topY],
        topRight: [topRightX, topRightY],
        bottomRight: [bottomRightX, bottomRightY],
        bottom: [bottomX, bottomY],
        bottomLeft: [bottomLeftX, bottomLeftY],
        topLeft: [topLeftX, topLeftY]
    };
};

export const safeDrawImage = (ctx, img, ...params) => {
    if (typeof img === 'string') {
        return;
    }

    ctx.drawImage(img, ...params);
};

export const deepClone = (obj) => JSON.parse(JSON.stringify(obj));
