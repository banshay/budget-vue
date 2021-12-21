import {
  browserLocalPersistence,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  setPersistence,
  signInWithRedirect,
  User
} from 'firebase/auth'
import {initializeApp} from 'firebase/app';
import {ref} from 'vue';

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
const budgetAuth = getAuth(app)

export const signIn = async () => {
  await setPersistence(budgetAuth, browserLocalPersistence)
  await sessionStorage.setItem('isLoggingIn', 'true')
  return signInWithRedirect(budgetAuth, provider)
}
const currentUser = ref<User | null>()
export const isLoggedIn = async () => {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(budgetAuth, user => {
      currentUser.value = user
      resolve(user)
    }, reject)
  })
}

export const userId = () => currentUser.value?.uid
export const token = async () => await currentUser.value?.getIdToken()
