import React from 'react';

import { GameCanvas } from 'GameCanvas';
import style from './App.scss';

export const App = function() {
    return (
        <div className={style.app}>
            <header className={style.header}>
                <span>The game.</span>
            </header>
            <GameCanvas />
        </div>
    );
};
