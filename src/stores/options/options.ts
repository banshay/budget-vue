import { defineStore } from "pinia"
import { userId } from "@/firebase"
import { gql } from "graphql-request"
import type { Options } from "@/types/optionTypes"
import { useGraphQL } from "@/stores/graphql"

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
      const data = await graphql.client?.request(query, optionInput)
      this.updateOptions(data.updateOption)
    },

    async loadOptions() {
      const graphql = useGraphQL()

      const query = gql`
          {
              option(userId: "${await userId()}"){
                  visualisationPeriod
                  rolloverPolicy
              }
          }`

      const data = await graphql.client?.request(query)
      console.log("data", data)
      this.updateOptions(data.option)
      this.loaded = true
    },
    updateOptions(options: Options) {
      this.visualisationPeriod = options.visualisationPeriod
      this.rolloverPolicy = options.rolloverPolicy
    },
  },
})
