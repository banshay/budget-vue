<template>
  <div id="outer" class="bg-stone-700 rounded-xl">
    <div
      id="meter"
      class="h-full rounded-l-xl"
      :class="{
        'bg-lime-600': !exeeded,
        'bg-red-600': exeeded,
        'rounded-r-xl': exeeded,
      }"
      :style="{
        width: Math.min(percentage, 100) + '%',
      }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"

interface Props {
  percentage: number
}

const props = defineProps<Props>()

const exeeded = computed(() => props.percentage >= 100)
</script>
