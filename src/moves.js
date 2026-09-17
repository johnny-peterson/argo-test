"use strict";

/**
 * Category constants for the Capoeira Move_Dataset.
 * The DEFENSES and SWEEPS categories together form the Counter_Pool.
 */
const CATEGORIES = {
  FUNDAMENTALS: "Fundamental Movements & Stances",
  KICKS: "Kicks",
  DEFENSES: "Defenses & Evasions",
  SWEEPS: "Sweeps & Takedowns",
  ACROBATICS: "Acrobatics & Flourishes",
};

/**
 * The fixed in-memory Move_Dataset: exactly 24 moves spanning all five
 * categories. Each move has a non-empty name, a non-empty description, and a
 * category drawn from CATEGORIES.
 */
const MOVES = [
  // --- Fundamental Movements & Stances (4) ---
  {
    name: "Ginga",
    description:
      "The foundational rocking step of Capoeira, a constant back-and-forth sway that keeps the player mobile and unpredictable.",
    category: CATEGORIES.FUNDAMENTALS,
  },
  {
    name: "Cocorinha",
    description:
      "A low protective crouch performed by dropping onto the balls of the feet, used to duck under attacks.",
    category: CATEGORIES.FUNDAMENTALS,
  },
  {
    name: "Negativa",
    description:
      "A low ground position with one leg extended and the body tucked, serving as both defense and a springboard into other moves.",
    category: CATEGORIES.FUNDAMENTALS,
  },
  {
    name: "Role",
    description:
      "A rolling transition close to the ground that repositions the player around an opponent while staying low and protected.",
    category: CATEGORIES.FUNDAMENTALS,
  },

  // --- Kicks (6) ---
  {
    name: "Meia Lua de Frente",
    description:
      "A crescent kick that swings the leg upward across the body in a half-moon arc from the outside inward.",
    category: CATEGORIES.KICKS,
  },
  {
    name: "Armada",
    description:
      "A spinning outward crescent kick powered by a full rotation of the body for reach and momentum.",
    category: CATEGORIES.KICKS,
  },
  {
    name: "Queixada",
    description:
      "A descending crescent kick that sweeps down and across, targeting the side of the opponent's head.",
    category: CATEGORIES.KICKS,
  },
  {
    name: "Bencao",
    description:
      "A straight frontal push-kick delivered with the sole of the foot toward the opponent's chest.",
    category: CATEGORIES.KICKS,
  },
  {
    name: "Martelo",
    description:
      "A hammer-like roundhouse kick striking with the instep or shin in a fast horizontal arc.",
    category: CATEGORIES.KICKS,
  },
  {
    name: "Meia Lua de Compasso",
    description:
      "A powerful spinning compass kick where one hand touches the ground as the leg carves a wide low-to-high arc.",
    category: CATEGORIES.KICKS,
  },

  // --- Defenses & Evasions (5) --- part of Counter_Pool
  {
    name: "Esquiva Baixa",
    description:
      "A low evasive dodge that drops the torso and bends the knees to slip beneath an incoming kick.",
    category: CATEGORIES.DEFENSES,
  },
  {
    name: "Esquiva Lateral",
    description:
      "A sideways evasion that shifts weight onto one leg and leans the body clear of a linear attack.",
    category: CATEGORIES.DEFENSES,
  },
  {
    name: "Esquiva de Frente",
    description:
      "A forward-leaning dodge that folds the upper body down and away to avoid a high crescent kick.",
    category: CATEGORIES.DEFENSES,
  },
  {
    name: "Cabecada",
    description:
      "A defensive head-butt that ducks under an attack and drives forward into the opponent's midsection.",
    category: CATEGORIES.DEFENSES,
  },
  {
    name: "Resistencia",
    description:
      "A bracing evasion where the arm and body absorb and deflect pressure while maintaining balance.",
    category: CATEGORIES.DEFENSES,
  },

  // --- Sweeps & Takedowns (5) --- part of Counter_Pool
  {
    name: "Rasteira",
    description:
      "A sweeping leg hook that catches the opponent's supporting leg to topple them off balance.",
    category: CATEGORIES.SWEEPS,
  },
  {
    name: "Banda",
    description:
      "A takedown that traps a leg and uses body rotation to throw the opponent to the ground.",
    category: CATEGORIES.SWEEPS,
  },
  {
    name: "Vingativa",
    description:
      "A close-range takedown that steps behind the opponent and uses the hip and shoulder to unbalance them.",
    category: CATEGORIES.SWEEPS,
  },
  {
    name: "Tesoura",
    description:
      "A scissor takedown that traps the opponent's legs between the player's own and twists them down.",
    category: CATEGORIES.SWEEPS,
  },
  {
    name: "Arrastao",
    description:
      "A two-handed pull-down that seizes the opponent's legs and drags them off their feet.",
    category: CATEGORIES.SWEEPS,
  },

  // --- Acrobatics & Flourishes (4) ---
  {
    name: "Au",
    description:
      "The Capoeira cartwheel, performed slowly and controlled to move around the roda and set up attacks or escapes.",
    category: CATEGORIES.ACROBATICS,
  },
  {
    name: "Macaco",
    description:
      "A backward monkey flip launched from a crouch, planting the hands and kicking the legs overhead to rise.",
    category: CATEGORIES.ACROBATICS,
  },
  {
    name: "Au Batido",
    description:
      "A broken cartwheel that pauses mid-inversion to snap a kick, blending acrobatics with attack.",
    category: CATEGORIES.ACROBATICS,
  },
  {
    name: "Bananeira",
    description:
      "A controlled handstand used to display balance and to transition between ground and standing play.",
    category: CATEGORIES.ACROBATICS,
  },
];

module.exports = { CATEGORIES, MOVES };
