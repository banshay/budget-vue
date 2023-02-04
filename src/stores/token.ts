import {defineStore} from "pinia"

const host: string = import.meta.env.VITE_ENDPOINT

interface State {
  uid: string | null
}

export const useTokenStore = defineStore("token", {
  state: () =>
      ({
        uid: null,
      } as State),
  actions: {
    loadUid() {
      this.uid = sessionStorage.getItem("uid")
    },
    getUid() {
      if (!this.uid) {
        this.loadUid()
      }
      return this.uid
    },
    async createLoginSession(idToken: string) {
      const response = await fetch(`${host}/authorize`, {
        method: "POST"
        , body: idToken
      })
      const uid = await response.json()
      sessionStorage.setItem("uid", uid)
    }
  },
})
