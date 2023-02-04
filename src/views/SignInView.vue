<template>
  <div class="h-screen flex items-center justify-center">
    <div ref="googleLoginBtn"></div>
    <!--    <div-->
    <!--        id="g_id_onload"-->
    <!--        data-client_id="405975567512-ml31fikaagpbtni851nplbhpfg2tkqop.apps.googleusercontent.com"-->
    <!--        data-callback="loginCallback"-->
    <!--        data-auto_select="true"-->
    <!--    ></div>-->
    <!--    <div-->
    <!--        class="g_id_signin"-->
    <!--        data-type="standard"-->
    <!--        data-size="large"-->
    <!--        data-theme="outline"-->
    <!--        data-text="sign_in_with"-->
    <!--        data-shape="rectangular"-->
    <!--        data-logo_alignment="left"-->
    <!--    ></div>-->
  </div>
</template>

<script setup lang="ts">
// const isProd = import.meta.env.PROD
//
// const domain = isProd ? "https://budsjett.net" : "http://localhost:3000"

import {onMounted, ref} from "vue";
import {useTokenStore} from "@/stores/token";

const googleLoginBtn = ref(null)
const tokenStore = useTokenStore()

async function handleCredentialResponse(response) {
  tokenStore.createLoginSession(response.credentials)
}

onMounted(() => {
      const gClientId = "405975567512-ml31fikaagpbtni851nplbhpfg2tkqop.apps.googleusercontent.com"
      window.google.accounts.id.initialize({
        client_id: gClientId,
        callback: handleCredentialResponse,
        auto_select: true
      })
      window.google.accounts.id.renderButton(
          googleLoginBtn.value, {
            text: 'Login',
            size: 'large',
            theme: 'outline',// option : filled_black | outline | filled_blue
            type: "standard",
            shape: "rectangular",
            logo_alignment: "left"
          }
      )
    }
)
</script>
