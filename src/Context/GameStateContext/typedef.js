/**
 * @typedef {[number, number]} Cell
 */

/**
 * @name Draw
 * @function
 * @param {Cell} cell
 * @param {number} animation frame timeStamp
 * @param {[function]} draw function to be called in between 2 sprites
 * @returns void
 */

/**
 * @name DrawWithContext
 * @function
 * @param {string} sprite name
 * @param {{ dx: number, cw: number, dy: number, ch: number }}
 */

/**
 * @typedef {Object} BattleCharacter
 * @property {symbol} id
 * @property {string} name
 * @property {string} key
 * @property {DrawWithContext} with draw function factory
 * @property {Cell} cell position of character
 * @property {object} stats
 * @property {ReactElement} Component
 */

/**
 * @typedef {Object} Action
 * @property {string} type
 */

/**
 * @typedef {Object} GameState
 * @property {string} mainState
 * @property {string} arena
 * @property {object[]} entities
 * @property {BattleCharacter[]} teamAllys
 * @property {BattleCharacter[]} teamEnemies
 * @property {symbol|null} whoseTurn
 * @property {symbol[]} turnQueue
 * @property {boolean} awaitUserInput
 * @property {boolean} awaitAiInput
 * @property {Action[]} todoActionsList
 * @property {Action[]} executeActionsList
 * @property {function} dispatch
 */

export default {};
