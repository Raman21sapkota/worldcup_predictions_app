import { matchRepository } from "../repositories/index.js"
import { PredictionService } from "./predictionService.js"

const FOOTBALL_API_BASE = "https://api.football-data.org/v4"
const predictionService = new PredictionService()

function mapStatus(apiStatus) {
  switch (apiStatus) {
    case "SCHEDULED":
    case "TIMED":
      return "UPCOMING"
    case "IN_PLAY":
    case "PAUSED":
      return "LIVE"
    case "FINISHED":
    case "AWARDED":
      return "FINISHED"
    default:
      return "UPCOMING"
  }
}

export class SyncService {
  async syncMatches() {
    const apiKey = process.env.FOOTBALL_API_KEY
    if (!apiKey) {
      console.error("FOOTBALL_API_KEY is not set")
      return { created: 0, updated: 0, finished: 0 }
    }

    console.log("Fetching matches from Football-Data.org...")
    const response = await fetch(`${FOOTBALL_API_BASE}/competitions/2000/matches`, {
      headers: { "X-Auth-Token": apiKey },
      cache: "no-store",
    })

    if (!response.ok) {
      console.error(`API responded with ${response.status} ${response.statusText}`)
      return { created: 0, updated: 0, finished: 0 }
    }

    const data = await response.json()
    if (!data.matches || !Array.isArray(data.matches)) {
      console.error("No matches array in API response")
      return { created: 0, updated: 0, finished: 0 }
    }

    console.log(`Received ${data.matches.length} matches from API`)

    let created = 0, updated = 0, finished = 0

    for (const apiMatch of data.matches) {
      const status = mapStatus(apiMatch.status)
      const existing = await matchRepository.findByExternalApiId(apiMatch.id)
      const wasPreviouslyFinished = existing?.status === "FINISHED"

      const matchData = {
        homeTeam: apiMatch.homeTeam.name || "TBD",
        awayTeam: apiMatch.awayTeam.name || "TBD",
        homeFlag: apiMatch.homeTeam.crest || null,
        awayFlag: apiMatch.awayTeam.crest || null,
        stage: apiMatch.stage,
        kickoffTime: new Date(apiMatch.utcDate),
        status,
        homeScore: apiMatch.score.fullTime.home,
        awayScore: apiMatch.score.fullTime.away,
        extraTimeHomeScore: apiMatch.score.extraTime?.home ?? null,
        extraTimeAwayScore: apiMatch.score.extraTime?.away ?? null,
        penaltyHomeScore: apiMatch.score.penalties?.home ?? null,
        penaltyAwayScore: apiMatch.score.penalties?.away ?? null,
        winner: apiMatch.score.winner || null,
        duration: apiMatch.score.duration || null,
        syncedAt: new Date(),
      }

      await matchRepository.upsertByExternalApiId(apiMatch.id, matchData)

      if (!existing) { created++ } else { updated++ }

      if (status === "FINISHED" && !wasPreviouslyFinished) {
        const dbMatch = await matchRepository.findByExternalApiId(apiMatch.id)
        if (dbMatch) {
          await predictionService.awardMatchPoints(dbMatch.id)
          finished++
        }
      }
    }

    console.log(`Sync complete: ${created} created, ${updated} updated, ${finished} newly finished`)
    return { created, updated, finished }
  }

  async getLastSyncTime() {
    const latest = await matchRepository.findMostRecentSync()
    return latest?.syncedAt || null
  }
}
