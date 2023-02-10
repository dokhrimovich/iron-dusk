//import { random } from 'utils/common';
import { getImageOffsets, createDrawWrapperWithContext } from '../helpers';

const spriteName = 'tallGrass';
const width = 90;
const height = 85;

//const spritesCount = 1;

export const tallGrass = () => {
    const spriteBack = spriteName + 'Back01';
    const spriteFront = spriteName + 'Front01';
    const { dx, cw, dy, ch } = getImageOffsets(width, height);

    return {
        isWrapper: true,
        name: spriteName,
        with: createDrawWrapperWithContext([spriteBack, spriteFront], { dx, cw, dy, ch })
    };
};
