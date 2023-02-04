export const SET_SCALE = 'SET_SCALE';
export const INCREMENT_SCALE = 'INCREMENT_SCALE';
export const SET_OFFSET = 'SET_OFFSET';
export const INCREMENT_OFFSET = 'INCREMENT_OFFSET';
export const SET_CANVAS = 'SET_CANVAS';

const minScale = 25;
const maxScale = 75;

const setScaleSafe = (prev, val) => {
    if (typeof val !== 'number') {
        return prev;
    }

    if (val < minScale) {
        return minScale;
    }

    if (val > maxScale) {
        return maxScale;
    }

    return val;
};
export const reducer = (state, action) => {
    switch (action.type) {
        case SET_SCALE:
            return {
                ...state,
                scale: setScaleSafe(state.scale, action.scale)
            };
        case INCREMENT_SCALE:
            return {
                ...state,
                scale: setScaleSafe(state.scale, state.scale + action.ds)
            };
        case SET_OFFSET:
            return {
                ...state,
                offset: action.offset
            };
        case INCREMENT_OFFSET:
            return {
                ...state,
                offset: [state.offset[0] + action.dx, state.offset[1] + action.dy]
            };
        case SET_CANVAS:
            return {
                ...state,
                canvas: action.canvas
            };

        default:
            throw new Error('Unexpected type');
    }
};
