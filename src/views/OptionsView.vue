<template>
  <Suspense>
    <template #default>
      <div class="mx-auto h-screen w-3/6 bg-stone-700 pt-6 pb-6">
        <div class="mx-auto flex h-2/5 w-4/5 flex-col justify-around">
          <div class="flex flex-col">
            <div class="mb-6 flex justify-between">
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
            <div class="mb-6 flex justify-between">
              <label for="rollover" class="text-gray-200"
                >Rollover Policy</label
              >
              <select
                name="rollover"
                id="rollover"
                v-model="optionStore.rolloverPolicy"
              >
                <option value="NEXT_PERIOD">Next Period</option>
                <option value="MONTH">Month</option>
              </select>
            </div>
            <div class="flex justify-between">
              <label for="timezone" class="text-gray-200"> Timezone </label>
              <select
                name="timezone"
                id="timezone"
                v-model="optionStore.timezone"
              >
                <option
                  :key="timezone"
                  v-for="timezone in optionStore.availableTimezones.sort()"
                  :value="timezone"
                >
                  {{ timezone }}
                </option>
              </select>
            </div>
          </div>
          <div class="self-start">
            <router-link to="/">
              <button
                class="rounded bg-red-600 p-2 text-gray-200 hover:bg-red-500"
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
  await optionStore.loadTimezones()
  if (!optionStore.loaded) {
    await optionStore.loadOptions()
  }
})

watch(optionStore, () =>
  optionStore.updateOption({
    visualisationPeriod: optionStore.visualisationPeriod,
    rolloverPolicy: optionStore.rolloverPolicy,
    timezone: optionStore.timezone,
  })
)
</script>
