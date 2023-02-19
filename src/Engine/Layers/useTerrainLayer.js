import { useMemo, useCallback } from 'react';
import { cellEq } from 'utils/map';

import { useResourcesContext } from 'Context/ResourcesContext';
import { useGameStateContext } from 'Context/GameStateContext';
import { useGameCanvasContext } from 'Context/GameCanvasContext';

import { activeCharacterMarker } from 'GameElements/Markers';

export const useTerrainLayer = ({ skeleton }) => {
    const { canvas: { ctx }, scale } = useGameCanvasContext();
    const { arena: arenaName, mainState, teamAllys, teamEnemies, whoseTurn } = useGameStateContext();
    const { images, maps } = useResourcesContext();
    const arena = mainState === 'BATTLE' ? maps[arenaName] : null;
    const acm = useMemo(() => activeCharacterMarker(), []);

    const drawGround = useCallback((timestamp) => {
        if (!ctx || !arena) {
            return;
        }

        skeleton.forEach((row, ri) => {
            row.slice().reverse().forEach((col, ci) => {
                const { center } = col;
                const element = arena.groundLayer[ri][ci];

                if (element) {
                    element.with({ ctx, images, scale }).drawSprite(center, timestamp);
                }
            });
        });
    }, [ctx, scale, arena, skeleton, images]);

    const drawGroundTop = useCallback((timestamp) => {
        if (!ctx || !arena) {
            return;
        }

        skeleton.forEach((row, ri) => {
            row.slice().reverse().forEach((col, cri) => {
                const { center } = col;
                const ci = row.length - 1 - cri;
                const ally = teamAllys.find(character => cellEq(character.cell, [ri, ci]));
                const enemy = teamEnemies.find(character => cellEq(character.cell, [ri, ci]));
                const isActiveAlly = ally && ally.id === whoseTurn;
                const character = ally || enemy;

                const element = arena.terrainLayer[ri][ci];
                const elementDrawSprite = element?.with({ ctx, images, scale });
                const characterDrawSprite = isActiveAlly
                    ? (c, t) => acm.with({ ctx, images, scale }).drawSprite(c, t, character.with({ ctx, images, scale }))
                    : character?.with({ ctx, images, scale });

                if (element?.isWrapper && character) {
                    elementDrawSprite(center, timestamp, characterDrawSprite);
                } else {
                    element && elementDrawSprite(center, timestamp);
                    character && characterDrawSprite(center, timestamp);
                }
            });
        });
    }, [ctx, scale, acm, arena, skeleton, images, teamAllys, whoseTurn]);

    return useMemo(() => ({
        drawGround,
        drawGroundTop
    }), [drawGround, drawGroundTop]);
};
