import React from 'react';

import { GameCanvasProvider } from 'Context/GameCanvasContext';
import { ResourcesProvider } from 'Context/ResourcesContext';
import { GameView } from 'GameView';

export const App = function() {
    return (
        <ResourcesProvider>
            <GameCanvasProvider>
                <GameView />
            </GameCanvasProvider>
        </ResourcesProvider>
    );
};
