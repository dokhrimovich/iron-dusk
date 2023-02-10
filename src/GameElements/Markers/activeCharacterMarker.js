//import { random } from 'utils/common';
import { createAnimatedDrawWrapperWithContext, createGetFrame } from '../helpers';

const spriteName = 'activeCharacterMarker';
const width = 60; // One frame width
const height = 68;

export const activeCharacterMarker = () => {
    const spriteBack = spriteName + 'Back';
    const spriteFront = spriteName + 'Front';

    return {
        isWrapper: true,
        with: createAnimatedDrawWrapperWithContext(
            [spriteBack, spriteFront],
            { width, height },
            createGetFrame(4, 1000))
    };
};
