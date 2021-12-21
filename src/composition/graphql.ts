import {GraphQLClient} from 'graphql-request';
import {token} from '@/firebase';

export default function useGraphQL() {

  const client = async () => {
    return new GraphQLClient('http://localhost:8050/graphql', {
      headers: {
        "Authorization": `Bearer ${await token()}`
      }
    })
  }

  return {client}
}
