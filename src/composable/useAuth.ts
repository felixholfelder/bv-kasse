import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { computed, ref } from 'vue'
import { auth } from '@/firebase.ts'

const user = ref(null)
const loading = ref(true)

// Auth-State einmalig global überwachen
onAuthStateChanged(auth, (firebaseUser) => {
  user.value = firebaseUser
  loading.value = false
})

export function useAuth () {
  const isAuthenticated = computed(() => !!user.value)

  async function login (username: string, password: string) {
    const { user: loggedInUser } = await signInWithEmailAndPassword(
      auth,
      `${username}@test.de`,
      password,
    )
    return loggedInUser
  }

  async function logout () {
    await signOut(auth)
  }

  return {
    user: computed(() => user.value),
    loading: computed(() => loading.value),
    isAuthenticated,
    login,
    logout,
  }
}
