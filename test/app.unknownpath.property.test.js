"use strict";

const fc = require("fast-check");
const request = require("supertest");
const app = require("../src/app");

// Feature: capoeira-moves-api, Property 8: Unknown paths return 404
// Validates: Requirements 4.3
describe("Property 8: Unknown paths return 404", () => {
  // Safe path segments: alphanumerics and hyphens only, so the generated path
  // is always a valid request target without needing url-encoding.
  const segment = fc
    .stringMatching(/^[A-Za-z0-9-]+$/)
    .filter((s) => s.length > 0);

  // Build a "/"-prefixed path from one or more safe segments, then exclude
  // anything that targets the Counter_Endpoint. GET /counter (exactly) returns
  // 400 and GET /counter/:name returns 200/404, so we drop any path whose first
  // segment is "counter" to isolate genuinely unknown paths.
  const unknownPath = fc
    .array(segment, { minLength: 1, maxLength: 5 })
    .map((segments) => "/" + segments.join("/"))
    .filter((path) => {
      const first = path.split("/")[1] || "";
      return first.toLowerCase() !== "counter";
    });

  test("any non-endpoint path returns HTTP status 404", async () => {
    await fc.assert(
      fc.asyncProperty(unknownPath, async (path) => {
        const res = await request(app).get(path);
        expect(res.status).toBe(404);
      }),
      { numRuns: 100 }
    );
  });
});
