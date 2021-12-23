import { gql } from 'graphql-request'
import { userId } from '@/firebase'
import useGraphQL from '@/composition/graphql'

export interface MonetaryRecord {
  date: string
  category: string
  amount: number
  monetaryType: string
}

export enum MonetaryType {
  ONE_TIME = 'One Time',
  RECURRING_YEARLY = 'Recurring Yearly',
  RECURRING_BI_YEARLY = 'Recurring Bi-Weekly',
  RECURRING_MONTHLY = 'Recurring Monthly',
  RECURRING_QUARTERLY = 'Recurring Quarterly',
  RECURRING_BI_MONTHLY = 'Recurring Bi-Monthly',
  RECURRING_WEEKLY = 'Recurring Weekly',
  RECURRING_BI_WEEKLY = 'Recurring Bi-Weekly',
  RECURRING_DAILY = 'Recurring Daily',
}

export default function useMoney() {
  const loadBalance = async () => {
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
  }

  const loadActivity = async () => {
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
  }

  const saveMoney = async (moneyRecord: MonetaryRecord) => {
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
  }

  return { loadBalance, loadActivity, saveMoney }
}
