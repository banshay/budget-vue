<template>
  <div class="h-screen flex flex-col text-gray-200">
    <router-link to="/">
      <arrow-left class="m-4 w-16 h-16 text-gray-200" />
    </router-link>
    <budgetplan-component
      @deletedPlan="router.push('/')"
      v-if="budgetplan"
      :budgetplan="budgetplan"
    />
    <create-budgetplan-component v-if="!budgetplan" />
  </div>
</template>

<script setup lang="ts">
import { useMoneyStore } from "@/stores/money/money"
import { onMounted } from "vue"
import BudgetplanComponent from "@/components/budgetplan/BudgetplanComponent.vue"
import CreateBudgetplanComponent from "@/components/budgetplan/CreateBudgetplanComponent.vue"
import ArrowLeft from "@/assets/arrow-left.svg?component"
import { storeToRefs } from "pinia"
import router from "@/router"

const moneyStore = useMoneyStore()

const { budgetplan } = storeToRefs(moneyStore)

onMounted(async () => {
  await moneyStore.loadBudgetplan()
})
</script>
