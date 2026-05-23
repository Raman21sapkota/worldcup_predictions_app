function calculatePoints(prediction, match) {
  if (prediction.skipped) {
    return { pointsEarned: 0, isCorrect: false, isExactScore: false }
  }

  const { predictedHomeScore, predictedAwayScore } = prediction
  const { homeScore, awayScore } = match

  if (
    homeScore === null || awayScore === null ||
    predictedHomeScore === null || predictedHomeScore === undefined ||
    predictedAwayScore === null || predictedAwayScore === undefined
  ) {
    return { pointsEarned: 0, isCorrect: false, isExactScore: false }
  }

  const isExactScore = predictedHomeScore === homeScore && predictedAwayScore === awayScore

  if (isExactScore) {
    return { pointsEarned: 3, isCorrect: true, isExactScore: true }
  }

  const actualOutcome = homeScore > awayScore ? "HOME_WIN" : homeScore === awayScore ? "DRAW" : "AWAY_WIN"
  const predictedOutcome =
    predictedHomeScore > predictedAwayScore ? "HOME_WIN"
      : predictedHomeScore === predictedAwayScore ? "DRAW" : "AWAY_WIN"

  const isCorrect = actualOutcome === predictedOutcome

  if (isCorrect) {
    return { pointsEarned: 2, isCorrect: true, isExactScore: false }
  }

  return { pointsEarned: 0, isCorrect: false, isExactScore: false }
}

export { calculatePoints }
