import React, { createContext, useContext } from 'react';
import { useGameStateReducer } from './reducer';
import './typedef';

export * from './reducer';

const GameStateProviderContext = createContext({});

GameStateProviderContext.displayName = 'GameState';

/**
 * @returns {GameState}
 */
export const useGameStateContext = () => useContext(GameStateProviderContext);

export const GameStateProvider = ({ children }) => {
    const [{
        mainState, arena, teamAllys, teamEnemies, entities, whoseTurn,
        awaitUserInput, awaitAiInput, todoActionsList, executeActionsList
    }, dispatch] = useGameStateReducer();

    return (
        <GameStateProviderContext.Provider value={{
            mainState, arena, teamAllys, teamEnemies, entities, whoseTurn,
            awaitUserInput, awaitAiInput, todoActionsList, executeActionsList,
            dispatch
        }}>
            {children ? children : ''}
        </GameStateProviderContext.Provider>
    );
};
