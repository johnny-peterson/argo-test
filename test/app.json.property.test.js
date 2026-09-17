"use strict";

const fc = require("fast-check");
const request = require("supertest");
const app = require("../src/app");
const { MOVES } = require("../src/moves");

// Feature: capoeira-moves-api, Property 7: All responses are JSON
// Validates: Requirements 4.1
describe("Property 7: All responses are JSON", () => {
  const MOVE_NAMES = MOVES.map((m) => m.name);
  const KNOWN_KEYS = new Set(MOVE_NAMES.map((n) => n.trim().toLowerCase()));

  // Generator for a name string that is NOT a recognized dataset move name
  // (after the same case-insensitive, trimmed comparison the service uses).
  const unrecognizedName = fc
    .string({ minLength: 1, maxLength: 30 })
    .filter((s) => {
      const key = s.trim().toLowerCase();
      return key !== "" && !KNOWN_KEYS.has(key);
    });

  // Generator for a path that is NOT the Counter_Endpoint. It must start with
  // "/" and must not target "/counter" (with or without a sub-segment/query).
  const unknownPath = fc
    .webPath()
    .filter((p) => {
      const first = p.split("?")[0].replace(/\/+$/, "") || "/";
      return first !== "/counter" && !first.startsWith("/counter/");
    });

  // A request descriptor is randomly one of four kinds. Each yields an async
  // function that issues the request via supertest and returns the response.
  const requestArb = fc.oneof(
    // (1) valid recognized move name
    fc.constantFrom(...MOVE_NAMES).map((name) => ({
      kind: "valid",
      send: () => request(app).get(`/counter/${encodeURIComponent(name)}`),
    })),
    // (2) missing name — GET /counter with no name param (expect 400)
    fc.constant({
      kind: "missing-name",
      send: () => request(app).get("/counter"),
    }),
    // (3) unrecognized name
    unrecognizedName.map((name) => ({
      kind: "unrecognized",
      send: () => request(app).get(`/counter/${encodeURIComponent(name)}`),
    })),
    // (4) unknown path
    unknownPath.map((path) => ({
      kind: "unknown-path",
      send: () => request(app).get(path),
    }))
  );

  test("every response (valid, missing-name, unrecognized, unknown-path) is JSON", async () => {
    await fc.assert(
      fc.asyncProperty(requestArb, async (descriptor) => {
        const res = await descriptor.send();

        // Content-Type header advertises JSON.
        expect(res.headers["content-type"]).toMatch(/application\/json/);

        // The body parses as JSON. supertest parses application/json bodies
        // into res.body, so a successful parse yields an object.
        expect(res.body).toBeDefined();
        expect(typeof res.body).toBe("object");
        expect(res.body).not.toBeNull();

        // The missing-name kind must specifically produce a 400 per the spec.
        if (descriptor.kind === "missing-name") {
          expect(res.status).toBe(400);
        }
      }),
      { numRuns: 100 }
    );
  });
});
