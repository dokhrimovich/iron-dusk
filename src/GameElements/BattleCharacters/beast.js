import React, { useEffect, useState, useMemo, useRef } from 'react';
import { cellEq } from 'utils/map';
import { deepClone } from 'utils/common';
import { useGameStateContext } from 'Context/GameStateContext';
import { useGetShortestPath } from 'Engine/useGetShortestPath';

import { getImageOffsets, createDrawWithContext } from '../helpers';
import { move, swordSwing } from './commonActions';

const initialStats = Object.freeze({
    hp: 300,
    sp: 300,
    fp: 300,
    stepsLeft: 6,
    maxSteps: 6,
    initiative: 3,
    availableActions: [
        move(),
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

const BeastComponent = ({ id, executeActions, lastClickedCell }) => {
    const lastClickTime = useRef(0);
    const [toCell, setToCell] = useState(null);
    const { whoseTurn, awaitUserInput, clearActions, addActions } = useGameStateContext();
    const getShortestPath = useGetShortestPath();
    const [self, isAlly] = useSelf(id);

    const isActive = whoseTurn === id;
    const currentCell = self?.cell;

    useEffect(() => {
        lastClickTime.current = isActive && isAlly ? Date.now() : 0;
    }, [isActive, isAlly]);

    useEffect(() => {
        if (!awaitUserInput || !lastClickedCell || !lastClickTime.current || lastClickTime.current >= lastClickedCell.timeStamp) {
            return;
        }

        if (!toCell || !cellEq(toCell, lastClickedCell.cell)) {
            lastClickTime.current = lastClickedCell.timeStamp;
            setToCell(lastClickedCell.cell);

            return;
        }

        if (cellEq(toCell, lastClickedCell.cell)) {
            lastClickTime.current = lastClickedCell.timeStamp;
            executeActions();
            setToCell(null);
        }
    }, [lastClickedCell, executeActions, awaitUserInput, lastClickTime, toCell, setToCell]);

    useEffect(() => {
        clearActions();

        if (!toCell || !awaitUserInput) {
            return;
        }

        (async () => {
            const { path: shortestPath } = await getShortestPath(currentCell, toCell);
            const moveAction = self.stats.availableActions.find(a => a.type === 'MOVE');

            if (!moveAction) {
                return;
            }

            addActions({
                ...moveAction,
                id,
                stepsLeft: self.stats.stepsLeft,
                cells: shortestPath
            });
        })();
    }, [id, currentCell, toCell, getShortestPath, awaitUserInput, self, clearActions, addActions]);

    return null;
};

const width = 180;
const height = 136;
const spriteName = 'beast';

export const beast = (cell) => {
    const id = Symbol('beast');
    const sprite = spriteName + '01';
    const stats = JSON.parse(JSON.stringify(initialStats));
    const { dx, cw, dy, ch } = getImageOffsets(width, height);

    return {
        id,
        name: spriteName,
        key: `${cell[0]-cell[1]}`,
        with: createDrawWithContext(sprite, { dx, cw, dy, ch }),
        cell,
        stats: deepClone(stats),
        Component: (props) => <BeastComponent id={id} {...props} />
    };
};
