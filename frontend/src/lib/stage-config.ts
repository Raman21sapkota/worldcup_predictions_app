export const stageColors: Record<string, string> = {
  GROUP_STAGE: "bg-fifa-blue/15 text-fifa-blue border-fifa-blue/30",
  "GROUP STAGE": "bg-fifa-blue/15 text-fifa-blue border-fifa-blue/30",
  LAST_32: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
  LAST_16: "bg-gold/15 text-gold border-gold/30",
  "ROUND OF 16": "bg-gold/15 text-gold border-gold/30",
  ROUND_OF_16: "bg-gold/15 text-gold border-gold/30",
  QUARTERFINALS: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  QUARTER_FINALS: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  "QUARTER-FINAL": "bg-purple-500/15 text-purple-400 border-purple-500/30",
  QUARTER_FINAL: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  SEMIFINALS: "bg-emerald/15 text-emerald border-emerald/30",
  SEMI_FINALS: "bg-emerald/15 text-emerald border-emerald/30",
  "SEMI-FINAL": "bg-emerald/15 text-emerald border-emerald/30",
  SEMI_FINAL: "bg-emerald/15 text-emerald border-emerald/30",
  "THIRD PLACE": "bg-orange-500/15 text-orange-400 border-orange-500/30",
  THIRD_PLACE: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  FINAL: "bg-gold/20 text-gold border-gold/40",
}

export function isKnockoutStage(stage: string): boolean {
  return !["GROUP_STAGE", "GROUP STAGE"].includes(stage)
}

export function isStageMatch(matchStage: string, filterKey: string): boolean {
  if (filterKey === "__all__") return true
  const filter = STAGE_FILTERS.find((f) => f.key === filterKey)
  return filter?.stages.includes(matchStage) ?? true
}

export interface StageFilter {
  key: string
  label: string
  stages: string[]
}

export const STAGE_FILTERS: StageFilter[] = [
  { key: "__all__", label: "All Stages", stages: [] },
  { key: "GROUP_STAGE", label: "Group Stage", stages: ["GROUP_STAGE", "GROUP STAGE"] },
  { key: "LAST_32", label: "Round of 32", stages: ["LAST_32"] },
  { key: "ROUND_OF_16", label: "Round of 16", stages: ["ROUND_OF_16", "ROUND OF 16", "LAST_16"] },
  { key: "QUARTER_FINAL", label: "Quarter-finals", stages: ["QUARTER_FINAL", "QUARTER-FINAL", "QUARTERFINALS", "QUARTER_FINALS"] },
  { key: "SEMI_FINAL", label: "Semi-finals", stages: ["SEMI_FINAL", "SEMI-FINAL", "SEMIFINALS", "SEMI_FINALS"] },
  { key: "THIRD_PLACE", label: "Third Place", stages: ["THIRD_PLACE", "THIRD PLACE"] },
  { key: "FINAL", label: "Final", stages: ["FINAL"] },
]

export function formatStage(stage: string): string {
  const displayNames: Record<string, string> = {
    GROUP_STAGE: "Group Stage",
    "GROUP STAGE": "Group Stage",
    LAST_32: "Round of 32",
    LAST_16: "Round of 16",
    "ROUND OF 16": "Round of 16",
    ROUND_OF_16: "Round of 16",
    QUARTERFINALS: "Quarter-finals",
    QUARTER_FINALS: "Quarter-finals",
    "QUARTER-FINAL": "Quarter-finals",
    QUARTER_FINAL: "Quarter-finals",
    SEMIFINALS: "Semi-finals",
    SEMI_FINALS: "Semi-finals",
    "SEMI-FINAL": "Semi-finals",
    SEMI_FINAL: "Semi-finals",
    "THIRD PLACE": "Third Place",
    THIRD_PLACE: "Third Place",
    FINAL: "Final",
  }
  return displayNames[stage] || stage
}
