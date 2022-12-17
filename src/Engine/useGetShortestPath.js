import { useMemo, useCallback } from 'react';
import ShortestPathWebWorker from './shortestPath.worker';

const shortestPathWebWorker = new ShortestPathWebWorker();

export const useGraph = ({ map }) => {
    return useMemo(() => {
        return Object.fromEntries(
            map.map((row, ri) => row.map((col, ci) => {
                if (!map[ri][ci]) {
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
                    .filter(([nri, nci]) => map?.[nri]?.[nci])
                    .map(([nri, nci]) => `${nri}:${nci}`);

                return [`${ri}:${ci}`, validNeighbourCells];
            })).flat().filter(Boolean)
        );
    }, [map]);
};

export const useGetShortestPath = ({ map }) => {
    const graph = useGraph({ map });

    return useCallback((fromCell, toCell) => {
        let onMessage;
        let onError;

        return new Promise((resolve, reject) => {
            onMessage = (event) => {
                console.log('MAIN ', event.data);

                resolve(event.data);
            };
            onError = (event) => {
                console.error('MAIN ', event.data);

                reject(event.data);
            };

            shortestPathWebWorker.addEventListener('message', onMessage);
            shortestPathWebWorker.addEventListener('error', onError);

            shortestPathWebWorker.postMessage({ graph, fromCell, toCell });
        }).finally(() => {
            shortestPathWebWorker.removeEventListener('message', onMessage);
            shortestPathWebWorker.removeEventListener('error', onError);
        });

    }, [graph]);
};
