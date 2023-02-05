import { defineStore } from "pinia"

const host: string = import.meta.env.VITE_ENDPOINT

interface State {
  uid: string | null
  clientId: string
}

export const useTokenStore = defineStore("token", {
  state: () =>
    ({
      uid: null,
      clientId:
        "405975567512-ml31fikaagpbtni851nplbhpfg2tkqop.apps.googleusercontent.com",
    } as State),
  actions: {
    loadUid() {
      this.uid = localStorage.getItem("uid")
    },
    getUid() {
      if (!this.uid) {
        this.loadUid()
      }
      return this.uid
    },
    async createLoginSession(idToken: string) {
      const response = await fetch(`${host}/authorize`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
        },
        body: idToken,
      })
      const responseJson: { uid: string; authorized: boolean } =
        await response.json()
      this.uid = responseJson.uid
      localStorage.setItem("uid", this.uid)

      if (!responseJson.authorized) {
        location.href =
          `https://accounts.google.com/o/oauth2/v2/auth?scope=email&access_type=offline&include_granted_scopes=true&` +
          `response_type=code&state=${this.uid}&redirect_uri=${host}/code&client_id=${this.clientId}`
      }
    },
  },
})
