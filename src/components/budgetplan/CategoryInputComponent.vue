<template>
  <div class="text-gray-900">
    <input
      @change.once="$emit('addAnother')"
      @input="$emit('changeCategory', $event.target.value)"
      type="text"
      name="category"
      placeholder="Category"
    />
    <input
      @input="$emit('changeTotal', $event.target.value)"
      type="number"
      name="total"
      placeholder="Total"
    />
  </div>
</template>

<script setup lang="ts">
defineEmits(["addAnother", "changeCategory", "changeTotal"])

// interface Props {
//   category: string
//   total: number
// }

// const props = defineProps<Props>()
</script>
