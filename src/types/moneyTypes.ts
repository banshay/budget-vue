export interface MonetaryRecord {
  id?: string
  date: string
  end?: string
  category: string
  amount: number | null
  monetaryType: string
  title: string
}

export interface RecurringRecord extends MonetaryRecord {
  daily: number
  monthly: number
}

export type MonetarySlice = {
  title: string
  amount: string
  category: string
  sourceId: string
}

export type ExpenseByDay = {
  day: string
  expenses: MonetarySlice[]
}

export enum MonetaryType {
  ONE_TIME = "One Time",
  RECURRING_YEARLY = "Recurring Yearly",
  RECURRING_MONTHLY = "Recurring Monthly",
  RECURRING_WEEKLY = "Recurring Weekly",
  RECURRING_BI_WEEKLY = "Recurring Bi-Weekly",
  RECURRING_DAILY = "Recurring Daily",
  RECURRING_RANGE = "Recurring Range",
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
