import React, { useCallback, useEffect, useState, useMemo, useRef } from 'react';
import { cellEq } from 'utils/map';
import { deepClone } from 'utils/common';
import { useGameStateContext } from 'Context/GameStateContext';
import { useGetShortestPath } from 'Engine/useGetShortestPath';

import { move, swordSwing } from '../commonActions';

const initialStats = Object.freeze({
    hp: 300,
    sp: 300,
    fp: 300,
    availableActions: [
        move(5),
        swordSwing({
            dmg: 100,
            shock: 50,
            spd: 100,
            area: 0.3
        })
    ],
    availableModes: [{
        defence: 0.5,
        shockAbsorb: 0.7,
        reflexPenalty: 0.6
    }]
});

const useSelf = (id) => {
    const { teamAllys, teamEnemies } = useGameStateContext();

    return useMemo(() => {
        const currentAlly = teamAllys.find(ally => ally.id === id);

        if (currentAlly) {
            return [currentAlly, true];
        }

        const currentEnemy = teamEnemies.find(ally => ally.id === id);

        return [currentEnemy, false];
    }, [id, teamAllys, teamEnemies]);
};

const Warrior = ({ id, setPath, lastClickedCell }) => {
    const awaitUserAction = useRef(0);
    const [toCell, setToCell] = useState(null);
    const { whoseTurn } = useGameStateContext();
    const getShortestPath = useGetShortestPath();
    const [self, isAlly] = useSelf(id);

    const isActive = whoseTurn === id;
    const currentCell = self?.cell;

    useEffect(() => {
        awaitUserAction.current = isActive && isAlly ? Date.now() : 0;
    }, [isActive, isAlly]);

    useEffect(() => {
        if (!lastClickedCell || !awaitUserAction.current || awaitUserAction.current >= lastClickedCell.timeStamp) {
            return;
        }

        if (!toCell || !cellEq(toCell, lastClickedCell.cell)) {
            awaitUserAction.current = lastClickedCell.timeStamp;
            setToCell(lastClickedCell.cell);

            return;
        }

        if (cellEq(toCell, lastClickedCell.cell)) {
            awaitUserAction.current = lastClickedCell.timeStamp;
            //confirm action
            setToCell(null);
        }
    }, [lastClickedCell, awaitUserAction, toCell, setToCell]);

    useEffect(() => {
        let isMounted = true;

        if (!currentCell || !toCell) {
            setPath(null);

            return;
        }

        (async () => {
            const { path: shortestPath } = await getShortestPath(currentCell, toCell);

            isMounted && setPath(shortestPath);
        })();

        return () => {
            isMounted = false;
        };
    }, [currentCell, toCell, setPath, getShortestPath]);

    return null;
};

export const createCharacter = (cell) => {
    const id = Symbol('warrior');
    const stats = JSON.parse(JSON.stringify(initialStats));

    return {
        id,
        key: `${cell[0]-cell[1]}`,
        sprite: 'warrior01',
        cell,
        ...deepClone(stats),
        Component: (props) => <Warrior id={id} {...props} />
    };
};
