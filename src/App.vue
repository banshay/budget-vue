<template>
  <Suspense>
    <router-view />
  </Suspense>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import { useGraphQL } from "@/stores/graphql"

const graphql = useGraphQL()

onMounted(async () => {
  await graphql.createGraphQlClient()
})
</script>
