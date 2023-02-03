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
        const [closetNode] = Object.entries(distancesOfNotVisitedNodes).find(([, d]) => d === minDist);

        visitedNodes.push(closetNode);

        const neighbours = graph[closetNode];

        neighbours
            .filter(v => !visitedNodes.includes(v))
            .forEach(v => {
                const newDist = dist[closetNode] + 1; // todo if more than 1?

                if (newDist < dist[v]) {
                    dist[v] = newDist;
                    prev[v] = closetNode;
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
    const path = pathRaw.map(strValue => strValue.split(':').map(Number));

    return { distance, path };
};
