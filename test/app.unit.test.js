"use strict";

const request = require("supertest");
const app = require("../src/app");

/**
 * Unit tests for the Counter_Endpoint focused on missing-name validation and
 * representative success/error response shapes.
 *
 * Validates: Requirements 2.1
 */
describe("GET /counter — missing / invalid name validation (Requirement 2.1)", () => {
  test("absent name → 400 with an error identifying the name as required", async () => {
    const res = await request(app).get("/counter");

    expect(res.status).toBe(400);
    expect(typeof res.body.error).toBe("string");
    expect(res.body.error).toMatch(/required/i);
  });

  test("empty-string name → 400 with a 'required' error", async () => {
    const res = await request(app).get("/counter?name=");

    expect(res.status).toBe(400);
    expect(typeof res.body.error).toBe("string");
    expect(res.body.error).toMatch(/required/i);
  });

  test("whitespace-only name → 400 with a 'required' error", async () => {
    const res = await request(app).get("/counter?name=%20%20");

    expect(res.status).toBe(400);
    expect(typeof res.body.error).toBe("string");
    expect(res.body.error).toMatch(/required/i);
  });
});

describe("GET /counter — representative success and error shapes", () => {
  test("recognized move (Armada) → 200 with non-empty string name and description", async () => {
    const res = await request(app).get("/counter?name=Armada");

    expect(res.status).toBe(200);
    expect(typeof res.body.name).toBe("string");
    expect(res.body.name.length).toBeGreaterThan(0);
    expect(typeof res.body.description).toBe("string");
    expect(res.body.description.length).toBeGreaterThan(0);
  });

  test("unrecognized move → 404 with an 'unrecognized' error", async () => {
    const res = await request(app).get("/counter?name=notarealmove");

    expect(res.status).toBe(404);
    expect(typeof res.body.error).toBe("string");
    expect(res.body.error).toMatch(/unrecognized/i);
  });
});
