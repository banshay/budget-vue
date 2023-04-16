<template>
  <div class="flex justify-around rounded-xl bg-white bg-opacity-8">
    <span
      class="flex h-full w-full cursor-pointer select-none justify-center py-1"
      :class="{
        'bg-white bg-opacity-12': option === modelValue,
        'border-gray-200': option === modelValue,
        'rounded-l-xl': option === options[0],
        'rounded-r-xl': option === options[options.length - 1],
      }"
      v-for="option in props.options"
      :key="option"
      @click="emit('update:modelValue', option)"
      >{{ option }}</span
    >
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  options: string[]
  modelValue: string
}>()

const emit = defineEmits(["update:modelValue"])
</script>
