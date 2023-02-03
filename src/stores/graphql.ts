import { defineStore } from "pinia"
import { GraphQLClient } from "graphql-request"
import { useTokenStore } from "@/stores/token"
import type { Response } from "graphql-request/dist/types"

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
        responseMiddleware: (response: Response<unknown> | Error) => {
          console.log(response)
          if (
            (hasStatus(response) && response.status === 401) ||
            response instanceof Error
          ) {
            tokenStore.invalidateToken()
          }
        },
      })
    },
  },
})

function hasStatus(
  object: Response<unknown> | Error
): object is Response<unknown> {
  return "status" in object
}
