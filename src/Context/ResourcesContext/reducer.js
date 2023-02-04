export const SET_IMAGES = 'SET_IMAGES';
export const SET_MAPS = 'SET_MAPS';
export const SET_SOUNDS = 'SET_SOUNDS';
export const SET_IS_LOADING = 'SET_IS_LOADING';

export const reducer = (state, action) => {
    switch (action.type) {
        case SET_IS_LOADING:
            return {
                ...state,
                isLoading: action.isLoading
            };
        case SET_IMAGES:
            return {
                ...state,
                images: action.images
            };
        case SET_MAPS:
            return {
                ...state,
                maps: action.maps
            };
        case SET_SOUNDS:
            return {
                ...state,
                sounds: action.sounds
            };

        default:
            throw new Error('Unexpected type');
    }
};
