import { defineStore } from "pinia"
import useGraphQL from "@/composition/graphql"
import { gql } from "graphql-request"
import { userId } from "@/firebase"
import type { MonetaryRecord } from "@/composition/money"

export const useMoneyStore = defineStore("money", {
  state: () => ({}),
  actions: {
    async loadBalance() {
      const { client } = useGraphQL()
      const query = gql`
          {
              budget(userId: "${await userId()}"){
                  balance
              }
          }
      `
      const gqlClient = await client()
      const data = await gqlClient.request(query)
      return data.budget.balance
    },

    async loadActivity() {
      const { client } = useGraphQL()
      const query = gql`
          {
              monetaryHistory(userId: "${await userId()}", limit: 6){
                  date
                  category
                  amount
              }
          }
      `
      const graphQLClient = await client()
      const data = await graphQLClient.request(query)
      return data.monetaryHistory
    },

    async saveMoney(moneyRecord: MonetaryRecord) {
      const { client } = useGraphQL()
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

      const graphQLClient = await client()
      return graphQLClient.request(query, input)
    },
  },
})
