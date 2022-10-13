import React from 'react';
import { render } from 'react-dom';
import { App } from './App';

import './index.scss';

export const renderApp = () => {
    render(<App />, document.getElementById('root'));
};

renderApp();
