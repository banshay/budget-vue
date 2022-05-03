import { defineStore } from "pinia"
import { gql } from "graphql-request"
import { userId } from "@/firebase"
import { useGraphQL } from "@/stores/graphql"
import type { MonetaryRecord } from "@/types/moneyTypes"

export const useMoneyStore = defineStore("money", {
  state: () => ({}),
  actions: {
    async loadBalance() {
      const graphql = useGraphQL()
      const query = gql`
          {
              budget(userId: "${await userId()}"){
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
              monetaryHistory(userId: "${await userId()}", limit: 6){
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
          mutation($input: MonetaryRecordInput) {
              saveMonetaryRecord(userId: "${await userId()}", monetaryRecordInput: $input){
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
