import { defineStore } from "pinia"
import { gql } from "graphql-request"
import { useGraphQL } from "@/stores/graphql"
import type {
  ExpenseByDay,
  MonetaryRecord,
  MonetarySlice,
} from "@/types/moneyTypes"
import { Temporal } from "@js-temporal/polyfill"

interface State {
  balance: string | null
  activity: MonetaryRecord[]
  moneyByDate: Record<string, MonetarySlice[]>
  categoryDateMap: Record<string, MonetarySlice[]>
}

export const useMoneyStore = defineStore("money", {
  state: (): State => ({
    balance: null,
    activity: [],
    moneyByDate: {},
    categoryDateMap: {},
  }),
  actions: {
    async loadBalance(date: string | null) {
      const graphql = useGraphQL()
      const query = gql`
        query Budget($date: String) {
          budget(date: $date) {
            balance
          }
        }
      `
      const data = await graphql.client?.request(query, { date })
      this.balance = data?.budget?.balance
    },

    async loadActivity() {
      const graphql = useGraphQL()
      const query = gql`
        {
          monetaryHistory(limit: 6) {
            date
            category
            amount
          }
        }
      `
      const data = await graphql.client?.request(query)
      this.activity = data?.monetaryHistory
    },

    async saveMoney(moneyRecord: MonetaryRecord) {
      const graphql = useGraphQL()
      const query = gql`
        mutation ($input: MonetaryRecordInput) {
          saveMonetaryRecord(monetaryRecordInput: $input) {
            id
          }
        }
      `
      const input = {
        input: {
          ...moneyRecord,
        },
      }

      return graphql.client?.request(query, input)
    },
    async deleteMoney(slice: MonetarySlice) {
      const graphql = useGraphQL()
      const query = gql`
        mutation ($input: ID) {
          deleteMonetaryRecord(id: $input)
        }
      `

      await graphql.client?.request(query, { input: slice.sourceId })
    },

    async loadMoneyByDate(from: string, to: string) {
      const graphql = useGraphQL()
      const query = gql`
        query ($range: DateRange) {
          expenseByDay(range: $range) {
            day
            expenses {
              amount
              category
              sourceId
            }
            sum
          }
        }
      `

      const data = await graphql.client?.request(query, { range: { from, to } })
      this.moneyByDate = data.expenseByDay.reduce(
        (acc: Record<string, MonetarySlice[]>, grouped: ExpenseByDay) => ({
          ...acc,
          [grouped.day]: grouped.expenses,
        }),
        {} as Record<string, MonetarySlice[]>
      )
      this.categoryDateMap = buildCategoryDateMap(this.moneyByDate)
    },
    getDateCategoryExpense(date: string, category: string): MonetarySlice[] {
      const slices = this.categoryDateMap[`${date}_${category}`]
      if (category === "Rollover") {
        return this._collapseRollover(slices)
      }
      return slices
    },
    _collapseRollover(slices: MonetarySlice[]): MonetarySlice[] {
      if (!slices) {
        return []
      }
      return [
        slices.reduce(
          (prev: MonetarySlice, current: MonetarySlice) => {
            return {
              sourceId: "",
              category: "Rollover",
              amount: (
                (Number.parseFloat(prev.amount) ?? 0) +
                (Number.parseFloat(current.amount) ?? 0)
              ).toFixed(2),
            }
          },
          { amount: "0", category: "Rollover", sourceId: "" }
        ),
      ]
    },

    async doRollover() {
      const graphql = useGraphQL()
      const query = gql`
        mutation ($range: DateRange) {
          rollover(range: $range)
        }
      `
      await graphql.client?.request(query, {
        range: {
          from: "2023-03-01",
          to: Temporal.Now.plainDateISO().subtract({ days: 1 }).toString(),
        },
      })
    },
  },
})

function buildCategoryDateMap(
  moneyByDate: Record<string, MonetarySlice[]>
): Record<string, MonetarySlice[]> {
  return Object.entries(moneyByDate)
    .flatMap((entry) => {
      const expensesByCategory = groupExpensesByCategory(entry[1])
      return Object.entries(expensesByCategory).map(
        (expenseCategory: [string, MonetarySlice[]]) => ({
          [`${entry[0]}_${expenseCategory[0]}`]: expenseCategory[1],
        })
      )
    })
    .reduce((acc: Record<string, MonetarySlice[]>, entry) => {
      const entries = Object.entries(entry)
      return {
        ...acc,
        [entries[0][0]]: entries[0][1],
      }
    }, {} as Record<string, MonetarySlice[]>)
}

function groupExpensesByCategory(
  slices: MonetarySlice[]
): Record<string, MonetarySlice[]> {
  return slices.reduce(
    (acc, slice) => ({
      ...acc,
      [slice.category]: [...(acc[slice.category] ?? []), slice],
    }),
    {} as Record<string, MonetarySlice[]>
  )
}
