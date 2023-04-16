<template>
  <vue-final-modal
    :esc-to-close="true"
    content-class="pb-16 p-6 absolute bottom-0 w-full h-2/5 bg-stone-700 text-gray-200"
    content-transition="vfm-slide-down"
    overlay-transition="vfm-fade"
  >
    <div class="flex h-full flex-col justify-between">
      <div class="grid grid-cols-4">
        <span class="text-2xl font-bold">{{
          editableExpense.title ?? "Manual"
        }}</span>
        <div></div>
        <div></div>
        <div></div>
        <input
          ref="amountInput"
          class="mt-4 justify-center rounded p-2 text-black"
          type="text"
          placeholder="Amount..."
          v-model="editableExpense.amount"
          @keydown.enter="emit('save', editableExpense)"
        />
      </div>
      <button
        @click="emit('save', editableExpense)"
        class="self-end rounded bg-lime-600 px-3 py-2"
      >
        Save
      </button>
    </div>
  </vue-final-modal>
</template>

<script lang="ts" setup>
import { VueFinalModal } from "vue-final-modal"
import type { MonetaryRecord } from "@/types/moneyTypes"
import { ref, watch } from "vue"

const props = defineProps<{
  expense: MonetaryRecord
  autofocus: boolean
}>()

const emit = defineEmits<{ (e: "save", record: MonetaryRecord): void }>()

const amountInput = ref<HTMLInputElement | null>(null)
const editableExpense = ref<MonetaryRecord>({ ...props.expense })

watch(
  () => props.autofocus,
  (value) => {
    if (value) {
      amountInput.value?.focus()
    }
  }
)
</script>
