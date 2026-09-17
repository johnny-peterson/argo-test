"use strict";

const fc = require("fast-check");
const { MOVES } = require("../src/moves");

// Feature: capoeira-moves-api, Property 6: Every dataset move is well-formed
// Validates: Requirements 3.2
describe("Property 6: Every dataset move is well-formed", () => {
  test("every move in MOVES has a non-empty name and a non-empty description", () => {
    fc.assert(
      fc.property(fc.constantFrom(...MOVES), (move) => {
        expect(typeof move.name).toBe("string");
        expect(move.name.trim().length).toBeGreaterThan(0);

        expect(typeof move.description).toBe("string");
        expect(move.description.trim().length).toBeGreaterThan(0);
      }),
      { numRuns: 100 }
    );
  });
});
