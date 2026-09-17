"use strict";

const express = require("express");
const { MOVES } = require("./moves");
const {
  normalize,
  findMove,
  deriveCounterPool,
  selectRandomCounter,
} = require("./moveService");

/**
 * The Counter_Endpoint route. The attacking move name is supplied either as a
 * path segment (`GET /counter/:name`) or a query parameter (`GET /counter?name=`).
 */
const COUNTER_ENDPOINT = "/counter";

/**
 * Extract the raw attacking move name from the request. Prefers the path
 * parameter, then falls back to the `name` query parameter.
 *
 * @param {import('express').Request} req
 * @returns {string|undefined} The raw name, or undefined if none supplied.
 */
function extractMoveName(req) {
  if (req.params && typeof req.params.name === "string") {
    return req.params.name;
  }
  if (req.query && typeof req.query.name === "string") {
    return req.query.name;
  }
  return undefined;
}

/**
 * Shared handler for the Counter_Endpoint. Validates the attacking move name,
 * resolves a random counter, and returns the appropriate JSON response.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
function counterHandler(req, res) {
  const rawName = extractMoveName(req);

  if (rawName === undefined || normalize(rawName) === "") {
    return res.status(400).json({ error: "Attacking move name is required." });
  }

  const attackingMove = findMove(MOVES, rawName);
  if (!attackingMove) {
    return res
      .status(404)
      .json({ error: `Unrecognized move name: '${rawName}'.` });
  }

  const counter = selectRandomCounter(deriveCounterPool(MOVES));
  return res
    .status(200)
    .json({ name: counter.name, description: counter.description });
}

/**
 * Build and return a configured Express app. Does not bind a port — callers
 * (e.g. server.js) are responsible for calling app.listen.
 *
 * @returns {import('express').Express} The configured Express application.
 */
function createApp() {
  const app = express();

  app.get(`${COUNTER_ENDPOINT}/:name`, counterHandler);
  app.get(COUNTER_ENDPOINT, counterHandler);

  // Catch-all for any other path.
  app.use((req, res) => {
    res.status(404).json({ error: "Not found." });
  });

  return app;
}

module.exports = createApp();
module.exports.createApp = createApp;
module.exports.COUNTER_ENDPOINT = COUNTER_ENDPOINT;
