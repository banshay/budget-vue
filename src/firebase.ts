import { ref } from 'vue'
import { getAuth, signInWithRedirect } from '@firebase/auth'
import firebase from 'firebase/compat'
import initializeApp = firebase.initializeApp
import GoogleAuthProvider = firebase.auth.GoogleAuthProvider
import Persistence = firebase.auth.Auth.Persistence
import User = firebase.User

const firebaseConfig = {
  apiKey: 'AIzaSyDkVHGVoeNzkXpdIzoCdQP7cFfW3w_mZIg',
  authDomain: 'budget-projekt.firebaseapp.com',
  projectId: 'budget-projekt',
  storageBucket: 'budget-projekt.appspot.com',
  messagingSenderId: '629459546968',
  appId: '1:629459546968:web:c27408a4e7977e543feb2d',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

const provider = new GoogleAuthProvider()
const auth = getAuth()
const currentUser = ref<User | null>(null)

export const signIn = async () => {
  await firebase.auth().setPersistence(Persistence.LOCAL)
  await sessionStorage.setItem('isLoggingIn', 'true')
  return signInWithRedirect(auth, provider)
}

export const isLoggedIn = async () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = firebase
      .auth()
      .onAuthStateChanged((user: User | null) => {
        unsubscribe()
        resolve(user)
      }, reject)
  })
}
// export const isLoggedIn = async () => {
//   // firebase
//   //   .auth()
//   //   .currentUser?.getIdToken(false)
//   //   .then((token: string) => (currentUser.value = token))
//   const isLoggingIn: boolean = sessionStorage.getItem('isLoggingIn') == 'true'
//   if (isLoggingIn) {
//     sessionStorage.setItem('isLoggingIn', 'false')
//     const userCredential = await getRedirectResult(auth)
//     if (userCredential) {
//       currentUser.value = firebase.auth().currentUser
//     }
//   } else {
//     currentUser.value = firebase.auth().currentUser
//   }
//
//   return !!currentUser.value
// }
