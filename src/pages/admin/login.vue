<script setup>
  import { onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuth } from '@/composable/useAuth.ts'

  const router = useRouter()
  const { login, isAuthenticated } = useAuth()

  const username = ref('')
  const password = ref('')
  const error = ref('')
  const isLoading = ref(false)

  onMounted(() => {
    if (isAuthenticated) {
      router.push('/admin')
    }
  })

  async function handleSubmit () {
    error.value = ''
    isLoading.value = true

    try {
      await login(username.value, password.value)
      router.push({ name: 'admin' })
    } catch (error_) {
      error.value = getErrorMessage(error_.code)
    } finally {
      isLoading.value = false
    }
  }

  function getErrorMessage (code) {
    const messages = {
      'auth/invalid-email': 'Ungültige E-Mail-Adresse.',
      'auth/user-not-found': 'Kein Konto mit dieser E-Mail gefunden.',
      'auth/wrong-password': 'Falsches Passwort.',
      'auth/email-already-in-use': 'Diese E-Mail-Adresse ist bereits registriert.',
      'auth/weak-password': 'Das Passwort muss mindestens 6 Zeichen haben.',
      'auth/too-many-requests': 'Zu viele Versuche. Bitte später erneut versuchen.',
    }
    return messages[code] ?? 'Ein Fehler ist aufgetreten. Bitte versuche es erneut.'
  }
</script>

<template>
  <v-container class="fill-height d-flex flex-column justify-center" max-width="500">
    <div>
      <v-app-bar title="Admin-Bereich">
        <template #prepend>
          <v-btn icon="mdi-arrow-left" @click="$router.back()" />
        </template>
      </v-app-bar>

      <v-row @keyup.enter="handleSubmit()">
        <v-col cols="12" md="12" sm="12">
          <v-text-field
            v-model="username"
            color="surface-variant"
            label="Benutzername"
            rounded="lg"
            variant="outlined"
          />
        </v-col>

        <v-col cols="12" md="12" sm="12">
          <v-text-field
            v-model="password"
            color="surface-variant"
            label="Passwort"
            rounded="lg"
            type="password"
            variant="outlined"
          />
        </v-col>

        <v-col cols="12" md="12" sm="12">
          <v-btn class="w-100" rounded="lg" @click="handleSubmit()">Login</v-btn>
        </v-col>

        <v-col>
          <p v-if="error" class="error">{{ error }}</p>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>
