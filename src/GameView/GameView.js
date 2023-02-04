import React from 'react';
import { useResourcesContext } from 'Context/ResourcesContext';

import { Engine } from 'Engine';
import { ResizableCanvas } from 'ResizableCanvas';
import { useLoadResources } from './useLoadResources';

import style from './GameView.scss';

export const GameView = () => {
    const { isLoading } = useResourcesContext();

    useLoadResources();

    return (
        <div className={style.app}>
            <header className={style.header}>
                <span>The game.</span>
            </header>
            {isLoading && <span>Loading...</span>}
            {!isLoading && <ResizableCanvas />}
            {!isLoading && <Engine />}
        </div>
    );
};
