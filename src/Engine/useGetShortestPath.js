import { useMemo, useCallback } from 'react';
import { useResourcesContext } from 'Context/ResourcesContext';
import { findShortestPath } from 'utils/map';
import ShortestPathWebWorker from './shortestPath.worker';

const shortestPathWebWorker = new ShortestPathWebWorker();

export const useGraph = () => {
    const { maps: { arena01: arena } } = useResourcesContext();

    return useMemo(() => {
        return Object.fromEntries(
            arena.groundLayer.map((row, ri) => row.map((groundCode, ci) => {
                const terrainCode = arena.terrainLayer[ri][ci];

                if (groundCode === 0 || arena.noGoCodes.includes(groundCode) || arena.noGoCodes.includes(terrainCode)) {
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
                        const grCode = arena.groundLayer[nri]?.[nci];
                        const terraCode = arena.terrainLayer[nri]?.[nci];

                        if (grCode === undefined || terraCode === undefined) {
                            return false;
                        }

                        return grCode !== 0 && !arena.noGoCodes.includes(grCode) && !arena.noGoCodes.includes(terraCode);
                    })
                    .map(([nri, nci]) => `${nri}:${nci}`);

                return [`${ri}:${ci}`, validNeighbourCells];
            })).flat().filter(Boolean)
        );
    }, [arena]);
};

export const useGetShortestPathSync = () => {
    const graph = useGraph();

    return useCallback((fromCell, toCell) => {
        return new Promise((resolve) => {
            const { distance, path } = findShortestPath({ graph, fromCell, toCell });

            resolve({ distance, path });
        });
    }, [graph]);
};

export const useGetShortestPath = () => {
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
