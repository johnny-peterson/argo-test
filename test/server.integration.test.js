"use strict";

const http = require("http");
const request = require("supertest");
const app = require("../src/app");

/**
 * Startup integration test.
 *
 * Rather than exercising the Express app in-process, this test starts a real
 * HTTP listener on a configured port (0 = OS-assigned free port), then makes
 * real HTTP requests against the bound address to confirm the running service
 * accepts requests and responds.
 *
 * Validates: Requirements 4.2 (when the service process starts, the API listens
 * for HTTP requests on a configured port).
 */
describe("Server startup on a configured port (Requirement 4.2)", () => {
  let server;
  let baseUrl;

  beforeAll((done) => {
    // Bind to port 0 so the OS assigns an available port; this exercises the
    // same app.listen path server.js uses without risking a port collision.
    server = app.listen(0, () => {
      const { port } = server.address();
      baseUrl = `http://127.0.0.1:${port}`;
      done();
    });
  });

  afterAll((done) => {
    // Close the listener so no open handles leak between test runs.
    server.close(done);
  });

  test("listens on the bound port and answers a recognized-move request with 200 JSON", (done) => {
    const req = http.get(`${baseUrl}/counter/Armada`, (res) => {
      let raw = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => {
        raw += chunk;
      });
      res.on("end", () => {
        try {
          expect(res.statusCode).toBe(200);
          expect(res.headers["content-type"]).toMatch(/application\/json/);

          const body = JSON.parse(raw);
          expect(typeof body.name).toBe("string");
          expect(body.name.length).toBeGreaterThan(0);
          expect(typeof body.description).toBe("string");
          expect(body.description.length).toBeGreaterThan(0);
          done();
        } catch (err) {
          done(err);
        }
      });
    });
    req.on("error", done);
  });

  test("accepts a request against the bound address via supertest (missing name → 400)", async () => {
    const res = await request(baseUrl).get("/counter");

    expect(res.status).toBe(400);
    expect(res.headers["content-type"]).toMatch(/application\/json/);
    expect(typeof res.body.error).toBe("string");
    expect(res.body.error).toMatch(/required/i);
  });
});
