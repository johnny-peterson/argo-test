"use strict";

const { CATEGORIES, MOVES } = require("../src/moves");

// Unit tests for the Move_Dataset shape.
// _Requirements: 3.1_
describe("Move_Dataset shape", () => {
  test("contains exactly 24 moves", () => {
    expect(MOVES).toHaveLength(24);
  });

  test("represents all five categories at least once", () => {
    const categoriesInDataset = new Set(MOVES.map((move) => move.category));
    const expectedCategories = Object.values(CATEGORIES);

    expect(expectedCategories).toHaveLength(5);
    for (const category of expectedCategories) {
      expect(categoriesInDataset).toContain(category);
    }
  });
});
