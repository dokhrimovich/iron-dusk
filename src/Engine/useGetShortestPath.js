import { useMemo, useCallback } from 'react';
import { useResourcesContext } from 'Context/ResourcesContext';
import { useGameStateContext } from 'Context/GameStateContext';
import { findShortestPath, cellEq } from 'utils/map';
import ShortestPathWebWorker from './shortestPath.worker';

const shortestPathWebWorker = new ShortestPathWebWorker();

export const useGraph = () => {
    const { maps } = useResourcesContext();
    const { arena: arenaName, mainState, teamAllys, teamEnemies, entities, whoseTurn } = useGameStateContext();
    const arena = mainState === 'BATTLE' ? maps[arenaName] : null;

    return useMemo(() => {
        if (!arena) {
            return {};
        }

        const isThereAnybodyOutThere = ([ri, ci]) => {
            return teamAllys.some(ch => ch.id !== whoseTurn && cellEq(ch.cell, [ri, ci]))
                || teamEnemies.some(ch => cellEq(ch.cell, [ri, ci]))
                || entities.some(ch => cellEq(ch.cell, [ri, ci]));
        };

        return Object.fromEntries(
            arena.groundLayer.map((row, ri) => row.map((_, ci) => {
                if (arena.isNoGoCell([ri, ci]) || isThereAnybodyOutThere([ri, ci])) {
                    return null;
                }

                const allNeighbourCells = ri % 2
                    ? [
                        [ri - 1, ci], [ri - 1, ci + 1],
                        [ri, ci - 1], [ri, ci + 1],
                        [ri + 1, ci], [ri + 1, ci + 1]
                    ]
                    : [
                        [ri - 1, ci - 1], [ri - 1, ci],
                        [ri, ci - 1], [ri, ci + 1],
                        [ri + 1, ci - 1], [ri + 1, ci]
                    ];
                const validNeighbourCells = allNeighbourCells
                    .filter(([nri, nci]) => {
                        return !arena.isNoGoCell([nri, nci]) && !isThereAnybodyOutThere([nri, nci]);
                    })
                    .map(([nri, nci]) => `${nri}:${nci}`);

                return [`${ri}:${ci}`, validNeighbourCells];
            })).flat().filter(Boolean)
        );
    }, [arena, teamAllys, teamEnemies, entities, whoseTurn]);
};

const useGetShortestPathSync = () => {
    const graph = useGraph();

    return useCallback((fromCell, toCell) => {
        return new Promise((resolve) => {
            const { distance, path } = findShortestPath({ graph, fromCell, toCell });

            resolve({ distance, path });
        });
    }, [graph]);
};

const useGetShortestPathAsync = () => {
    const graph = useGraph();

    return useCallback((fromCell, toCell) => {
        let onMessage;
        let onError;

        return new Promise((resolve, reject) => {
            onMessage = (event) => resolve(event.data);
            onError = (event) => reject(event.data);

            shortestPathWebWorker.addEventListener('message', onMessage);
            shortestPathWebWorker.addEventListener('error', onError);

            shortestPathWebWorker.postMessage({ graph, fromCell, toCell });
        }).finally(() => {
            shortestPathWebWorker.removeEventListener('message', onMessage);
            shortestPathWebWorker.removeEventListener('error', onError);
        });

    }, [graph]);
};

export const useGetShortestPath = useGetShortestPathAsync;
