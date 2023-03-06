<template>
  <Suspense>
    <router-view />
  </Suspense>
  <modals-container />
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import { useGraphQL } from "@/stores/graphql"
import { ModalsContainer } from "vue-final-modal"

const graphql = useGraphQL()

onMounted(async () => {
  await graphql.createGraphQlClient()
})
</script>
