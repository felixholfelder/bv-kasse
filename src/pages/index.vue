<template>
  <v-container class="fill-height d-flex flex-column justify-center" max-width="1100">
    <div>
      <v-row>
        <v-col cols="4">
          <v-card
            class="py-4"
            color="surface-variant"
            prepend-icon="mdi-hamburger"
            rel="noopener noreferrer"
            rounded="lg"
            target="_blank"
            title="Essen"
            variant="tonal"
            @click="$router.push('essen')"
          />
        </v-col>

        <v-col cols="4">
          <v-card
            class="py-4"
            color="surface-variant"
            prepend-icon="mdi-glass-mug-variant"
            rel="noopener noreferrer"
            rounded="lg"
            target="_blank"
            title="Ausschank"
            variant="tonal"
            @click="$router.push('ausschank')"
          />
        </v-col>

        <v-col cols="4">
          <v-card
            class="py-4"
            color="surface-variant"
            prepend-icon="mdi-beer"
            rel="noopener noreferrer"
            rounded="lg"
            target="_blank"
            title="Schnaps-Bar"
            variant="tonal"
            @click="$router.push('schnaps-bar')"
          />
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup lang="ts"></script>
