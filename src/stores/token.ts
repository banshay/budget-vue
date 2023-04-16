import { defineStore } from "pinia"

const host: string = import.meta.env.VITE_ENDPOINT

interface State {
  uid: string | null
  authorized: boolean
  clientId: string
}

export const useTokenStore = defineStore("token", {
  state: () =>
    ({
      uid: null,
      authorized: false,
      clientId:
        "405975567512-ml31fikaagpbtni851nplbhpfg2tkqop.apps.googleusercontent.com",
    } as State),
  actions: {
    loadUid() {
      this.uid = localStorage.getItem("uid")
    },
    saveUid(uid: string) {
      this.uid = uid
      localStorage.setItem("uid", uid)
    },
    async isAuthorized() {
      const uid = this.getUid() ?? ""
      try {
        await fetch(`${host}/is-authorized`, {
          method: "GET",
          headers: {
            uid: uid,
          },
        })
        this.authorized = true
      } catch {
        this.authorized = false
      }
    },
    getUid() {
      if (!this.uid) {
        this.loadUid()
      }
      return this.uid
    },
    async authorize() {
      const response = await fetch(`${host}/authorize`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
        },
      })
      const responseJson: { uid: string; authorized: boolean } =
        await response.json()
      this.uid = responseJson.uid
      localStorage.setItem("uid", this.uid)
    },
  },
})
