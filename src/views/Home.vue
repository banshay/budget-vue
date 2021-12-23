<template>
  <div class="h-screen flex flex-col">
    <router-link to="/options">
      <div class="flex flex-col items-end">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="m-4 w-16 h-16 fill-current text-gray-200"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 0 1-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 0 1 .947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 0 1 2.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 0 1 2.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 0 1 .947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 0 1-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 0 1-2.287-.947zM10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
    </router-link>
    <div class="mx-auto mt-10 flex-grow">
      <div class="flex flex-col">
        <p class="text-gray-200 self-center italic">
          {{ visualisationPeriodDisplay[visualisationPeriod] }}
        </p>
        <p class="text-gray-200 text-7xl">
          {{ balance > 0 ? '+' : '' }}{{ balance }}
          <span class="text-5xl">CHF</span>
        </p>
      </div>
    </div>
    <div class="flex justify-between items-end">
      <div class="w-2/5">
        <div class="m-10 text-gray-200 w-full">
          <p class="text-4xl text-left">Activity</p>
          <div class="flex" v-for="(item, i) in history" :key="i">
            <div class="ml-2 text-left">{{ item.date }}</div>
            <div class="mx-12 text-left">{{ item.category }}</div>
            <div class="flex-grow text-right">
              <div class="flex flex-nowrap items-baseline justify-end">
                {{ item.amount > 0 ? '+' : '' }}{{ item.amount }}
                <span class="ml-1 text-sm">CHF</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="m-10 w-16 h-16 bg-lime-500 hover:bg-lime-400 rounded-full">
        <router-link to="/add">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-8 w-8 fill-current text-gray-200 m-auto h-full"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 3a1 1 0 0 1 1 1v5h5a1 1 0 1 1 0 2h-5v5a1 1 0 1 1-2 0v-5H4a1 1 0 1 1 0-2h5V4a1 1 0 0 1 1-1z"
              clip-rule="evenodd"
            />
          </svg>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue'
import useMoney, { MonetaryRecord } from '@/composition/money'
import useOption, {
  Options,
  visualisationPeriodDisplay,
} from '@/composition/option'

export default defineComponent({
  name: 'Home',
  setup() {
    const { loadBalance, loadActivity } = useMoney()
    const { loadOptions } = useOption()

    const balance = ref<string>('')
    const history = ref<MonetaryRecord[]>([])
    const options = reactive<Options>({
      id: '',
      visualisationPeriod: '',
      rolloverPolicy: '',
    })

    onMounted(async () => {
      const opt = await loadOptions()
      options.visualisationPeriod = opt.visualisationPeriod
      options.rolloverPolicy = opt.rolloverPolicy

      balance.value = await loadBalance()
      history.value = await loadActivity()
    })

    return { balance, history, ...toRefs(options), visualisationPeriodDisplay }
  },
})
</script>
