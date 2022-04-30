import { defineStore } from "pinia"
import useGraphQL from "@/composition/graphql"
import { userId } from "@/firebase"
import { gql } from "graphql-request"
import type { Options } from "@/types/optionTypes"

export const useOptionStore = defineStore("option", {
  state: () => ({
    id: "",
    visualisationPeriod: "",
    rolloverPolicy: "",
    loaded: false,
  }),
  actions: {
    async updateOption(options: Options) {
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
      this.updateOptions(data.updateOption)
    },

    async loadOptions() {
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
      this.updateOptions(data.option)
      this.loaded = true
    },
    updateOptions(options: Options) {
      this.visualisationPeriod = options.visualisationPeriod
      this.rolloverPolicy = options.rolloverPolicy
    },
  },
})
