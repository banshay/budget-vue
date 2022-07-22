<template>
  <Suspense>
    <template #default>
      <div class="mx-auto pt-6 pb-6 w-3/6 h-screen bg-stone-700">
        <div class="mx-auto w-4/5 flex flex-col justify-around h-2/5">
          <div class="flex flex-col">
            <div class="flex justify-between mb-6">
              <label for="vis-period" class="text-gray-200"
                >Visualisation Period</label
              >
              <select
                name="visual"
                id="vis-period"
                v-model="optionStore.visualisationPeriod"
              >
                <option value="DAILY">Daily</option>
                <option value="WEEKLY">Weekly</option>
                <option value="MONTHLY">Monthly</option>
              </select>
            </div>
            <div class="flex justify-between">
              <label for="rollover" class="text-gray-200"
                >Rollover Policy (Coming soon)</label
              >
              <select
                name="rollover"
                id="rollover"
                v-model="optionStore.rolloverPolicy"
              >
                <option value="NEXT_PERIOD">Next Period</option>
                <option value="DIVIDED">Divided</option>
              </select>
            </div>
          </div>
          <div class="self-start">
            <router-link to="/">
              <button
                class="p-2 bg-red-600 hover:bg-red-500 rounded text-gray-200"
              >
                Back
              </button>
            </router-link>
          </div>
        </div>
      </div>
    </template>
    <template #fallback> Loading...</template>
  </Suspense>
</template>

<script setup lang="ts">
import { onMounted, watch } from "vue"
import { useOptionStore } from "@/stores/options/options"

const optionStore = useOptionStore()

onMounted(async () => {
  if (!optionStore.loaded) {
    await optionStore.loadOptions()
  }
})

watch(optionStore, () =>
  optionStore.updateOption({
    visualisationPeriod: optionStore.visualisationPeriod,
    rolloverPolicy: optionStore.rolloverPolicy,
  })
)
</script>
