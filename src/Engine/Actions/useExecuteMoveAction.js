import { useCallback, useEffect, useState } from 'react';
import { cellEq } from 'utils/map';

import { useGameStateContext, MOVE_CHARACTER_TO } from 'Context/GameStateContext';

export const useExecuteMoveAction = ({ currentAction, done }) => {
    const { teamAllys, teamEnemies, dispatch } = useGameStateContext();
    const [availablePath, setAvailablePath] = useState(null);

    const moveOneStep = useCallback((id, cell) => {
        window.setTimeout(() => {
            dispatch({
                type: MOVE_CHARACTER_TO,
                id,
                cell,
                steps: 1
            });
        }, 150);
    }, [dispatch]);

    useEffect(() => {
        if (!currentAction || currentAction.type !== 'MOVE') {
            return;
        }

        const character = teamAllys.find(a => a.id === currentAction.id)
            || teamEnemies.find(a => a.id === currentAction.id);

        if (!availablePath) {
            const path = currentAction.cells;

            setAvailablePath(path.slice(0, character.stats.stepsLeft + 1));

            return;
        }

        if (cellEq(availablePath.at(-1), character.cell)) {
            done();
            setAvailablePath(null);

            return;
        }

        const currentCellIndex = availablePath.findIndex(c => cellEq(c, character.cell));
        const nextCellIndex = currentCellIndex + 1;

        if (currentCellIndex === -1 || nextCellIndex >= availablePath.length) {
            done();
            setAvailablePath(null);

            return;
        }

        moveOneStep(character.id, availablePath[nextCellIndex]);
    }, [currentAction, setAvailablePath, availablePath, teamAllys, teamEnemies, moveOneStep, done]);
};
