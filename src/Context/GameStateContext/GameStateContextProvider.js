import React, { createContext, useContext, useCallback } from 'react';

import {
    useGameStateReducer,
    SWITCH_TO_BATTLE, SET_NEXT_TURN, MOVE_CHARACTER_TO, REDUCE_STEPS_LEFT,
    START_ACTION_EXECUTION, FINISH_ACTION_EXECUTION, CLEAR_ACTIONS, ADD_ACTIONS
} from './reducer';
import './typedef';

export * from './reducer';

const GameStateProviderContext = createContext({});

GameStateProviderContext.displayName = 'GameState';

/**
 * @returns {GameState}
 */
export const useGameStateContext = () => useContext(GameStateProviderContext);

export const GameStateProvider = ({ children }) => {
    const [state, dispatch] = useGameStateReducer();
    const switchToBattle = useCallback(({ arena, teamAllys = [], teamEnemies = [] }) => {
        dispatch({
            type: SWITCH_TO_BATTLE,
            arena,
            teamAllys,
            teamEnemies
        });
    }, [dispatch]);
    const moveCharacterTo = useCallback(({ id, cell }) => {
        dispatch({
            type: MOVE_CHARACTER_TO,
            id,
            cell
        });
    }, [dispatch]);
    const reduceStepsLeft = useCallback(({ id, steps = 1 }) => {
        dispatch({
            type: REDUCE_STEPS_LEFT,
            id,
            steps
        });
    }, [dispatch]);
    const setNextTurn = useCallback(() => {
        dispatch({
            type: SET_NEXT_TURN
        });
    }, [dispatch]);
    const startActionExecution = useCallback(() => {
       dispatch({
            type: START_ACTION_EXECUTION
        });
    }, [dispatch]);
    const finishActionExecution = useCallback(() => {
       dispatch({
            type: FINISH_ACTION_EXECUTION
        });
    }, [dispatch]);
    const clearActions = useCallback(() => {
       dispatch({
            type: CLEAR_ACTIONS
        });
    }, [dispatch]);
    const addActions = useCallback((action) => {
        dispatch({
            type: ADD_ACTIONS,
            action
        });
    }, [dispatch]);

    return (
        <GameStateProviderContext.Provider value={{
            ...state,
            switchToBattle, setNextTurn,
            moveCharacterTo, reduceStepsLeft,
            startActionExecution, finishActionExecution,
            clearActions, addActions,
            dispatch
        }}>
            {children ? children : ''}
        </GameStateProviderContext.Provider>
    );
};
