<template>
  <vue-final-modal
    :esc-to-close="true"
    content-class="absolute bottom-0 w-full h-2/5 text-gray-200 bg-base"
    content-transition="vfm-slide-down"
    overlay-transition="vfm-fade"
  >
    <div class="h-full w-full bg-white bg-opacity-5 p-6 pb-16">
      <div class="flex h-full flex-col justify-between">
        <div class="grid grid-cols-2">
          <div class="mb-3 flex text-2xl font-bold">
            <span ref="title" @keydown.enter="finishEdit()">{{
              editableExpense.title ?? "Manual"
            }}</span>
            <pencil-component
              v-if="showPencil"
              class="ml-2 h-5 w-5 cursor-pointer text-inherit"
              @click="editTitle()"
            />
          </div>
          <div class="row-span-2">
            <toggle-buttons
              :options="['Today', 'Range', 'Custom']"
              v-model="expenseType"
            />
          </div>
          <div>
            <toggle-buttons
              :options="['Expense', 'Income']"
              v-model="expenseOrIncome"
            />
          </div>
          <input
            ref="amountInput"
            class="mt-4 justify-center rounded rounded-l bg-base p-2"
            type="text"
            placeholder="Amount..."
            v-model="editableExpense.amount"
            @keydown.enter="emit('save', editableExpense)"
          />
          <div>
            <vue-datepicker-ui
              v-if="expenseType === 'Range'"
              lang="en"
              :range="true"
              position="right"
              v-model="dateRange"
              inputClass="bg-base "
              class="dark-datepicker px-4"
            />
            <vue-datepicker-ui
              v-if="expenseType === 'Custom'"
              lang="en"
              position="right"
              v-model="customDate"
              class="dark-datepicker px-4"
            />
          </div>
        </div>
        <button @click="save" class="self-end rounded bg-lime-600 px-3 py-2">
          Save
        </button>
      </div>
    </div>
  </vue-final-modal>
</template>

<script lang="ts" setup>
import { VueFinalModal } from "vue-final-modal"
import type { MonetaryRecord } from "@/types/moneyTypes"
import { computed, ref, watch } from "vue"
import ToggleButtons from "@/components/expense/ToggleButtons.vue"
import { MonetaryType } from "@/types/moneyTypes"
import PencilComponent from "@/assets/pencil.svg?component"
import "vue-datepicker-ui/lib/vuedatepickerui.css"
import VueDatepickerUi from "vue-datepicker-ui"
import { Temporal } from "@js-temporal/polyfill"

const props = defineProps<{
  expense: MonetaryRecord
  autofocus: boolean
}>()

const emit = defineEmits<{ (e: "save", record: MonetaryRecord): void }>()

const title = ref<HTMLElement | null>(null)
const showPencil = ref<boolean>(true)
const amountInput = ref<HTMLInputElement | null>(null)
const editableExpense = ref<MonetaryRecord>({ ...props.expense })
const expenseOrIncome = ref<string>("Expense")
const expenseType = ref<string>("Today")
const dateRange = ref<Date[]>([])
const customDate = ref<Date | null>(null)

const isExpense = computed(() => expenseOrIncome.value === "Expense")

function save() {
  if (isExpense.value) {
    editableExpense.value.amount = (editableExpense.value.amount ?? 0) * -1
  }

  if (expenseType.value === "Range") {
    editableExpense.value.date = Temporal.Instant.from(
      dateRange.value[0].toISOString()
    ).toString()
    editableExpense.value.end = Temporal.Instant.from(
      dateRange.value[1].toISOString()
    ).toString()
  }
  if (expenseType.value === "Custom") {
    editableExpense.value.date = Temporal.Instant.from(
      customDate.value?.toISOString() ?? Temporal.Now.instant()
    ).toString()
  }
  emit("save", editableExpense.value)
}
function editTitle() {
  if (title.value) {
    title.value.contentEditable = "true"
    title.value.innerHTML = ""
    setTimeout(() => title.value?.focus(), 100)
  }
  showPencil.value = false
}
function finishEdit() {
  if (title.value) {
    title.value.contentEditable = "false"
    amountInput.value?.focus()
  }
  showPencil.value = true
}

watch(expenseType, (value) => {
  if (value === "Today") {
    editableExpense.value.monetaryType = "ONE_TIME"
  }
  if (value === "Range") {
    editableExpense.value.monetaryType = "RECURRING_RANGE"
  }
})

watch(
  () => props.autofocus,
  (value) => {
    if (value) {
      amountInput.value?.focus()
    }
  }
)
</script>

<style scoped>
.dark-datepicker {
  --v-calendar-picker-color: #121212;
  --v-calendar-input-bg-color: #121212;
  --v-calendar-select-bg-color: #121212;
}
</style>
