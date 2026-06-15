<template>
  <v-container class="fill-height d-flex flex-column justify-center" max-width="1100">
    <div>
      <v-app-bar title="Kassensystem BV Altenstadt">
        <template #append>
          <v-btn color="surface-variant" icon="mdi-cog" @click="$router.push('/admin/login')" />
        </template>
      </v-app-bar>

      <v-row>
        <v-col cols="12" md="4" sm="12">
          <v-card
            class="py-4"
            color="surface-variant"
            prepend-icon="mdi-silverware-fork-knife"
            rel="noopener noreferrer"
            rounded="lg"
            target="_blank"
            title="Essen"
            variant="tonal"
            @click="$router.push('/essen')"
          />
        </v-col>

        <v-col cols="12" md="4" sm="12">
          <v-card
            class="py-4"
            color="surface-variant"
            prepend-icon="mdi-glass-mug-variant"
            rel="noopener noreferrer"
            rounded="lg"
            target="_blank"
            title="Ausschank"
            variant="tonal"
            @click="$router.push('/ausschank')"
          />
        </v-col>

        <v-col cols="12" md="4" sm="12">
          <v-card
            class="py-4"
            color="surface-variant"
            prepend-icon="mdi-beer"
            rel="noopener noreferrer"
            rounded="lg"
            target="_blank"
            title="Schnaps-Bar"
            variant="tonal"
            @click="$router.push('/schnaps-bar')"
          />
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup lang="ts"></script>
