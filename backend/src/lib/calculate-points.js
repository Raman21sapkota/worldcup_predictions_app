const KNOCKOUT_STAGES = [
  "LAST_32", "LAST_16", "ROUND_OF_16", "ROUND OF 16",
  "QUARTER_FINALS", "QUARTER_FINAL", "QUARTER-FINAL", "QUARTERFINALS",
  "SEMI_FINALS", "SEMI_FINAL", "SEMI-FINAL", "SEMIFINALS",
  "THIRD_PLACE", "THIRD PLACE", "FINAL",
]

function isKnockoutStage(stage) {
  return KNOCKOUT_STAGES.includes(stage?.toUpperCase?.() ?? stage)
}

function calculatePoints(prediction, match) {
  if (prediction.skipped) {
    return { pointsEarned: 0, isCorrect: false, isExactScore: false }
  }

  const { predictedHomeScore, predictedAwayScore, predictedWinner } = prediction
  const { homeScore, awayScore, stage, winner, duration, extraTimeHomeScore, extraTimeAwayScore } = match

  if (
    homeScore === null || awayScore === null ||
    predictedHomeScore === null || predictedHomeScore === undefined ||
    predictedAwayScore === null || predictedAwayScore === undefined
  ) {
    return { pointsEarned: 0, isCorrect: false, isExactScore: false }
  }

  if (isKnockoutStage(stage)) {
    const playedET = duration === "EXTRA_TIME" || duration === "PENALTY_SHOOTOUT"
    const finalHome = playedET && extraTimeHomeScore != null ? extraTimeHomeScore : homeScore
    const finalAway = playedET && extraTimeAwayScore != null ? extraTimeAwayScore : awayScore

    const isExactScore = predictedHomeScore === finalHome && predictedAwayScore === finalAway

    const actualOutcome =
      finalHome > finalAway ? "HOME_WIN"
        : finalHome < finalAway ? "AWAY_WIN"
          : winner === "HOME_TEAM" ? "HOME_WIN"
            : winner === "AWAY_TEAM" ? "AWAY_WIN"
              : "DRAW"

    const predictedOutcome =
      predictedHomeScore > predictedAwayScore ? "HOME_WIN"
        : predictedHomeScore < predictedAwayScore ? "AWAY_WIN"
          : predictedWinner === "HOME_TEAM" ? "HOME_WIN"
            : predictedWinner === "AWAY_TEAM" ? "AWAY_WIN"
              : "DRAW"

    const isCorrect = actualOutcome === predictedOutcome

    if (isExactScore && isCorrect) {
      return { pointsEarned: 5, isCorrect: true, isExactScore: true }
    }
    if (isExactScore) {
      return { pointsEarned: 2, isCorrect: false, isExactScore: true }
    }
    if (isCorrect) {
      return { pointsEarned: 3, isCorrect: true, isExactScore: false }
    }
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
