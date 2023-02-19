import { randomizeArray } from 'utils/common';

export const getQueue = ({ teamAllys, teamEnemies }) => {
    const allCharactersInt = [
        ...teamAllys.map(c => ({
            id: c.id,
            initiative: c.stats.initiative
        })),
        ...teamEnemies.map(c => ({
            id: c.id,
            initiative: c.stats.initiative
        }))
    ];
    const groupedByInt = allCharactersInt.reduce((acc, { id, initiative }) => {
        return {
            ...acc,
            [initiative]: acc[initiative]
                ? [...acc[initiative], id]
                : [id]
        };
    }, {});

    return Object.keys(groupedByInt)
        .map(initiative => Number(initiative))
        .sort((c1, c2) => c2 - c1)
        .reduce((acc, initiative) => [
            ...acc,
            ...randomizeArray(groupedByInt[initiative])
        ], []);
};
