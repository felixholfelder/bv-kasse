<script setup>
  import { onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'

  const auth = useAuthStore()
  const router = useRouter()
  const username = ref('')
  const password = ref('')

  onMounted(() => {
    if (auth.isLoggedIn) {
      router.push('/admin')
    }
  })

  async function handleLogin () {
    const isAuthenticated = auth.login(username.value, password.value)
    if (isAuthenticated) {
      router.push('/admin')
    }
  }
</script>

<template>
  <v-container class="fill-height d-flex flex-column justify-center" max-width="1100">
    <div>
      <v-app-bar title="Admin-Bereich">
        <template #prepend>
          <v-btn icon="mdi-arrow-left" @click="$router.back()" />
        </template>
      </v-app-bar>

      <v-row>
        <v-col cols="12" md="4" sm="12">
          <v-text-field
            v-model="username"
            color="surface-variant"
            label="Benutzername"
            rounded="lg"
            variant="outlined"
          />
        </v-col>

        <v-col cols="12" md="4" sm="12">
          <v-text-field
            v-model="password"
            color="surface-variant"
            label="Passwort"
            rounded="lg"
            type="password"
            variant="outlined"
          />
        </v-col>

        <v-col cols="12" md="4" sm="12">
          <v-btn class="w-100" rounded="lg" @click="handleLogin()">Login</v-btn>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<style></style>
