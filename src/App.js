import React from 'react';

import { GameCanvas } from 'GameCanvas';
import { useLoadImages, ResourcesContext } from 'ResourceLoaders';
import style from './App.scss';

export const App = function() {
    const { isLoading, images } = useLoadImages();

    return (
        <ResourcesContext.Provider value={{ images }}>
            <div className={style.app}>
                <header className={style.header}>
                    <span>The game.</span>
                </header>
                {isLoading && <span>Loading...</span>}
                {!isLoading && <GameCanvas />}
            </div>
        </ResourcesContext.Provider>
    );
};
