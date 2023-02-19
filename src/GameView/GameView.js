import React from 'react';
import { useResourcesContext } from 'Context/ResourcesContext';
import { useGameStateContext } from 'Context/GameStateContext';

import { Engine } from 'Engine';
import { ResizableCanvas } from 'ResizableCanvas';
import { useLoadResources } from './useLoadResources';

import style from './GameView.scss';

export const GameView = () => {
    const { isLoading } = useResourcesContext();
    const { round, setNextTurn } = useGameStateContext();

    useLoadResources();

    return (
        <div className={style.app}>
            <header className={style.header}>
                <span>The game. </span>
                <span>Round {round}</span><br/>
                <div className={style.controls}>
                    <button onClick={setNextTurn}>End Turn >></button>
                </div>
            </header>
            {isLoading && <span>Loading...</span>}
            {!isLoading && <ResizableCanvas />}
            {!isLoading && <Engine />}
        </div>
    );
};
