<template>
  <p>Logging In</p>
</template>

<script>
import { defineComponent } from 'vue'
import { isLoggedIn, signIn } from '@/firebase.ts'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'SignIn',
  setup() {
    const router = useRouter()

    isLoggedIn().then((loggedIn) => {
      if (!loggedIn) {
        signIn()
      } else {
        router.push('/')
      }
    })
    return {}
  },
})
</script>

<style scoped></style>
