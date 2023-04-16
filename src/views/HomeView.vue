<template>
  <div class="flex h-screen">
    <div class="flex flex-grow flex-col">
      <div class="flex flex-grow flex-col items-center justify-center">
        <p class="self-center italic text-gray-200">
          {{ visualisationPeriodDisplay[optionStore.visualisationPeriod] }}
        </p>
        <p class="text-7xl text-gray-200">
          {{ moneyStore.balance > 0 ? "+" : "" }}{{ moneyStore.balance }}
          <span class="text-5xl">CHF</span>
        </p>
      </div>
      <div class="mt-auto flex items-end justify-between">
        <div class="w-2/5">
          <div class="m-10 w-full text-gray-200">
            <p class="text-left text-4xl">Activity</p>
            <div class="flex" v-for="(item, i) in moneyStore.activity" :key="i">
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
      </div>
    </div>
    <div class="flex flex-col">
      <router-link to="/options">
        <div class="items-end">
          <cog-component class="m-4 h-16 w-16 fill-current text-gray-200" />
        </div>
      </router-link>
      <router-link to="/overview">
        <div class="items-end">
          <table-component class="m-4 h-16 w-16 fill-current text-gray-200" />
        </div>
      </router-link>
      <ExpenseModal
        class="m-4 mt-auto h-16 w-16 items-end rounded-full bg-lime-500 hover:bg-lime-400"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="m-auto h-8 h-full w-8 fill-current text-gray-200"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M10 3a1 1 0 0 1 1 1v5h5a1 1 0 1 1 0 2h-5v5a1 1 0 1 1-2 0v-5H4a1 1 0 1 1 0-2h5V4a1 1 0 0 1 1-1z"
            clip-rule="evenodd"
          />
        </svg>
      </ExpenseModal>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onActivated, onMounted, watch } from "vue"
import { useMoneyStore } from "@/stores/money/money"
import { useOptionStore } from "@/stores/options/options"
import { visualisationPeriodDisplay } from "@/types/optionTypes"
import CogComponent from "@/assets/cog.svg?component"
import TableComponent from "@/assets/table.svg?component"
import ExpenseModal from "@/components/expense/ExpenseModal.vue"

const moneyStore = useMoneyStore()
const optionStore = useOptionStore()

onMounted(async () => {
  await optionStore.loadOptions()

  const searchParam = new URLSearchParams(window.location.search)

  await moneyStore.loadBalance(searchParam.get("date"))
  await moneyStore.loadActivity()
})
</script>
