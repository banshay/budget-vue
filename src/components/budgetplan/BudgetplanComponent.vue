<template>
  <div class="flex h-screen">
    <div>
      <router-link to="/">
        <arrow-left class="m-4 w-16 h-16" />
      </router-link>
    </div>
    <div class="flex-grow py-9 flex flex-col">
      <div class="text-gray-200">
        <span class="text-xs">{{ budgetplan.planningPeriod }}</span>
        <br />
        <span class="text-4xl font-bold">Budgetplan</span>
      </div>
      <div class="mt-10 flex flex-col gap-4">
        <div
          v-for="display in categoryDisplay"
          :key="display.category"
          class="flex items-center"
        >
          <div class="w-32 text-2xl font-bold">{{ display.category }}</div>
          <progress-bar-component
            class="w-1/3 h-10"
            :percentage="display.percentage"
          />
          <div class="ml-4 text-3xl">{{ display.percentage }} %</div>
        </div>
      </div>
    </div>
    <div class="flex flex-col">
      <trash-component
        class="m-4 w-10 h-10 text-gray-200 cursor-pointer"
        @click="deleteBudgetplan"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Budgetplan } from "@/types/moneyTypes"
import TrashComponent from "@/assets/trash.svg?component"
import ArrowLeft from "@/assets/arrow-left.svg?component"
import { useMoneyStore } from "@/stores/money/money"
import ProgressBarComponent from "@/components/budgetplan/ProgressBarComponent.vue"
import { computed } from "vue"

interface Props {
  budgetplan: Budgetplan
}

const emit = defineEmits(["deletedPlan"])
const props = defineProps<Props>()

const moneyStore = useMoneyStore()

const categoryDisplay = computed(() => {
  return props.budgetplan.categories.map((categoryTotal) => {
    const currentSpending =
      props.budgetplan.currentSpending?.find(
        (spendingCat) => spendingCat.category === categoryTotal.category
      )?.spending || 0
    const percentage =
      categoryTotal.total > 0
        ? (100 / categoryTotal.total) * currentSpending
        : currentSpending
    return {
      ...categoryTotal,
      currentSpending,
      percentage: Math.floor(percentage),
    }
  })
})

function deleteBudgetplan() {
  moneyStore.deleteBudgetplan()
  emit("deletedPlan")
}
</script>
