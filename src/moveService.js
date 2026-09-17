"use strict";

const { CATEGORIES } = require("./moves");

/**
 * Normalize a move name for matching: trim surrounding whitespace and lowercase.
 *
 * @param {string} name - The raw move name to normalize.
 * @returns {string} The trimmed, lowercased name.
 */
function normalize(name) {
  return String(name).trim().toLowerCase();
}

/**
 * Find a move by name using a case-insensitive, whitespace-trimmed comparison.
 *
 * @param {Array<{name: string, description: string, category: string}>} moves
 *   The dataset of moves to search.
 * @param {string} rawName - The raw name supplied by the caller.
 * @returns {object|null} The matching move object, or null if no match.
 */
function findMove(moves, rawName) {
  const key = normalize(rawName);
  return moves.find((m) => normalize(m.name) === key) || null;
}

/**
 * Derive the Counter_Pool: moves whose category is Defenses & Evasions or
 * Sweeps & Takedowns.
 *
 * @param {Array<{name: string, description: string, category: string}>} moves
 *   The full dataset of moves.
 * @returns {Array<object>} The subset of moves eligible as counters.
 */
function deriveCounterPool(moves) {
  return moves.filter(
    (m) => m.category === CATEGORIES.DEFENSES || m.category === CATEGORIES.SWEEPS
  );
}

/**
 * Select one move uniformly at random from a non-empty pool.
 *
 * @param {Array<object>} pool - The Counter_Pool to draw from.
 * @param {() => number} [rng=Math.random] - Injectable random source in [0, 1).
 * @returns {object} The selected move.
 */
function selectRandomCounter(pool, rng = Math.random) {
  const index = Math.floor(rng() * pool.length);
  return pool[index];
}

module.exports = { normalize, findMove, deriveCounterPool, selectRandomCounter };
