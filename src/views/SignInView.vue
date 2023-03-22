<template>
  <div class="h-screen flex items-center justify-center">
    <!--    <div ref="googleLoginBtn"></div>-->
    <!--        <div-->
    <!--            id="g_id_onload"-->
    <!--            data-client_id="405975567512-ml31fikaagpbtni851nplbhpfg2tkqop.apps.googleusercontent.com"-->
    <!--            :data-callback="handleCredentialResponse"-->
    <!--            data-auto_select="true"-->
    <!--        ></div>-->
    <!--        <div-->
    <!--            class="g_id_signin"-->
    <!--            data-type="standard"-->
    <!--            data-size="large"-->
    <!--            data-theme="outline"-->
    <!--            data-text="sign_in_with"-->
    <!--            data-shape="rectangular"-->
    <!--            data-logo_alignment="left"-->
    <!--        ></div>-->
  </div>
</template>

<script setup lang="ts">
// const isProd = import.meta.env.PROD
//
// const domain = isProd ? "https://budsjett.net" : "http://localhost:3000"

import {onMounted, ref} from "vue"
import {useTokenStore} from "@/stores/token"

const googleLoginBtn = ref(null)
const tokenStore = useTokenStore()


onMounted(async () => {
  const host: string = import.meta.env.VITE_ENDPOINT

  await tokenStore.authorize()

  const client = window.google.accounts.oauth2.initCodeClient({
    client_id: tokenStore.clientId,
    scope: "openid",
    prompt:"consent",
    access_type:"offline",
    ux_mode:"redirect",
    redirect_uri:`${host}/code`,
    auto_select: true,
    state:`${tokenStore.uid}`
  })

  client.requestCode()
})
</script>
