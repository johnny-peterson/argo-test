"use strict";

const fc = require("fast-check");
const request = require("supertest");
const app = require("../src/app");
const { MOVES } = require("../src/moves");
const { deriveCounterPool } = require("../src/moveService");

// Feature: capoeira-moves-api, Property 1: Recognized move yields a valid counter
// Validates: Requirements 1.1
describe("Property 1: Recognized move yields a valid counter", () => {
  // Whitespace characters permitted around a name; all should be trimmed away.
  const WHITESPACE = [" ", "\t", "\n", "\r", "\f", "\v"];

  // The set of moves eligible as counters, and their names for membership checks.
  const counterPool = deriveCounterPool(MOVES);
  const counterPoolNames = new Set(counterPool.map((m) => m.name));

  // Perturb the case of each character in a name according to a per-character
  // boolean flag (true => uppercase, false => lowercase).
  function perturbCase(name, flags) {
    return name
      .split("")
      .map((ch, i) =>
        flags[i % flags.length] ? ch.toUpperCase() : ch.toLowerCase()
      )
      .join("");
  }

  test("a recognized move name (any case/whitespace) yields a 200 with a valid Counter_Pool member", async () => {
    await fc.assert(
      fc.asyncProperty(
        // A recognized attacking move name drawn from the dataset.
        fc.constantFrom(...MOVES.map((m) => m.name)),
        // Per-character case flags (non-empty so the modulo indexing is safe).
        fc.array(fc.boolean(), { minLength: 1, maxLength: 40 }),
        // Leading and trailing whitespace built from the allowed characters.
        fc.array(fc.constantFrom(...WHITESPACE), { minLength: 0, maxLength: 8 }),
        fc.array(fc.constantFrom(...WHITESPACE), { minLength: 0, maxLength: 8 }),
        async (name, caseFlags, leading, trailing) => {
          const perturbedName =
            leading.join("") + perturbCase(name, caseFlags) + trailing.join("");

          // Use the query parameter form so whitespace/special chars are handled
          // safely by supertest's query encoding.
          const res = await request(app)
            .get("/counter")
            .query({ name: perturbedName });

          // Status 200 for a recognized move.
          expect(res.status).toBe(200);

          // Non-empty name and description in the response body.
          expect(typeof res.body.name).toBe("string");
          expect(res.body.name.length).toBeGreaterThan(0);
          expect(typeof res.body.description).toBe("string");
          expect(res.body.description.length).toBeGreaterThan(0);

          // The returned counter is a member of the derived Counter_Pool.
          expect(counterPoolNames.has(res.body.name)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });
});
