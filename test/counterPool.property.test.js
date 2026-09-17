"use strict";

const fc = require("fast-check");
const { CATEGORIES, MOVES } = require("../src/moves");
const { deriveCounterPool } = require("../src/moveService");

const ELIGIBLE = [CATEGORIES.DEFENSES, CATEGORIES.SWEEPS];

// Feature: capoeira-moves-api, Property 2: Counter_Pool contains exactly the two eligible categories
// Validates: Requirements 1.2
describe("Property 2: Counter_Pool contains exactly the two eligible categories", () => {
  test("derived pool contains every eligible-category move and no move from any other category", () => {
    fc.assert(
      // Generate an arbitrary sub-array (subset, order-preserving) of the dataset.
      fc.property(fc.subarray(MOVES), (subset) => {
        const pool = deriveCounterPool(subset);

        // Every move in the derived pool must belong to an eligible category.
        for (const move of pool) {
          expect(ELIGIBLE).toContain(move.category);
        }

        // No move from a non-eligible category may appear in the pool.
        for (const move of pool) {
          expect(move.category).not.toBe(CATEGORIES.FUNDAMENTALS);
          expect(move.category).not.toBe(CATEGORIES.KICKS);
          expect(move.category).not.toBe(CATEGORIES.ACROBATICS);
        }

        // The pool must contain exactly the eligible-category members of the
        // input, no more and no less: same membership and same count.
        const expected = subset.filter((m) => ELIGIBLE.includes(m.category));
        expect(pool.length).toBe(expected.length);
        expect(new Set(pool)).toEqual(new Set(expected));

        // Every eligible move present in the input is present in the pool.
        for (const move of expected) {
          expect(pool).toContain(move);
        }
      }),
      { numRuns: 100 }
    );
  });
});
