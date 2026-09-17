"use strict";

const fc = require("fast-check");
const { MOVES } = require("../src/moves");
const { findMove } = require("../src/moveService");

// Feature: capoeira-moves-api, Property 4: Matching is invariant under case and surrounding whitespace
// Validates: Requirements 2.3
describe("Property 4: Matching is invariant under case and surrounding whitespace", () => {
  // Whitespace characters permitted around a name; all should be trimmed away.
  const WHITESPACE = [" ", "\t", "\n", "\r", "\f", "\v"];

  // Perturb the case of each character in a name according to a per-character
  // boolean flag (true => uppercase, false => lowercase).
  function perturbCase(name, flags) {
    return name
      .split("")
      .map((ch, i) => (flags[i % flags.length] ? ch.toUpperCase() : ch.toLowerCase()))
      .join("");
  }

  test("perturbing case and adding leading/trailing whitespace resolves to the same move", () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...MOVES),
        // Per-character case flags (non-empty so the modulo indexing is safe).
        fc.array(fc.boolean(), { minLength: 1, maxLength: 40 }),
        // Leading and trailing whitespace built from the allowed characters.
        fc.array(fc.constantFrom(...WHITESPACE), { minLength: 0, maxLength: 8 }),
        fc.array(fc.constantFrom(...WHITESPACE), { minLength: 0, maxLength: 8 }),
        (move, caseFlags, leading, trailing) => {
          const perturbedName =
            leading.join("") + perturbCase(move.name, caseFlags) + trailing.join("");

          const resolved = findMove(MOVES, perturbedName);

          // It must resolve to a move, and to the same canonical move.
          expect(resolved).not.toBeNull();
          expect(resolved.name).toBe(move.name);
          expect(resolved).toBe(move);
        }
      ),
      { numRuns: 100 }
    );
  });
});
