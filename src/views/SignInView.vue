<template>
  <p>Logging In</p>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router"
import { isLoggedIn, signIn } from "@/firebase"

const router = useRouter()

isLoggedIn().then((loggedIn) => {
  if (!loggedIn) {
    signIn()
  } else {
    router.push("/")
  }
})
</script>
