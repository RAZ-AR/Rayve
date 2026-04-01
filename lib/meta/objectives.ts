/** Maps Claude's campaign objective strings to Meta Marketing API v20.0 OUTCOME_* objectives */
export const OBJECTIVE_MAP: Record<string, string> = {
  CONVERSIONS:     'OUTCOME_SALES',
  REACH:           'OUTCOME_AWARENESS',
  TRAFFIC:         'OUTCOME_TRAFFIC',
  LEAD_GENERATION: 'OUTCOME_LEADS',
  BRAND_AWARENESS: 'OUTCOME_AWARENESS',
  VIDEO_VIEWS:     'OUTCOME_ENGAGEMENT',
}

export function toMetaObjective(objective: string): string {
  return OBJECTIVE_MAP[objective] ?? 'OUTCOME_TRAFFIC'
}
