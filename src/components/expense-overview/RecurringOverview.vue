<template>
  <div class="pt-10 text-gray-200">
    <div class="mx-16 grid grid-cols-6 bg-stone-800 p-2">
      <div class="border-b-2 border-b-gray-200 pb-1">Title / Category</div>
      <div class="border-b-2 border-b-gray-200 pb-1">From</div>
      <div class="border-b-2 border-b-gray-200 pb-1">End</div>
      <div class="border-b-2 border-b-gray-200 pb-1">Total</div>
      <div class="border-b-2 border-b-gray-200 pb-1">Daily Amount</div>
      <div class="border-b-2 border-b-gray-200 pb-1">Monthly Amount</div>
      <template
        v-for="record in moneyStore.recurringRecords"
        :key="record.title"
      >
        <div class="border-b border-b-gray-200 py-2">
          {{ record.title ?? record.category }}
        </div>
        <div class="border-b border-b-gray-200 py-2">
          {{ formatDate(record.date) }}
        </div>
        <div class="border-b border-b-gray-200 py-2">
          {{ formatDate(record.end) }}
        </div>
        <div class="border-b border-b-gray-200 py-2">{{ record.amount }}</div>
        <div class="border-b border-b-gray-200 py-2">{{ record.daily }}</div>
        <div class="border-b border-b-gray-200 py-2">{{ record.monthly }}</div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useMoneyStore } from "@/stores/money/money"
import { onMounted } from "vue"
import { Temporal } from "@js-temporal/polyfill"

const moneyStore = useMoneyStore()
onMounted(() => moneyStore.loadRecurringRecords())

function formatDate(datestr: string): string {
  if (!datestr) {
    return ""
  }
  const date = Temporal.Instant.from(datestr).toZonedDateTimeISO("Europe/Paris")
  return `${date.day}.${date.month}.${date.year}`
}
</script>
