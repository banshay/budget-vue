<template>
  <trash-component
    class="m-4 w-16 h-16 text-gray-200"
    @click="deleteBudgetplan"
  />
</template>

<script setup lang="ts">
import type { Budgetplan } from "@/types/moneyTypes"
import TrashComponent from "@/assets/trash.svg?component"
import { useMoneyStore } from "@/stores/money/money"

interface Props {
  budgetplan: Budgetplan
}

const emit = defineEmits(["deletedPlan"])
const props = defineProps<Props>()

const moneyStore = useMoneyStore()

function deleteBudgetplan() {
  moneyStore.deleteBudgetplan()
  emit("deletedPlan")
}
</script>
