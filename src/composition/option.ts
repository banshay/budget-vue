import { userId } from '@/firebase'
import { gql } from 'graphql-request'
import useGraphQL from '@/composition/graphql'
import { reactive, readonly } from 'vue'

const initial = {
  id: '',
  visualisationPeriod: '',
  rolloverPolicy: '',
  loaded: false,
}
const _options = reactive<Options & State>(initial)

export default function useOption() {
  const updateOption = async (options: Options) => {
    const { client } = useGraphQL()

    const uid = await userId()
    const optionInput = {
      input: {
        ...options,
        id: uid,
      },
    }
    const query = gql`
      mutation updateOption($input: OptionInput) {
        updateOption(option: $input) {
          visualisationPeriod
          rolloverPolicy
        }
      }
    `
    const graphQLClient = await client()
    const data = await graphQLClient.request(query, optionInput)
    updateOptions(data.updateOption)
    return options
  }

  const loadOptions = async () => {
    if (_options.loaded) {
      return options
    }

    const { client } = useGraphQL()

    const query = gql`
        {
            option(userId: "${await userId()}"){
                visualisationPeriod
                rolloverPolicy
            }
        }`

    const graphQLClient = await client()
    const data = await graphQLClient.request(query)
    updateOptions(data.option)
    _options.loaded = true
    return options
  }

  const options = readonly(_options)

  const updateOptions = (options: Options) => {
    _options.visualisationPeriod = options.visualisationPeriod
    _options.rolloverPolicy = options.rolloverPolicy
  }

  return { updateOption, loadOptions, options }
}

export const visualisationPeriodDisplay = {
  DAILY: 'Today',
  WEEKLY: 'This week',
  MONTHLY: 'This month',
}

export interface Options {
  id: string
  visualisationPeriod: string
  rolloverPolicy: string
}

interface State {
  loaded: boolean
}
