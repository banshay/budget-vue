import { defineStore } from "pinia"
import { gql } from "graphql-request"
import { useGraphQL } from "@/stores/graphql"
import type { MonetaryRecord } from "@/types/moneyTypes"

export const useMoneyStore = defineStore("money", {
  state: () => ({}),
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
  },
})
