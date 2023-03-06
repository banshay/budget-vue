import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import "./assets/tailwind.css"
import "vue-final-modal/style.css"
import { createPinia } from "pinia"
import { createVfm } from "vue-final-modal"

createApp(App).use(router).use(createPinia()).use(createVfm()).mount("#app")
