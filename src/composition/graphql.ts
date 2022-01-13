import { GraphQLClient } from 'graphql-request'
import { token } from '@/firebase'

export default function useGraphQL() {
  const client = async () => {
    return new GraphQLClient(process.env.VUE_APP_HOST_URL, {
      headers: {
        Authorization: `Bearer ${await token()}`,
      },
    })
  }

  return { client }
}
