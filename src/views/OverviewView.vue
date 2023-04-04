<template>
  <div class="flex h-full flex-col">
    <div>
      <router-link to="/">
        <arrow-left class="m-4 h-16 w-16 text-gray-200" />
      </router-link>
    </div>

    <div class="grow">
      <CategoryOverview />
      <RecurringOverview />
    </div>
    <button class="align-end" @click="moneyStore.doRollover()">Rollover</button>
  </div>
</template>

<script setup lang="ts">
import { useMoneyStore } from "@/stores/money/money"
import CategoryOverview from "@/components/expense-overview/CategoryOverview.vue"
import ArrowLeft from "@/assets/arrow-left.svg?component"
import RecurringOverview from "@/components/expense-overview/RecurringOverview.vue"

const moneyStore = useMoneyStore()
</script>
