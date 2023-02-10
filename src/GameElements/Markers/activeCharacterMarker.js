//import { random } from 'utils/common';
import { getImageOffsets, createDrawWrapperWithContext } from '../helpers';

const spriteName = 'activeCharacterMarker';
const width = 60;
const height = 68;

//const spritesCount = 1;

export const activeCharacterMarker = () => {
    const spriteBack = spriteName + 'Back';
    const spriteFront = spriteName + 'Front';
    const { dx, cw, dy, ch } = getImageOffsets(width, height);

    return {
        isWrapper: true,
        with: createDrawWrapperWithContext([spriteBack, spriteFront], { dx, cw, dy, ch })
    };
};
