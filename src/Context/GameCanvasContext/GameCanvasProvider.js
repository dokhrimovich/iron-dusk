import React, { createContext, useContext } from 'react';
import { useGameCanvasReducer } from './reducer';

export { SET_CANVAS, SET_OFFSET, INCREMENT_OFFSET, SET_SCALE, INCREMENT_SCALE } from './reducer';

const GameCanvasProviderContext = createContext({});

GameCanvasProviderContext.displayName = 'GameCanvas';

export const useGameCanvasContext = () => useContext(GameCanvasProviderContext);

export const GameCanvasProvider = ({ children }) => {
    const [{ canvas, scale, offset }, dispatch] = useGameCanvasReducer();

    return (
        <GameCanvasProviderContext.Provider value={{ canvas, scale, offset, dispatch }}>
            {children ? children : ''}
        </GameCanvasProviderContext.Provider>
    );
};
