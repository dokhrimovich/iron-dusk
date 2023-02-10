import { random } from 'utils/common';
import { getImageOffsets, createDrawWithContext } from '../helpers';

const spriteName = 'mud';
const width = 60;
const height = 68;

const spritesCount = 3;

export const mud = () => {
    const sprite = spriteName + '0' + random(spritesCount);
    const { dx, cw, dy, ch } = getImageOffsets(width, height);

    return {
        name: spriteName,
        with: createDrawWithContext(sprite, { dx, cw, dy, ch })
    };
};
