"use strict";

const app = require("./app");

// Port is read from the environment with a sensible default for local runs.
const DEFAULT_PORT = 3000;
const PORT = process.env.PORT || DEFAULT_PORT;

const server = app.listen(PORT, () => {
  console.log(`Capoeira Moves API listening on port ${PORT}`);
});

module.exports = server;
