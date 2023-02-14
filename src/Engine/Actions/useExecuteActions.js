import { useCallback, useEffect, useState } from 'react';
import { useGameStateContext, START_ACTION_EXECUTION, FINISH_ACTION_EXECUTION } from 'Context/GameStateContext';

import { useExecuteMoveAction } from './useExecuteMoveAction';

export const useExecuteActions = () => {
    const { todoActionsList, executeActionsList, dispatch } = useGameStateContext();
    const [currentActionIndex, setCurrentActionIndex] = useState(-1);
    const currentAction = currentActionIndex > -1
        ? executeActionsList[currentActionIndex] : null;
    const done = useCallback(() => setCurrentActionIndex(i => i + 1), [setCurrentActionIndex]);

    useExecuteMoveAction({ currentAction, done });

    useEffect(() => {
        if (executeActionsList.length && currentActionIndex === -1) {
            setCurrentActionIndex(0);
        }
    }, [currentActionIndex, setCurrentActionIndex, executeActionsList]);

    useEffect(() => {
        if (currentActionIndex >= executeActionsList.length) {
            setCurrentActionIndex(-1);

            dispatch({
                type: FINISH_ACTION_EXECUTION
            });
        }
    }, [currentActionIndex, executeActionsList, dispatch]);

    return useCallback(() => {
        if (!todoActionsList.length) {
            return;
        }

        dispatch({
            type: START_ACTION_EXECUTION
        });
    }, [todoActionsList, dispatch]);
};
