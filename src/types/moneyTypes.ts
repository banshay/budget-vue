export interface MonetaryRecord {
  date: string
  category: string
  amount: number
  monetaryType: string
}

export enum MonetaryType {
  ONE_TIME = "One Time",
  RECURRING_YEARLY = "Recurring Yearly",
  RECURRING_BI_YEARLY = "Recurring Bi-Weekly",
  RECURRING_MONTHLY = "Recurring Monthly",
  RECURRING_QUARTERLY = "Recurring Quarterly",
  RECURRING_BI_MONTHLY = "Recurring Bi-Monthly",
  RECURRING_WEEKLY = "Recurring Weekly",
  RECURRING_BI_WEEKLY = "Recurring Bi-Weekly",
  RECURRING_DAILY = "Recurring Daily",
}
