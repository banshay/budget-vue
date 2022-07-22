<template>
  <div class="flex h-screen">
    <div>
      <router-link to="/">
        <arrow-left class="m-4 w-16 h-16" />
      </router-link>
    </div>
    <div class="flex-grow py-9 flex flex-col">
      <div class="text-gray-200">
        <span class="text-xs">Create</span>
        <br />
        <span class="text-4xl font-bold">Budgetplan</span>
      </div>
      <div class="mt-10 flex flex-col gap-4">
        <div>
          <span
            v-for="planningPeriod in planningPeriodTypes"
            :key="planningPeriod"
          >
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import type { Budgetplan } from "@/types/moneyTypes"
import { PlanningPeriod } from "@/types/moneyTypes"
import CategoryInputComponent from "@/components/budgetplan/CategoryInputComponent.vue"
import ArrowLeft from "@/assets/arrow-left.svg?component"
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
