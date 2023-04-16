<template>
  <div class="flex flex-col items-center">
    <div class="flex w-3/5 flex-col">
      <div class="flex self-start">
        <div
          @click="goBack()"
          class="cursor-pointer select-none rounded-l-full border-r-4 border-stone-900 bg-stone-700 pt-1.5 pl-4 pr-2 font-bold tracking-wider text-gray-200"
        >
          &lt;
        </div>
        <div class="bg-stone-700 px-3 py-2 tracking-wider text-gray-200">
          {{ `${fromDateLocalized} - ${toDateLocalized}` }}
        </div>
        <div
          @click="goForward()"
          class="cursor-pointer select-none rounded-r-full border-l-4 border-stone-900 bg-stone-700 pt-1.5 pr-4 pl-2 font-bold tracking-wider text-gray-200"
        >
          &gt;
        </div>
      </div>
      <div class="mt-6 text-gray-200">
        <table class="mr-auto bg-stone-800">
          <tr class="border-b-2">
            <th class="border-r-2 py-6"></th>
            <th
              v-for="(_, date, index) in moneyByDateSorted"
              :key="index"
              class="px-6 text-center"
              :class="{ 'border-x-2 border-t-2': isToday(date) }"
            >
              {{ createDateDisplay(date) }}
            </th>
          </tr>
          <tr v-for="category in categoryList" :key="category" class="border-b">
            <td class="border-r-2 py-2 pr-4 pl-2">{{ category }}</td>
            <td
              v-for="(expenses, date, index) in moneyByDateSorted"
              :key="index"
              class="relative cursor-pointer pr-2 text-right tracking-wider"
              :class="{ 'border-x-2 border-b-2': isToday(date) }"
            >
              <expense-modal
                v-for="slice in moneyStore.getDateCategoryExpense(
                  date,
                  category
                )"
                :key="slice.sourceId"
                :expense="selectedMonetaryRecord"
                @click="selectMonetaryRecord(slice.sourceId)"
                @onClose="loadData"
              >
                {{ slice.amount }}
              </expense-modal>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMoneyStore } from "@/stores/money/money"
import { computed, ref, watchEffect } from "vue"
import type { MonetaryRecord, MonetarySlice } from "@/types/moneyTypes"
import { Temporal } from "@js-temporal/polyfill"
import ExpenseModal from "@/components/expense/ExpenseModal.vue"

const moneyStore = useMoneyStore()

const selectedMonetaryRecord = ref<MonetaryRecord | null>(null)
const centerDate = ref<Temporal.PlainDate>(Temporal.Now.plainDateISO())

async function selectMonetaryRecord(sourceId: string) {
  selectedMonetaryRecord.value = await moneyStore.loadMonetaryRecord(sourceId)
}

const categoryCounts = computed(() =>
  Object.entries(moneyStore.moneyByDate)
    .flatMap((entry: [string, MonetarySlice[]]) => entry[1])
    .reduce(
      (acc: Record<string, number>, current: MonetarySlice) => ({
        ...acc,
        [current.category]: (acc[current.category] ?? 0) + 1,
      }),
      {} as Record<string, number>
    )
)

const categoryList = computed(
  () =>
    new Set(
      Object.entries(moneyStore.moneyByDate)
        .flatMap((entry: [string, MonetarySlice[]]) => entry[1])
        .map((expense) => expense.category)
        .sort((leftCategory, rightCategory) =>
          categoryCounts.value[leftCategory] >=
          categoryCounts.value[rightCategory]
            ? -1
            : 1
        )
    )
)

const today = computed<string>(() => Temporal.Now.plainDateISO().toString())
const aWeekBack = computed<Temporal.PlainDate>(() =>
  Temporal.Now.plainDateISO().subtract({ days: 7 })
)

const tomorrow = computed<string>(() =>
  Temporal.Now.plainDateISO().add({ days: 1 }).toString()
)

const yesterday = computed<string>(() =>
  Temporal.Now.plainDateISO().subtract({ days: 1 }).toString()
)

const moneyByDateSorted = computed(() => {
  return Object.keys(moneyStore.moneyByDate)
    .map((stringDate) => Temporal.PlainDate.from(stringDate))
    .sort(Temporal.PlainDate.compare)
    .reduce(
      (acc, current) => ({
        ...acc,
        [current.toString()]: moneyStore.moneyByDate[current.toString()],
      }),
      {}
    )
})

function isToday(date: string) {
  return date === today.value
}

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
]

function createDateDisplay(dateStr: string) {
  if (isToday(dateStr)) {
    return "Today"
  }
  const isoDate: Temporal.PlainDate = Temporal.PlainDate.from(dateStr)
  if (isoDate.toString() === tomorrow.value) {
    return "Tomorrow"
  }
  if (isoDate.toString() === yesterday.value) {
    return "Yesterday"
  }
  if (Temporal.PlainDate.compare(aWeekBack.value, isoDate) == -1) {
    return daysOfWeek[isoDate.dayOfWeek - 1]
  }
  return toShortDateString(isoDate)
}

const fromDate = computed<Temporal.PlainDate>(() =>
  centerDate.value.subtract({ days: 3 })
)

const fromDateLocalized = computed<string>(() => {
  return toShortDateString(fromDate.value)
})

const toDateLocalized = computed<string>(() => {
  return toShortDateString(toDate.value)
})

const toDate = computed<Temporal.PlainDate>(() =>
  centerDate.value.add({ days: 2 })
)

function goBack() {
  centerDate.value = fromDate.value.subtract({ days: 2 })
}

function goForward() {
  centerDate.value = toDate.value.add({ days: 3 })
}

function loadData() {
  moneyStore.loadMoneyByDate(fromDate.value.toString(), toDate.value.toString())
}

function toShortDateString(date: Temporal.PlainDate): string {
  return `${date.day}.${date.month}`
}

watchEffect(() => {
  loadData()
})
</script>
