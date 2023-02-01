import { defineStore } from "pinia"

const host: string = import.meta.env.VITE_GRAPHQL_ENDPOINT

interface State {
  token: string | null
  uid: string | null
}

export const useTokenStore = defineStore("token", {
  state: () =>
    ({
      token: null,
      uid: null,
    } as State),
  actions: {
    loadToken() {
      this.token = sessionStorage.getItem("token")
    },
    getToken() {
      if (!this.token) {
        this.loadToken()
      }
      return this.token
    },
    getUid() {
      if (!this.uid) {
        this.loadToken()
      }
      return this.uid
    },
    invalidateToken() {
      this.token = null
      sessionStorage.removeItem("token")
      location.reload()
    },
  },
})
