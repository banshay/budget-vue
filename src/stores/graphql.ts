import { defineStore } from "pinia"
import { GraphQLClient } from "graphql-request"
import { useTokenStore } from "@/stores/token"

const host: string = import.meta.env.VITE_GRAPHQL_ENDPOINT

export const useGraphQL = defineStore("graphql", {
  state: () => ({
    client: null as GraphQLClient | null,
  }),
  actions: {
    async createGraphQlClient() {
      const tokenStore = useTokenStore()

      this.client = new GraphQLClient(host, {
        headers: {
          Authorization: `${tokenStore.getToken()}`,
          Accept: "application/json",
        },
      })
    },
  },
})
