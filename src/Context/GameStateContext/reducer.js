import { useReducer } from 'react';

export const SET_ARENA = 'SET_ARENA';
export const SET_ENTITIES = 'SET_ENTITIES';
export const SET_TEAM_ALLYS = 'SET_TEAM_ALLYS';
export const SET_TEAM_ENEMIES = 'SET_TEAM_ENEMIES';

export const SWITCH_TO_BATTLE = 'SWITCH_TO_BATTLE';

export const SET_WHOSE_TURN = 'SET_WHOSE_TURN';
export const SET_TURN_QUEUE = 'SET_TURN_QUEUE';
export const SET_AWAIT_USER_INPUT = 'SET_AWAIT_USER_INPUT';
export const SET_AWAIT_AI_INPUT = 'SET_AWAIT_AI_INPUT';

export const ADD_ACTION = 'ADD_ACTION';
export const CLEAR_ACTIONS = 'CLEAR_ACTIONS';
export const START_ACTION_EXECUTION = 'START_ACTION_EXECUTION';
export const FINISH_ACTION_EXECUTION = 'FINISH_ACTION_EXECUTION';

export const MOVE_CHARACTER_TO = 'MOVE_CHARACTER_TO';

const initialState = {
    mainState: 'BATTLE',// map castle loading
    arena: null,
    entities: [],
    teamAllys: [],
    teamEnemies: [],
    whoseTurn: null,
    turnQueue: [],
    awaitUserInput: false,
    awaitAiInput: false,
    todoActionsList: [],
    executeActionsList: []
};

const reducer = (state, action) => {
    switch (action.type) {
        case SWITCH_TO_BATTLE:
            return {
                ...state,
                arena: action.arena,
                entities: action.entities || [],
                teamAllys: action.teamAllys,
                teamEnemies: action.teamEnemies
            };
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
        case ADD_ACTION:
            return {
                ...state,
                todoActionsList: [...state.todoActionsList, action.action]
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
            const character = state.teamAllys.find(a => a.id === action.id)
                || state.teamEnemies.find(a => a.id === action.id);

            character.cell = [...action.cell];
            character.stats.stepsLeft = character.stats.stepsLeft - action.steps;

            return {
                ...state,
                teamAllys: [...state.teamAllys],
                teamEnemies: [...state.teamEnemies]
            };

        default:
            throw new Error('Unexpected type');
    }
};

export const useGameStateReducer = () => useReducer(reducer, null, () => initialState);
