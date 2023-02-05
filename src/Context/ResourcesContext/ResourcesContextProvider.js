import React, { createContext, useContext } from 'react';
import { useResourcesReducer } from './reducer';

export { SET_IS_LOADING, SET_IMAGES, SET_MAPS, SET_SOUNDS } from './reducer';

const ResourcesProviderContext = createContext({});

ResourcesProviderContext.displayName = 'Resources';

export const useResourcesContext = () => useContext(ResourcesProviderContext);

export const ResourcesProvider = ({ children }) => {
    const [{ isLoading, images, maps, sounds }, dispatch] = useResourcesReducer();

    return (
        <ResourcesProviderContext.Provider value={{ isLoading, images, maps, sounds, dispatch }}>
            {children ? children : ''}
        </ResourcesProviderContext.Provider>
    );
};
