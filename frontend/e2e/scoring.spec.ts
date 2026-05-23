import { test, expect } from "@playwright/test"
import { calculatePoints } from "../src/lib/calculate-points"

type CalculatePointsResult = ReturnType<typeof calculatePoints>

function expectResult(
  actual: CalculatePointsResult,
  expected: { pointsEarned: number; isCorrect: boolean; isExactScore: boolean }
) {
  expect(actual.pointsEarned).toBe(expected.pointsEarned)
  expect(actual.isCorrect).toBe(expected.isCorrect)
  expect(actual.isExactScore).toBe(expected.isExactScore)
}

test.describe("calculatePoints", () => {
  test("exact home win score gives 3 points", () => {
    expectResult(
      calculatePoints(
        { predictedHomeScore: 2, predictedAwayScore: 1, skipped: false },
        { homeScore: 2, awayScore: 1 }
      ),
      { pointsEarned: 3, isCorrect: true, isExactScore: true }
    )
  })

  test("correct outcome but wrong score gives 2 points", () => {
    expectResult(
      calculatePoints(
        { predictedHomeScore: 3, predictedAwayScore: 0, skipped: false },
        { homeScore: 2, awayScore: 1 }
      ),
      { pointsEarned: 2, isCorrect: true, isExactScore: false }
    )
  })

  test("wrong outcome gives 0 points", () => {
    expectResult(
      calculatePoints(
        { predictedHomeScore: 0, predictedAwayScore: 2, skipped: false },
        { homeScore: 2, awayScore: 1 }
      ),
      { pointsEarned: 0, isCorrect: false, isExactScore: false }
    )
  })

  test("correct draw outcome but wrong score gives 2 points", () => {
    expectResult(
      calculatePoints(
        { predictedHomeScore: 1, predictedAwayScore: 1, skipped: false },
        { homeScore: 0, awayScore: 0 }
      ),
      { pointsEarned: 2, isCorrect: true, isExactScore: false }
    )
  })

  test("exact draw score gives 3 points", () => {
    expectResult(
      calculatePoints(
        { predictedHomeScore: 0, predictedAwayScore: 0, skipped: false },
        { homeScore: 0, awayScore: 0 }
      ),
      { pointsEarned: 3, isCorrect: true, isExactScore: true }
    )
  })

  test("exact away win score gives 3 points", () => {
    expectResult(
      calculatePoints(
        { predictedHomeScore: 1, predictedAwayScore: 3, skipped: false },
        { homeScore: 1, awayScore: 3 }
      ),
      { pointsEarned: 3, isCorrect: true, isExactScore: true }
    )
  })

  test("correct away win outcome gives 2 points", () => {
    expectResult(
      calculatePoints(
        { predictedHomeScore: 0, predictedAwayScore: 4, skipped: false },
        { homeScore: 1, awayScore: 3 }
      ),
      { pointsEarned: 2, isCorrect: true, isExactScore: false }
    )
  })

  test("skipped prediction gives 0 points", () => {
    expectResult(
      calculatePoints(
        { predictedHomeScore: null, predictedAwayScore: null, skipped: true },
        { homeScore: 2, awayScore: 1 }
      ),
      { pointsEarned: 0, isCorrect: false, isExactScore: false }
    )
  })

  test("null match scores give 0 points", () => {
    expectResult(
      calculatePoints(
        { predictedHomeScore: 2, predictedAwayScore: 1, skipped: false },
        { homeScore: null, awayScore: null }
      ),
      { pointsEarned: 0, isCorrect: false, isExactScore: false }
    )
  })

  test("null prediction scores give 0 points", () => {
    expectResult(
      calculatePoints(
        { predictedHomeScore: null, predictedAwayScore: null, skipped: false },
        { homeScore: 2, awayScore: 1 }
      ),
      { pointsEarned: 0, isCorrect: false, isExactScore: false }
    )
  })

  test("high scoring exact match gives 3 points", () => {
    expectResult(
      calculatePoints(
        { predictedHomeScore: 5, predictedAwayScore: 3, skipped: false },
        { homeScore: 5, awayScore: 3 }
      ),
      { pointsEarned: 3, isCorrect: true, isExactScore: true }
    )
  })

  test("wrong outcome on draw match gives 0 points", () => {
    expectResult(
      calculatePoints(
        { predictedHomeScore: 2, predictedAwayScore: 0, skipped: false },
        { homeScore: 1, awayScore: 1 }
      ),
      { pointsEarned: 0, isCorrect: false, isExactScore: false }
    )
  })
})
