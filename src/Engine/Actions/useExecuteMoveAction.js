import { useEffect, useState, useCallback } from 'react';
import { cellEq } from 'utils/map';

import { useGameStateContext } from 'Context/GameStateContext';

export const useExecuteMoveAction = ({ currentAction, done }) => {
    const { teamAllys, teamEnemies, moveCharacterTo, reduceStepsLeft } = useGameStateContext();
    const [availablePath, setAvailablePath] = useState(null);
    const [expectCharacterCell, setExpectCharacterCell] = useState(null);
    const finishAction = useCallback(() => {
        done();
        setAvailablePath(null);
        setExpectCharacterCell(null);
    }, [done, setAvailablePath, setExpectCharacterCell]);

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
            finishAction();

            return;
        }

        const currentCellIndex = availablePath.findIndex(c => cellEq(c, character.cell));
        const nextCellIndex = currentCellIndex + 1;

        if (currentCellIndex === -1 || nextCellIndex >= availablePath.length) {
            finishAction();

            return;
        }

        setExpectCharacterCell(availablePath[nextCellIndex]);

        if (!expectCharacterCell) { // first step
            moveCharacterTo({
                id: character.id,
                cell: availablePath[nextCellIndex],
                steps: 1
            });
            reduceStepsLeft({
                id: character.id,
                steps: 1
            });

            return;
        }

        if (!cellEq(character.cell, expectCharacterCell)) {
            window.setTimeout(() => {
                moveCharacterTo({
                    id: character.id,
                    cell: expectCharacterCell,
                    steps: 1
                });
                reduceStepsLeft({
                    id: character.id,
                    steps: 1
                });
            }, 150);
        }
    }, [
        currentAction, finishAction,
        availablePath, setAvailablePath,
        expectCharacterCell, setExpectCharacterCell,
        teamAllys, teamEnemies, moveCharacterTo, reduceStepsLeft
    ]);
};
