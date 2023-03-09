<template>
  <div class="flex h-full flex-col">
    <div>
      <router-link to="/">
        <arrow-left class="m-4 h-16 w-16 text-gray-200" />
      </router-link>
    </div>

    <div class="flex grow flex-col items-center">
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
                v-for="(_, date) in moneyByDateSorted"
                :key="date"
                class="px-6 text-center"
                :class="{ 'border-x-2 border-t-2': isToday(date) }"
              >
                {{ createDateDisplay(date) }}
              </th>
            </tr>
            <tr
              v-for="category in categoryList"
              :key="category"
              class="border-b"
            >
              <td class="border-r-2 py-2 pr-4 pl-2">{{ category }}</td>
              <td
                v-for="(expenses, date) in moneyByDateSorted"
                :key="date"
                class="relative cursor-pointer pr-2 text-right tracking-wider"
                :class="{ 'border-x-2 border-b-2': isToday(date) }"
              >
                <div
                  v-for="slice in moneyStore.getDateCategoryExpense(
                    date,
                    category
                  )"
                  :key="slice.sourceId"
                  @click="openExpenseModal(slice)"
                >
                  {{ slice.amount }}
                </div>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
    <button class="align-end" @click="moneyStore.doRollover()">Rollover</button>
  </div>
</template>

<script setup lang="ts">
import { useMoneyStore } from "@/stores/money/money"
import { computed, ref, watch, watchEffect } from "vue"
import type { MonetarySlice } from "@/types/moneyTypes"
import ArrowLeft from "@/assets/arrow-left.svg?component"
import { useModal } from "vue-final-modal"
import ExpenseModal from "@/components/expense-overview/ExpenseModal.vue"

const moneyStore = useMoneyStore()

const selectedSlice = ref<MonetarySlice | null>(null)

const { open, close, patchOptions } = useModal({
  component: ExpenseModal,
})

watch(selectedSlice, () => {
  patchOptions({
    attrs: {
      slice: selectedSlice.value,
      onDelete() {
        if (selectedSlice.value) {
          moneyStore.deleteMoney(selectedSlice.value)
          loadData()
        }
        close()
      },
    },
  })
})

function openExpenseModal(slice: MonetarySlice) {
  selectedSlice.value = slice
  open()
}

const centerDate = ref<Date>(new Date())

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

const today = computed<string>(() => toISODateNoTime(new Date()))
const aWeekBack = computed<Date>(() => {
  let temp = new Date()
  temp.setDate(new Date(today.value).getDate() - 7)
  return temp
})

const tomorrow = computed<string>(() => {
  let temp = new Date()
  temp.setDate(new Date(today.value).getDate() + 1)
  return toISODateNoTime(temp)
})

const yesterday = computed<string>(() => {
  let temp = new Date()
  temp.setDate(new Date(today.value).getDate() - 1)
  return toISODateNoTime(temp)
})

const moneyByDateSorted = computed(() => {
  return Object.keys(moneyStore.moneyByDate)
    .sort(sortByDate)
    .reduce(
      (acc, current) => ({
        ...acc,
        [current]: moneyStore.moneyByDate[current],
      }),
      {}
    )
})

function isToday(date: string) {
  return date === today.value
}

function createDateDisplay(dateStr: string) {
  if (isToday(dateStr)) {
    return "Today"
  }
  const date = new Date(dateStr)
  const isoDate = toISODateNoTime(date)
  if (isoDate === tomorrow.value) {
    return "Tomorrow"
  }
  if (isoDate === yesterday.value) {
    return "Yesterday"
  }
  if (aWeekBack.value.getDate() < date.getDate()) {
    const [weekday] = date
      .toLocaleDateString("en-GB", { weekday: "long" })
      .split(",")
    return weekday
  }
  return toShortDateString(date)
}

const fromDate = computed(() => {
  let fromTemp = new Date(centerDate.value)
  fromTemp.setDate(centerDate.value.getDate() - 3)
  return toISODateNoTime(fromTemp)
})

const fromDateLocalized = computed(() => {
  const temp = new Date(fromDate.value)
  return toShortDateString(temp)
})

const toDateLocalized = computed(() => {
  const temp = new Date(toDate.value)
  return toShortDateString(temp)
})

const toDate = computed(() => {
  let toTemp = new Date(centerDate.value)
  toTemp.setDate(centerDate.value.getDate() + 2)
  return toISODateNoTime(toTemp)
})

function goBack() {
  centerDate.value = new Date(fromDate.value)
}

function goForward() {
  let temp = new Date()
  temp.setDate(new Date(toDate.value).getDate() + 1)
  centerDate.value = temp
}

function loadData() {
  moneyStore.loadMoneyByDate(fromDate.value, toDate.value)
}

watchEffect(() => {
  loadData()
})

const sortByDate = (a: string, b: string) => {
  const adate = new Date(a[0])
  const bdate = new Date(b[0])
  return adate.getDate() >= bdate.getDate() ? -1 : 1
}

function toISODateNoTime(date: Date): string {
  const offset = date.getTimezoneOffset()
  const newDate = new Date(date.getTime() - offset * 60 * 1000)
  return newDate.toISOString().split("T")[0]
}

function toShortDateString(date: Date): string {
  const [day, month] = date
    .toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" })
    .split(".")
  return `${day}.${month}`
}
</script>
