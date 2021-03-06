export interface MonetaryRecord {
  date: string
  category: string
  amount: number
  monetaryType: string
}

export enum MonetaryType {
  ONE_TIME = "One Time",
  RECURRING_YEARLY = "Recurring Yearly",
  RECURRING_MONTHLY = "Recurring Monthly",
  RECURRING_WEEKLY = "Recurring Weekly",
  RECURRING_BI_WEEKLY = "Recurring Bi-Weekly",
  RECURRING_DAILY = "Recurring Daily",
}

export interface Budgetplan {
  planningPeriod: PlanningPeriod | null
  categories: CategoryTotal[]
  currentSpending?: CategorySpending[]
}

export enum PlanningPeriod {
  WEEKLY = "Weekly",
  MONTHLY = "Monthly",
}

export interface CategoryTotal {
  category: string
  total: number
}

export interface CategorySpending {
  category: string
  spending: number
}
