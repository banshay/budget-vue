<template>
  <div @click="openModal">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { useModal } from "vue-final-modal"
import AddExpenseModal from "@/components/expense/AddExpenseModal.vue"
import { ref, watch } from "vue"
import type { MonetaryRecord } from "@/types/moneyTypes"
import { Temporal } from "@js-temporal/polyfill"
import { useMoneyStore } from "@/stores/money/money"

type ExpenseProps = {
  expense?: MonetaryRecord
}
const props = defineProps<ExpenseProps>()

const moneyStore = useMoneyStore()

const initial: MonetaryRecord = {
  amount: null,
  category: "Manual",
  date: Temporal.Now.plainDateISO.toString(),
  monetaryType: "ONE_TIME",
  title: "Manual",
}
const expense = ref<MonetaryRecord>(initial)

function onClosed() {
  clearState()
}

function onSave(toSave: MonetaryRecord) {
  console.log("Save this: ", toSave)
  moneyStore.saveMoney(toSave)
  clearState()
}

function onOpened() {
  patchOptions({
    attrs: {
      expense: expense.value,
      autofocus: true,
      onClosed,
      onSave,
      onOpened,
    },
  })
}

const { open, patchOptions } = useModal({
  component: AddExpenseModal,
  attrs: {
    expense: expense.value,
    autofocus: false,
    onClosed,
    onSave,
    onOpened,
  },
})

watch(expense, () => {
  patchOptions({
    attrs: {
      expense: expense.value,
      autofocus: true,
      onClosed,
      onSave,
      onOpened,
    },
  })
})

function clearState() {
  expense.value = initial
}

function openModal() {
  expense.value = props.expense ?? initial
  open()
}
</script>
