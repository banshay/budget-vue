import { defineStore } from "pinia"
import { gql } from "graphql-request"
import type { Options } from "@/types/optionTypes"
import { useGraphQL } from "@/stores/graphql"
import { useTokenStore } from "@/stores/token"

export const useOptionStore = defineStore("option", {
  state: () => ({
    id: "",
    visualisationPeriod: "",
    rolloverPolicy: "",
    loaded: false,
  }),
  actions: {
    async updateOption(options: Options) {
      const graphql = useGraphQL()

      const optionInput = {
        input: {
          ...options,
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
      const data = await graphql.client?.request(query, optionInput)
      this.updateOptions(data.updateOption)
    },

    async loadOptions() {
      const graphql = useGraphQL()
      const tokenStore = useTokenStore()

      const query = gql`
        {
          option {
            visualisationPeriod
            rolloverPolicy
          }
        }
      `

      const data = await graphql.client?.request(query)
      this.updateOptions(data.option)
      this.loaded = true
    },
    updateOptions(options: Options) {
      this.visualisationPeriod = options.visualisationPeriod
      this.rolloverPolicy = options.rolloverPolicy
    },
  },
})
