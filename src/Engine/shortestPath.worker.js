import { findShortestPath } from 'utils/map';

self.onmessage = function(event) {
    const { graph, fromCell, toCell } = event.data;
    const { distance, path } = findShortestPath({ graph, fromCell, toCell });

    self.postMessage({ distance, path });
};
