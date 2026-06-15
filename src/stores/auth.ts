import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useShortDate } from '@/composable/useDates.ts'

// TODO - env variables
const APP_PASSWORD = 'pass'
const APP_USERNAME = 'user'

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = computed(() => {
    // TODO pass this to date and compare (has format for example 01012026)
    const lastLogin = sessionStorage.getItem('lastLogin')
    return lastLogin !== null && lastLogin === useShortDate()
  })

  function login (username: string, password: string) {
    if (username !== APP_USERNAME || password !== APP_PASSWORD) {
      return false
    }

    sessionStorage.setItem('lastLogin', useShortDate())
    return true
  }

  function logout () {
    sessionStorage.removeItem('lastLogin')
  }

  return { isLoggedIn, login, logout }
})
