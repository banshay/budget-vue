import { defineStore } from "pinia"
import { gql } from "graphql-request"
import { useGraphQL } from "@/stores/graphql"
import type { MonetaryRecord } from "@/types/moneyTypes"

interface State {
  balance: string | null
  activity: MonetaryRecord[]
}

export const useMoneyStore = defineStore("money", {
  state: (): State => ({
    balance: null,
    activity: [],
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
  },
})
