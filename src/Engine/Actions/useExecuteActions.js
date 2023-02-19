import { useCallback, useEffect, useState } from 'react';
import { useGameStateContext } from 'Context/GameStateContext';

import { useExecuteMoveAction } from './useExecuteMoveAction';

export const useExecuteActions = () => {
    const { todoActionsList, executeActionsList, startActionExecution, finishActionExecution } = useGameStateContext();
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

            finishActionExecution();
        }
    }, [currentActionIndex, executeActionsList, finishActionExecution]);

    return useCallback(() => {
        if (!todoActionsList.length) {
            return;
        }

        startActionExecution();
    }, [todoActionsList, startActionExecution]);
};
