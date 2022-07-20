<template>
  <div class="mx-auto pt-6 pb-6 w-3/6 h-screen bg-stone-700">
    <div class="mx-auto w-4/5 flex flex-col justify-around h-2/5">
      <div class="flex flex-col px-4 text-gray-200">
        <div>
          <input
            class="mr-2"
            id="expense"
            v-model="state.expense"
            type="radio"
            name="expense"
            value="-1"
          />
          <label for="expense">Expense</label>
        </div>
        <div>
          <input
            class="mr-2"
            id="income"
            v-model="state.expense"
            type="radio"
            name="expense"
            value="1"
          />
          <label for="income">Income</label>
        </div>
      </div>
      <div class="px-4">
        <select class="w-full" name="type" id="money-type" v-model="state.type">
          <option v-for="(moneyType, i) in types" :value="moneyType" :key="i">
            {{ MonetaryType[moneyType] }}
          </option>
        </select>
      </div>
      <div class="px-4">
        <input
          class="w-full"
          v-model="state.category"
          type="text"
          placeholder="Category"
        />
      </div>
      <div class="px-4 flex justify-between">
        <input
          class="flex-grow mr-5"
          v-model="state.date"
          type="date"
          placeholder="Date"
        />
        <input
          class="flex-grow"
          v-model="state.amount"
          type="text"
          placeholder="Amount"
        />
      </div>
      <div class="flex justify-around">
        <button
          class="bg-red-600 hover:bg-red-500 text-gray-200 px-2 py-2 rounded"
          @click="discard"
        >
          Discard
        </button>
        <button
          class="bg-lime-700 hover:bg-lime-600 text-gray-200 px-2 py-2 rounded"
          @click="add"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue"
import { useRouter } from "vue-router"
import { type MonetaryRecord, MonetaryType } from "@/types/moneyTypes"
import { useMoneyStore } from "@/stores/money/money"

const initial = {
  expense: -1,
  category: "",
  amount: null,
  type: Object.keys(MonetaryType)[0],
  date: new Date(),
}
const router = useRouter()
const moneyStore = useMoneyStore()

const state = reactive(initial)

const add = async () => {
  const input: MonetaryRecord = {
    amount: (state?.amount || 0) * state.expense,
    date: new Date(state.date).toISOString().split(/T/)[0],
    category: state.category,
    monetaryType: state.type,
  }
  await moneyStore.saveMoney(input)
  await router.push("/")
}

const discard = () => {
  router.push("/")
}

const types = Object.keys(MonetaryType)
</script>
