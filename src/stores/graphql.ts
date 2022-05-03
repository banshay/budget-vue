import { defineStore } from "pinia"
import { GraphQLClient } from "graphql-request"
import { token } from "@/firebase"

const host: string = import.meta.env.VITE_GRAPHQL_ENDPOINT

export const useGraphQL = defineStore("graphql", {
  state: () => ({
    client: null as GraphQLClient | null,
  }),
  actions: {
    async createGraphQlClient() {
      this.client = new GraphQLClient(host, {
        headers: {
          Authorization: `Bearer ${await token()}`,
          Accept: "application/json",
        },
      })
    },
  },
})
