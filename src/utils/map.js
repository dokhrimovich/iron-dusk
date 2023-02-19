/**
 * Pseudocode from wiki https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm#Pseudocode
 *  1  function Dijkstra(Graph, source):
 *  2
 *  3      for each vertex v in Graph.Vertices:
 *  4          dist[v] ← INFINITY
 *  5          prev[v] ← UNDEFINED
 *  6          add v to Q
 *  7      dist[source] ← 0
 *  8
 *  9      while Q is not empty:
 * 10          u ← vertex in Q with min dist[u]
 * 11          remove u from Q
 * 12
 * 13          for each neighbor v of u still in Q:
 * 14              alt ← dist[u] + Graph.Edges(u, v)
 * 15              if alt < dist[v]:
 * 16                  dist[v] ← alt
 * 17                  prev[v] ← u
 * 18
 * 19      return dist[], prev[]
 * @param {{string: [string, number]}} graph
 * @param {[number, number]} fromCell
 * @param {[number, number]} toCell
 */
export const findShortestPath = ({ graph, fromCell, toCell }) => {
    const from = `${fromCell[0]}:${fromCell[1]}`;
    const to = `${toCell[0]}:${toCell[1]}`;

    if (from === to) {
        return { distance: 0, path: [] };
    }

    const allNodes = Object.keys(graph);

    if (!allNodes.includes(from) || !allNodes.includes(to)) {
        return { distance: null, path: null };
    }

    const dist = Object.fromEntries(allNodes.map(node => [node, Number.MAX_VALUE]));
    const prev = Object.fromEntries(allNodes.map(node => [node, null]));
    const visitedNodes = [];
    dist[from] = 0;

    while (visitedNodes.length < allNodes.length) {
        const distancesOfNotVisitedNodes = Object.fromEntries(
                Object.entries(dist)
                    .filter(([v]) => !visitedNodes.includes(v)));
        const minDist = Math.min.apply(Math, Object.values(distancesOfNotVisitedNodes));
        const [closestNode] = Object.entries(distancesOfNotVisitedNodes).find(([, d]) => d === minDist);

        visitedNodes.push(closestNode);

        const neighbours = graph[closestNode];

        neighbours
            .filter(([n]) => !visitedNodes.includes(n))
            .forEach(([n, v]) => {
                const newDist = dist[closestNode] + v;

                if (newDist < dist[n]) {
                    dist[n] = newDist;
                    prev[n] = closestNode;
                }
            });
    }

    let pathCell = prev[to];
    const pathAcc = [];

    while(pathCell !== null) {
        pathAcc.push(pathCell);
        pathCell = prev[pathCell];
    }

    const distance = dist[to];
    const pathRaw = pathAcc.length ? [...pathAcc.reverse(), to] : null;
    const path = pathRaw?.map(strValue => strValue.split(':').map(Number)) || null;

    return { distance, path };
};

export const cellEq = (c1, c2) => c1 === c2 || c1 && c2 && c1[0] === c2[0] && c1[1] === c2[1];

export const getNeighbourCells = ([ri, ci]) => {
    return ri % 2
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
};
