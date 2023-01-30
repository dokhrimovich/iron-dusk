import React from 'react';

import { useGameCanvas, useScale, useOffset, GameCanvasContext } from 'GameCanvasContext';
import { useLoadImages, ResourcesContext } from 'ResourcesContext';
import { ResizableCanvas } from 'ResizableCanvas';
import { Engine } from 'Engine';

import style from './App.scss';

export const App = function() {
    const { scale, setScale } = useScale();
    const { offset, setOffset } = useOffset();
    const { canvas, setCanvas } = useGameCanvas();
    const { isLoading, images } = useLoadImages();

    return (
        <ResourcesContext.Provider value={{ images }}>
            <GameCanvasContext.Provider value={{ canvas, scale, offset }}>
                <div className={style.app}>
                    <header className={style.header}>
                        <span>The game.</span>
                    </header>
                    {isLoading && <span>Loading...</span>}
                    {!isLoading && <ResizableCanvas setCanvas={setCanvas} setOffset={setOffset} setScale={setScale} />}
                </div>

                <Engine />
            </GameCanvasContext.Provider>
        </ResourcesContext.Provider>
    );
};
