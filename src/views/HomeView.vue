<template>
  <div class="h-screen flex flex-col">
    <router-link to="/options">
      <div class="flex flex-col items-end">
        <cog-component class="m-4 w-16 h-16 fill-current text-gray-200" />
      </div>
    </router-link>
    <router-link to="/budgetplan">
      <div class="flex flex-col items-end">
        <plan-component class="m-4 w-16 h-16 fill-current text-gray-200" />
      </div>
    </router-link>
    <div class="mx-auto mt-10 flex-grow">
      <div class="flex flex-col">
        <p class="text-gray-200 self-center italic">
          {{ visualisationPeriodDisplay[visualisationPeriod] }}
        </p>
        <p class="text-gray-200 text-7xl">
          {{ balance > 0 ? "+" : "" }}{{ balance }}
          <span class="text-5xl">CHF</span>
        </p>
      </div>
    </div>
    <div class="flex justify-between items-end">
      <div class="w-2/5">
        <div class="m-10 text-gray-200 w-full">
          <p class="text-4xl text-left">Activity</p>
          <div class="flex" v-for="(item, i) in history" :key="i">
            <div class="ml-2 text-left">{{ item.date }}</div>
            <div class="mx-12 text-left">{{ item.category }}</div>
            <div class="flex-grow text-right">
              <div class="flex flex-nowrap items-baseline justify-end">
                {{ item.amount > 0 ? "+" : "" }}{{ item.amount }}
                <span class="ml-1 text-sm">CHF</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="m-10 w-16 h-16 bg-lime-500 hover:bg-lime-400 rounded-full">
        <router-link to="/add">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-8 w-8 fill-current text-gray-200 m-auto h-full"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 3a1 1 0 0 1 1 1v5h5a1 1 0 1 1 0 2h-5v5a1 1 0 1 1-2 0v-5H4a1 1 0 1 1 0-2h5V4a1 1 0 0 1 1-1z"
              clip-rule="evenodd"
            />
          </svg>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import type { MonetaryRecord } from "@/types/moneyTypes"
import { useMoneyStore } from "@/stores/money/money"
import { useOptionStore } from "@/stores/options/options"
import { visualisationPeriodDisplay } from "@/types/optionTypes"
import CogComponent from "@/assets/cog.svg?component"
import PlanComponent from "@/assets/plan.svg?component"

const moneyStore = useMoneyStore()
const optionStore = useOptionStore()

const balance = ref<string>("")
const history = ref<MonetaryRecord[]>([])

onMounted(async () => {
  await optionStore.loadOptions()

  balance.value = await moneyStore.loadBalance()
  history.value = await moneyStore.loadActivity()
})
</script>
