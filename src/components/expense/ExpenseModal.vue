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
  expense?: MonetaryRecord | null
  open?: boolean
}
const props = defineProps<ExpenseProps>()
const emit = defineEmits<{ (e: "onClose"): void }>()

const moneyStore = useMoneyStore()

const initial: MonetaryRecord = readonly({
  amount: null,
  category: "Manual",
  date: Temporal.Now.instant().toString(),
  monetaryType: "ONE_TIME",
  title: "Manual",
})
const expense = ref<MonetaryRecord>(props.expense ?? initial)

const modalOptions = {
  component: AddExpenseModal,
  attrs: {
    expense: initial,
    autofocus: false,
    showDelete: false,
    onClosed: onClosed,
    onSave: onSave,
    onDelete,
    onOpened,
  },
}
const { open, close, patchOptions } = useModal(modalOptions)

function onDelete() {
  close()
}
function onClosed() {
  expense.value = props.expense ?? initial
  emit("onClose")
}

function onSave(toSave: MonetaryRecord) {
  moneyStore.saveMoney({
    amount: toSave.amount,
    category: toSave.category,
    date: toSave.date,
    end: toSave.end,
    id: toSave.id,
    monetaryType: toSave.monetaryType,
    title: toSave.title,
  })
  close()
}

function onOpened() {
  patchOptions({
    ...modalOptions,
    attrs: {
      ...modalOptions.attrs,
      expense: expense.value ?? initial,
      autofocus: true,
    },
  })
}

watch(expense, () => {
  patchOptions({
    ...modalOptions,
    attrs: {
      ...modalOptions.attrs,
      expense: expense.value,
      autofocus: false,
      showDelete: expense.value !== initial,
    },
  })
})

watch(
  () => props.expense,
  () => {
    expense.value = props.expense ?? initial
  }
)

watch(
  () => props.open,
  () => openModal()
)

function openModal() {
  open()
}
</script>
