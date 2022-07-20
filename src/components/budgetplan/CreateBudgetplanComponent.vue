<template>
  <div>
    <h1>Create Budgetplan</h1>
    <div>
      <span v-for="planningPeriod in planningPeriodTypes" :key="planningPeriod">
        <input
          :id="planningPeriod"
          type="radio"
          name="planningPeriod"
          v-model="budgetplan.planningPeriod"
          :value="planningPeriod"
        />
        <label :for="planningPeriod">{{
          PlanningPeriod[planningPeriod]
        }}</label>
      </span>
    </div>
    <div>
      <category-input-component
        v-for="(categoryInput, index) in budgetplan.categories"
        :key="index"
        @addAnother="addInputRow"
        @changeCategory="(value) => (categoryInput.category = value)"
        @changeTotal="(value) => (categoryInput.total = value)"
      />
    </div>
    <div>
      <button
        class="bg-lime-700 hover:bg-lime-600 text-gray-200 px-2 py-2 rounded"
        @click="add"
      >
        Save
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import type { Budgetplan } from "@/types/moneyTypes"
import { PlanningPeriod } from "@/types/moneyTypes"
import CategoryInputComponent from "@/components/budgetplan/CategoryInputComponent.vue"
import { useMoneyStore } from "@/stores/money/money"

const initialCategory = {
  category: "",
  total: 0,
}

const initial = {
  planningPeriod: null,
  categories: [{ ...initialCategory }],
}

const moneyStore = useMoneyStore()

const budgetplan = ref<Budgetplan>(initial)
const planningPeriodTypes = Object.keys(PlanningPeriod)

function addInputRow() {
  budgetplan.value.categories = [
    ...budgetplan.value.categories,
    { ...initialCategory },
  ]
}

async function add() {
  await moneyStore.saveBudgetplan(budgetplan.value)
}
</script>
