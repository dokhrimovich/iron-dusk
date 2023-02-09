import React from 'react';

import { GameCanvasProvider } from 'Context/GameCanvasContext';
import { GameStateProvider } from 'Context/GameStateContext';
import { ResourcesProvider } from 'Context/ResourcesContext';
import { GameView } from 'GameView';

export const App = function() {
    return (
        <ResourcesProvider>
            <GameCanvasProvider>
                <GameStateProvider>
                    <GameView />
                </GameStateProvider>
            </GameCanvasProvider>
        </ResourcesProvider>
    );
};
