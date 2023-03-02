<template>
  <div class="mx-auto h-screen w-3/6 bg-stone-700 pt-6 pb-6">
    <div class="mx-auto flex h-2/5 w-4/5 flex-col justify-around">
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
      <div class="flex justify-between px-4">
        <input
          class="mr-5 flex-grow"
          v-model="state.date"
          type="date"
          placeholder="Date"
        />
        <input
          class="mr-5 flex-grow"
          v-model="state.end"
          type="date"
          placeholder="End"
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
          class="rounded bg-red-600 px-2 py-2 text-gray-200 hover:bg-red-500"
          @click="discard"
        >
          Discard
        </button>
        <button
          class="rounded bg-lime-700 px-2 py-2 text-gray-200 hover:bg-lime-600"
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
  end: new Date(),
}
const router = useRouter()
const moneyStore = useMoneyStore()

const state = reactive(initial)

const add = async () => {
  const input: MonetaryRecord = {
    amount: (state?.amount || 0) * state.expense,
    date: new Date(state.date).toISOString(),
    end: new Date(state.end).toISOString(),
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
