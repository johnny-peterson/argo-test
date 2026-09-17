"use strict";

const fc = require("fast-check");
const { MOVES } = require("../src/moves");
const { deriveCounterPool, selectRandomCounter } = require("../src/moveService");

// Feature: capoeira-moves-api, Property 3: Every counter move is reachable
// Validates: Requirements 1.3
describe("Property 3: Every counter move is reachable", () => {
  const pool = deriveCounterPool(MOVES);

  test("the Counter_Pool has 10 moves", () => {
    expect(pool.length).toBe(10);
  });

  // (a) Each individual draw is a member of the Counter_Pool, for any rng value
  // in [0, 1). Drive selectRandomCounter with an arbitrary double so many
  // random index positions are exercised.
  test("each individual draw returns a member of the Counter_Pool", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0, max: 0.9999999999, noNaN: true }),
        (r) => {
          const drawn = selectRandomCounter(pool, () => r);
          expect(pool).toContain(drawn);
        }
      ),
      { numRuns: 100 }
    );
  });

  // (b) Over a large number of draws, every pool move appears at least once
  // (full coverage), using the default Math.random source.
  test("over many draws, every Counter_Pool move is returned at least once", () => {
    const seen = new Set();
    for (let i = 0; i < 1000; i++) {
      seen.add(selectRandomCounter(pool).name);
    }

    const expected = new Set(pool.map((m) => m.name));
    expect(seen).toEqual(expected);
  });
});
