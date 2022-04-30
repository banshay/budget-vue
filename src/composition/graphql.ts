import { GraphQLClient } from "graphql-request"
import { token } from "@/firebase"

const host: string = import.meta.env.VITE_GRAPHQL_ENDPOINT

export default function useGraphQL() {
  const client = async () => {
    return new GraphQLClient(host, {
      headers: {
        Authorization: `Bearer ${await token()}`,
      },
    })
  }

  return { client }
}
