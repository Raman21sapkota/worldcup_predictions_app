function calculatePoints(prediction, match) {
  if (prediction.skipped) {
    return { pointsEarned: 0, isCorrect: false, isExactScore: false }
  }

  const { predictedHomeScore, predictedAwayScore } = prediction

  const effectiveHomeScore = match.extraTimeHomeScore ?? match.homeScore
  const effectiveAwayScore = match.extraTimeAwayScore ?? match.awayScore

  if (
    effectiveHomeScore === null || effectiveAwayScore === null ||
    predictedHomeScore === null || predictedHomeScore === undefined ||
    predictedAwayScore === null || predictedAwayScore === undefined
  ) {
    return { pointsEarned: 0, isCorrect: false, isExactScore: false }
  }

  const isExactScore = predictedHomeScore === effectiveHomeScore && predictedAwayScore === effectiveAwayScore

  if (isExactScore) {
    return { pointsEarned: 3, isCorrect: true, isExactScore: true }
  }

  const actualOutcome = effectiveHomeScore > effectiveAwayScore ? "HOME_WIN" : effectiveHomeScore === effectiveAwayScore ? "DRAW" : "AWAY_WIN"
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
