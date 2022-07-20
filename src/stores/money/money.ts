import { defineStore } from "pinia"
import { gql } from "graphql-request"
import { useGraphQL } from "@/stores/graphql"
import type { Budgetplan, MonetaryRecord } from "@/types/moneyTypes"

interface State {
  budgetplan: Budgetplan | null
}

export const useMoneyStore = defineStore("money", {
  state: (): State => ({
    budgetplan: null,
  }),
  actions: {
    async loadBalance() {
      const graphql = useGraphQL()
      const query = gql`
        {
          budget {
            balance
          }
        }
      `
      const data = await graphql.client?.request(query)
      return data.budget.balance
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
      return data.monetaryHistory
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

    async loadBudgetplan() {
      const graphql = useGraphQL()
      const query = gql`
        {
          budgetplan {
            planningPeriod
            categories {
              category
              currentSpending
              total
            }
          }
        }
      `
      const data = await graphql.client?.request(query)
      this.budgetplan = data.budgetplan
    },

    async saveBudgetplan(budgetplan: Budgetplan) {
      const graphql = useGraphQL()
      const query = gql`
        mutation ($input: BudgetplanInput) {
          saveBudgetplan(budgetplan: $input) {
            planningPeriod
            categories {
              category
              currentSpending
              total
            }
          }
        }
      `

      const input = {
        input: {
          ...budgetplan,
          categories: [...budgetplan.categories.filter((x) => x.category)],
        },
      }

      const data = await graphql.client?.request(query, input)
      this.budgetplan = data.saveBudgetplan
    },

    async deleteBudgetplan() {
      const graphql = useGraphQL()
      const query = gql`
        mutation {
          deleteBudgetplan
        }
      `

      const success = await graphql.client?.request(query)
      if (success) {
        this.budgetplan = null
      }
    },
  },
})
