import React, { createContext, useContext } from 'react';
import { useGameStateReducer } from './reducer';

export {
    SWITCH_TO_BATTLE, SET_ARENA, SET_ENTITIES, SET_TEAM_ALLYS, SET_TEAM_ENEMIES,
    SET_WHOSE_TURN, SET_TURN_QUEUE, SET_AWAIT_USER_INPUT, SET_AWAIT_AI_INPUT
} from './reducer';

const GameStateProviderContext = createContext({});

GameStateProviderContext.displayName = 'GameState';

export const useGameStateContext = () => useContext(GameStateProviderContext);

export const GameStateProvider = ({ children }) => {
    const [{ mainState, arena, teamAllys, teamEnemies, entities, whoseTurn }, dispatch] = useGameStateReducer();

    return (
        <GameStateProviderContext.Provider value={{ mainState, arena, teamAllys, teamEnemies, entities, whoseTurn, dispatch }}>
            {children ? children : ''}
        </GameStateProviderContext.Provider>
    );
};
