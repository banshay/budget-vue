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
import { useTokenStore } from "@/stores/token"
import router from "@/router"

const graphql = useGraphQL()
const tokenStore = useTokenStore()

onMounted(async () => {
  const search = new URLSearchParams(window.location.search)
  let uid = search.get("uid")
  if (uid) {
    tokenStore.saveUid(uid)
    window.history.replaceState({}, document.title, "/")
  }

  graphql.createGraphQlClient()
  await tokenStore.isAuthorized()

  if (!tokenStore.authorized) {
    console.log("auth check", tokenStore.authorized)
    await router.push("/login")
    // } else {
    //   await router.push("/")
  }
})
</script>
