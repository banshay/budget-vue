import {gql} from 'graphql-request';
import {userId} from '@/firebase';
import useGraphQL from '@/composition/graphql';

export default function useMoney() {

  const loadBalance = async () => {
    const {client} = useGraphQL()
    const query = gql`
        {
            budget(userId: "${userId()}"){
                balance
            }
        }
    `
    const gqlClient = await client();
    const data = await gqlClient.request(query);
    return data.budget.balance
  }

  return {loadBalance}
}
