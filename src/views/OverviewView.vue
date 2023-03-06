<template>
  <div class="flex flex-col">
    <div>
      <router-link to="/">
        <arrow-left class="m-4 h-16 w-16 text-gray-200" />
      </router-link>
    </div>

    <div class="flex grow flex-col items-center">
      <div class="mt-12 bg-stone-800 text-gray-200">
        <table class="mx-auto">
          <tr class="border-b-2">
            <th class="border-r-2"></th>
            <th
              v-for="(_, date) in moneyByDateSorted"
              :key="date"
              class="px-6 text-center"
              :class="{ 'border-x-2 border-t-2': isCenterDate(date) }"
            >
              {{ createDateDisplay(date) }}
            </th>
          </tr>
          <tr v-for="category in categoryList" :key="category" class="border-b">
            <td class="border-r-2 pr-4 pl-1">{{ category }}</td>
            <td
              v-for="(expenses, date) in moneyByDateSorted"
              :key="date"
              class="relative cursor-pointer pr-2 text-right tracking-wider"
              :class="{ 'border-x-2 border-b-2': isCenterDate(date) }"
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

const tomorrow = computed<string>(() => {
  let temp = new Date()
  temp.setDate(centerDate.value.getDate() + 1)
  return temp.toISOString().split("T")[0]
})

const yesterday = computed<string>(() => {
  let temp = new Date()
  temp.setDate(centerDate.value.getDate() - 1)
  return temp.toISOString().split("T")[0]
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

function isCenterDate(date: string) {
  return date === centerDate.value.toISOString().split("T")[0]
}

function createDateDisplay(dateStr: string) {
  if (isCenterDate(dateStr)) {
    return "Today"
  }
  const date = new Date(dateStr)
  const [isoDate] = date.toISOString().split("T")
  if (isoDate === tomorrow.value) {
    return "Tomorrow"
  }
  if (isoDate === yesterday.value) {
    return "Yesterday"
  }
  const [weekday] = date
    .toLocaleDateString("en-GB", { weekday: "long" })
    .split(",")
  return weekday
}

watchEffect(() => {
  loadData()
})

function loadData() {
  let fromTemp = new Date(centerDate.value)
  let toTemp = new Date(centerDate.value)
  fromTemp.setDate(centerDate.value.getDate() - 3)
  toTemp.setDate(centerDate.value.getDate() + 2)
  const [from] = fromTemp.toISOString().split("T")
  const [to] = toTemp.toISOString().split("T")
  moneyStore.loadMoneyByDate(from, to)
}

const sortByDate = (a: string, b: string) => {
  const adate = new Date(a[0])
  const bdate = new Date(b[0])
  return adate.getDate() >= bdate.getDate() ? -1 : 1
}
</script>
