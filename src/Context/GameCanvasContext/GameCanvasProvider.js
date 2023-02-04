import React, { useReducer, createContext, useContext } from 'react';
import { reducer } from './reducer';

export { SET_CANVAS, SET_OFFSET, INCREMENT_OFFSET, SET_SCALE, INCREMENT_SCALE } from './reducer';

const defaultDisplayOffsetX = 10;
const defaultDisplayOffsetY = 400;
const defaultScale = 50;

export const initialState = {
    canvas: {},
    scale: defaultScale,
    offset: [defaultDisplayOffsetX, defaultDisplayOffsetY]
};

const GameCanvasProviderContext = createContext([initialState, () => {}]);

GameCanvasProviderContext.displayName = 'GameCanvas';

export const useGameCanvasContext = () => useContext(GameCanvasProviderContext);

export const GameCanvasProvider = ({ children }) => {
    const [{ canvas, scale, offset }, dispatch] = useReducer(reducer, null, () => initialState);

    return (
        <GameCanvasProviderContext.Provider value={{ canvas, scale, offset, dispatch }}>
            {children ? children : ''}
        </GameCanvasProviderContext.Provider>
    );
};
