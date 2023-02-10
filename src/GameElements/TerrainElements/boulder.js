//import { random } from 'utils/common';
import { getImageOffsets, createDrawWithContext } from '../helpers';

const spriteName = 'boulder';
const width = 90;
const height = 85;

//const spritesCount = 1;

export const boulder = () => {
    const sprite = spriteName + '01';
    const { dx, cw, dy, ch } = getImageOffsets(width, height);

    return {
        with: createDrawWithContext(sprite, { dx, cw, dy, ch })
    };
};
