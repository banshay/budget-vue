import {
  browserLocalPersistence,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  setPersistence,
  signInWithRedirect,
  type User as FirebaseUser,
} from "firebase/auth"
import { initializeApp } from "firebase/app"
import { ref } from "vue"

const firebaseConfig = {
  apiKey: "AIzaSyAqyDLbUgJfdcdi4exSVWE0cZy34RcJyjA",
  authDomain: "wowtracker-346917.firebaseapp.com",
  projectId: "wowtracker-346917",
  storageBucket: "wowtracker-346917.appspot.com",
  messagingSenderId: "82634285895",
  appId: "1:82634285895:web:c2155aec282516249f6262",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

const provider = new GoogleAuthProvider()
const budgetAuth = getAuth(app)

export const signIn = async () => {
  await setPersistence(budgetAuth, browserLocalPersistence)
  await sessionStorage.setItem("isLoggingIn", "true")
  return signInWithRedirect(budgetAuth, provider)
}
const currentUser = ref<FirebaseUser | null>()
export const isLoggedIn = async () => {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(
      budgetAuth,
      (user) => {
        currentUser.value = user
        resolve(user)
      },
      reject
    )
  })
}

export const userId = () => currentUser.value?.uid
export const token = async () => await currentUser.value?.getIdToken()
