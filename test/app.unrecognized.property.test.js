"use strict";

const request = require("supertest");
const fc = require("fast-check");
const app = require("../src/app");
const { MOVES } = require("../src/moves");
const { normalize } = require("../src/moveService");

// Feature: capoeira-moves-api, Property 5: Unrecognized names are rejected
// Validates: Requirements 2.2
describe("Property 5: Unrecognized names are rejected", () => {
  // The set of normalized (trim + lowercase) names present in the dataset.
  // Any generated string whose normalized form is in this set would resolve
  // to a real move, so it must be excluded from the "unrecognized" input space.
  const VALID_NORMALIZED = new Set(MOVES.map((m) => normalize(m.name)));

  test("names that match no dataset move return 404 with an unrecognized error", async () => {
    await fc.assert(
      fc.asyncProperty(fc.string({ minLength: 1 }), async (raw) => {
        const key = normalize(raw);

        // Filter out inputs that are not truly "unrecognized":
        //  - empty after trim => the API returns 400 (missing name), not 404
        //  - normalized form matches a real move => it would resolve to 200
        fc.pre(key !== "");
        fc.pre(!VALID_NORMALIZED.has(key));

        const res = await request(app).get("/counter").query({ name: raw });

        expect(res.status).toBe(404);
        expect(res.body.error).toMatch(/unrecognized/i);
      }),
      { numRuns: 100 }
    );
  });
});
