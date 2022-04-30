export const visualisationPeriodDisplay = {
  DAILY: "Today",
  WEEKLY: "This week",
  MONTHLY: "This month",
}

export interface Options {
  id: string
  visualisationPeriod: string
  rolloverPolicy: string
}

interface State {
  loaded: boolean
}
