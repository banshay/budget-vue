<template>
  <div class="h-screen flex">
    <div class="flex-grow flex flex-col">
      <div class="flex-grow flex flex-col justify-center items-center">
        <p class="text-gray-200 self-center italic">
          {{ visualisationPeriodDisplay[visualisationPeriod] }}
        </p>
        <p class="text-gray-200 text-7xl">
          {{ moneyStore.balance > 0 ? "+" : "" }}{{ moneyStore.balance }}
          <span class="text-5xl">CHF</span>
        </p>
      </div>
      <div class="mt-auto flex justify-between items-end">
        <div class="w-2/5">
          <div class="m-10 text-gray-200 w-full">
            <p class="text-4xl text-left">Activity</p>
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
          <cog-component class="m-4 w-16 h-16 fill-current text-gray-200" />
        </div>
      </router-link>
      <!--      <router-link to="/budgetplan">-->
      <!--        <div class="items-end">-->
      <!--          <plan-component class="m-4 w-16 h-16 fill-current text-gray-200" />-->
      <!--        </div>-->
      <!--      </router-link>-->
      <router-link to="/overview">
        <div class="items-end">
          <table-component class="w-16 m-4 h-16 fill-current text-gray-200" />
        </div>
      </router-link>
      <div
        class="items-end mt-auto m-4 w-16 h-16 bg-lime-500 hover:bg-lime-400 rounded-full"
      >
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
import { onMounted } from "vue"
import { useMoneyStore } from "@/stores/money/money"
import { useOptionStore } from "@/stores/options/options"
import { visualisationPeriodDisplay } from "@/types/optionTypes"
import CogComponent from "@/assets/cog.svg?component"
import TableComponent from "@/assets/table.svg?component"

const moneyStore = useMoneyStore()
const optionStore = useOptionStore()

onMounted(async () => {
  await optionStore.loadOptions()

  const searchParam = new URLSearchParams(window.location.search)

  await moneyStore.loadBalance(searchParam.get("date"))
  await moneyStore.loadActivity()
})
</script>
