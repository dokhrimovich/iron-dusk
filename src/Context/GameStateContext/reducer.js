import { useReducer } from 'react';

import { getQueue } from './helpers';

export const SET_ARENA = 'SET_ARENA';
export const SET_ENTITIES = 'SET_ENTITIES';
export const SET_TEAM_ALLYS = 'SET_TEAM_ALLYS';
export const SET_TEAM_ENEMIES = 'SET_TEAM_ENEMIES';

export const SWITCH_TO_BATTLE = 'SWITCH_TO_BATTLE';

export const SET_WHOSE_TURN = 'SET_WHOSE_TURN';
export const SET_NEXT_TURN = 'SET_NEXT_TURN';
export const SET_TURN_QUEUE = 'SET_TURN_QUEUE';
export const SET_AWAIT_USER_INPUT = 'SET_AWAIT_USER_INPUT';
export const SET_AWAIT_AI_INPUT = 'SET_AWAIT_AI_INPUT';

export const ADD_ACTIONS = 'ADD_ACTIONS';
export const CLEAR_ACTIONS = 'CLEAR_ACTIONS';
export const START_ACTION_EXECUTION = 'START_ACTION_EXECUTION';
export const FINISH_ACTION_EXECUTION = 'FINISH_ACTION_EXECUTION';

export const MOVE_CHARACTER_TO = 'MOVE_CHARACTER_TO';
export const REDUCE_STEPS_LEFT = 'REDUCE_STEPS_LEFT';

const initialState = {
    mainState: 'BATTLE',// map castle loading
    arena: null,
    entities: [],
    teamAllys: [],
    teamEnemies: [],
    whoseTurn: null,
    turnQueue: [],
    round: 0,
    awaitUserInput: false,
    awaitAiInput: false,
    todoActionsList: [],
    executeActionsList: []
};

const switchToBattle = (state, action) => {
    const { teamAllys, teamEnemies } = action;
    const turnQueue = getQueue({ teamAllys, teamEnemies });
    const whoseTurn = turnQueue[0];
    const isAlly = action.teamAllys.some(c => c.id === whoseTurn);

    return {
        ...state,
        arena: action.arena,
        entities: action.entities || [],
        teamAllys,
        teamEnemies,
        round: 1,
        turnQueue,
        whoseTurn: turnQueue[0],
        awaitUserInput: isAlly
    };
};

const setNextRound = (state) => {
    const { teamAllys, teamEnemies } = state;
    const turnQueue = getQueue({ teamAllys, teamEnemies });
    const whoseTurn = turnQueue[0];

    teamAllys.forEach(c => c.stats.stepsLeft = c.stats.maxSteps);
    teamEnemies.forEach(c => c.stats.stepsLeft = c.stats.maxSteps);

    return {
        ...state,
        round: state.round + 1,
        turnQueue,
        whoseTurn,
        teamAllys: [...state.teamAllys],
        teamEnemies: [...state.teamEnemies],
        awaitUserInput: state.teamAllys.some(c => c.id === whoseTurn),
        awaitAiInput: state.teamEnemies.some(c => c.id === whoseTurn)
    };
};

const setNextTurn = (state) => {
    const currentId = state.whoseTurn;
    const nextIndex = state.turnQueue.findIndex(id => id === currentId) + 1;

    if (nextIndex >= state.turnQueue.length) {
        return setNextRound(state);
    }

    const whoseTurn = state.turnQueue[nextIndex];

    return {
        ...state,
        whoseTurn,
        awaitUserInput: state.teamAllys.some(c => c.id === whoseTurn),
        awaitAiInput: state.teamEnemies.some(c => c.id === whoseTurn)
    };
};

const moveCharacterTo = (state, action) => {
    const character = state.teamAllys.find(a => a.id === action.id)
        || state.teamEnemies.find(a => a.id === action.id);

    character.cell = [...action.cell];

    return {
        ...state,
        teamAllys: [...state.teamAllys],
        teamEnemies: [...state.teamEnemies]
    };
};
const reduceStepsLeft = (state, action) => {
    const character = state.teamAllys.find(a => a.id === action.id)
        || state.teamEnemies.find(a => a.id === action.id);

    character.stats.stepsLeft = character.stats.stepsLeft - action.steps;

    return {
        ...state,
        teamAllys: [...state.teamAllys],
        teamEnemies: [...state.teamEnemies]
    };
};

const reducer = (state, action) => {
    switch (action.type) {
        case SWITCH_TO_BATTLE:
            return switchToBattle(state, action);
        case SET_ARENA:
            return {
                ...state,
                arena: action.arena
            };
        case SET_ENTITIES:
            return {
                ...state,
                entities: action.entities
            };
        case SET_TEAM_ALLYS:
            return {
                ...state,
                teamAllys: action.teamAllys
            };
        case SET_TEAM_ENEMIES:
            return {
                ...state,
                teamEnemies: action.teamEnemies
            };
        case SET_WHOSE_TURN:
            return {
                ...state,
                whoseTurn: action.whoseTurn,
                awaitUserInput: state.teamAllys.some(a => a.id === action.whoseTurn)
            };
        case SET_NEXT_TURN:
            return setNextTurn(state, action);
        case SET_TURN_QUEUE:
            return {
                ...state,
                turnQueue: action.turnQueue
            };
        case SET_AWAIT_USER_INPUT:
            return {
                ...state,
                awaitUserInput: action.awaitUserInput
            };
        case SET_AWAIT_AI_INPUT:
            return {
                ...state,
                awaitUserInput: action.awaitUserInput
            };
        case ADD_ACTIONS:
            return {
                ...state,
                todoActionsList: [
                    ...state.todoActionsList,
                    ...Array.isArray(action.action)
                        ? action.action
                        : [action.action]
                ]
            };
        case CLEAR_ACTIONS:
            return {
                ...state,
                todoActionsList: []
            };
        case START_ACTION_EXECUTION:
            return {
                ...state,
                awaitUserInput: false,
                executeActionsList: state.todoActionsList,
                todoActionsList: []
            };
        case FINISH_ACTION_EXECUTION:
            return {
                ...state,
                awaitUserInput: true,
                executeActionsList: [],
                todoActionsList: []
            };
        case MOVE_CHARACTER_TO:
            return moveCharacterTo(state, action);
        case REDUCE_STEPS_LEFT:
            return reduceStepsLeft(state, action);

        default:
            throw new Error('Unexpected type');
    }
};

export const useGameStateReducer = () => useReducer(reducer, null, () => initialState);
