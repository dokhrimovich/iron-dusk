import React, { useReducer, createContext, useContext } from 'react';
import { reducer } from './reducer';

export { SET_IS_LOADING, SET_IMAGES, SET_MAPS, SET_SOUNDS } from './reducer';

const initialState = {
    isLoading: true,
    images: null,
    maps: null,
    sounds: null
};

const ResourcesProviderContext = createContext([initialState, () => {}]);

ResourcesProviderContext.displayName = 'Resources';

export const useResourcesContext = () => useContext(ResourcesProviderContext);
export const ResourcesProvider = ({ children }) => {
    const [{ isLoading, images, maps, sounds }, dispatch] = useReducer(reducer, null, () => initialState);

    return (
        <ResourcesProviderContext.Provider value={{ isLoading, images, maps, sounds, dispatch }}>
            {children ? children : ''}
        </ResourcesProviderContext.Provider>
    );
};
