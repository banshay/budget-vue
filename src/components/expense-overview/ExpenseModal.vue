<template>
  <vue-final-modal
    :esc-to-close="true"
    class="flex items-center justify-center"
    content-class="max-w-xl flex flex-col p-4 bg-stone-700 text-gray-200"
  >
    <div class="h-20">
      <h1>{{ slice?.category }}</h1>
      <div>{{ slice?.amount }}</div>
    </div>
    <div>
      <input
        type="button"
        value="Delete"
        class="cursor-pointer rounded-md bg-amber-600 p-2 text-gray-200"
        @click="emit('delete')"
      />
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
import type { MonetarySlice } from "@/types/moneyTypes"
import { VueFinalModal } from "vue-final-modal"

defineProps<{
  slice?: MonetarySlice
}>()

const emit = defineEmits<{
  (e: "delete"): void
}>()
</script>
