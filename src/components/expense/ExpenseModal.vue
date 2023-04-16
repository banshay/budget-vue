<template>
  <div @click="openModal">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { useModal } from "vue-final-modal"
import AddExpenseModal from "@/components/expense/AddExpenseModal.vue"
import { readonly, ref, watch } from "vue"
import type { MonetaryRecord } from "@/types/moneyTypes"
import { Temporal } from "@js-temporal/polyfill"
import { useMoneyStore } from "@/stores/money/money"

type ExpenseProps = {
  expense?: MonetaryRecord
}
const props = defineProps<ExpenseProps>()

const moneyStore = useMoneyStore()

const initial: MonetaryRecord = readonly({
  amount: null,
  category: "Manual",
  date: Temporal.Now.instant().toString(),
  monetaryType: "ONE_TIME",
  title: "Manual",
})

const expense = ref<MonetaryRecord>(initial)

const modalOptions = {
  component: AddExpenseModal,
  attrs: {
    expense: expense.value,
    autofocus: false,
    onClosed: onClosed,
    onSave: onSave,
    onOpened: onOpened,
  },
}

function onClosed() {
  expense.value = initial

  patchOptions({
    ...modalOptions,
    attrs: {
      ...modalOptions.attrs,
      expense: expense.value,
      autofocus: false,
    },
  })
}

function onSave(toSave: MonetaryRecord) {
  moneyStore.saveMoney(toSave)
  close()
}

function onOpened() {
  patchOptions({
    ...modalOptions,
    attrs: {
      ...modalOptions.attrs,
      expense: expense.value,
      autofocus: true,
    },
  })
}

const { open, close, patchOptions } = useModal(modalOptions)

watch(expense, () => {
  patchOptions({
    ...modalOptions,
    attrs: {
      ...modalOptions.attrs,
      expense: expense.value,
      autofocus: false,
    },
  })
})

function openModal() {
  expense.value = props.expense ?? initial
  open()
}
</script>
