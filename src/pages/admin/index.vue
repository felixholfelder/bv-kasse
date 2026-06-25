<template>
  <v-container class="fill-height d-flex flex-column justify-center" max-width="1100">
    <div>
      <v-app-bar title="Admin-Bereich">
        <template #prepend>
          <v-btn icon="mdi-arrow-left" @click="$router.push('/')" />
        </template>
      </v-app-bar>

      <v-row>
        <v-col cols="12" md="4" sm="12">
          <v-card
            class="py-4"
            color="surface-variant"
            prepend-icon="mdi-party-popper"
            rounded="lg"
            title="Events"
            variant="tonal"
            @click="$router.push({ name: 'adminEvents' })"
          />
        </v-col>

        <v-divider />

        <v-col cols="12" md="4" sm="12">
          <v-card
            class="py-4"
            color="surface-variant"
            prepend-icon="mdi-cash-register"
            rounded="lg"
            title="Kassen"
            variant="tonal"
            @click="$router.push({ name: 'adminRegisters' })"
          />
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup lang="ts"></script>
