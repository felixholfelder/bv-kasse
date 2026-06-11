<template>
  <v-container class="fill-height d-flex flex-column justify-center" max-width="1100">
    <div>
      <v-row>
        <v-col cols="12">
          <v-card
            class="py-4"
            color="surface-variant"
            rounded="lg"
            variant="tonal"
            @click="resetPrice"
          >
            <template #prepend>
              <v-avatar
                class="ml-2 mr-4"
                icon="mdi-currency-eur"
                size="60"
                variant="tonal"
              />
            </template>

            <template #title>
              <div class="my-title my-uppercase text-headline-medium font-weight-bold">
                Gesamtpreis: {{ price }} €
              </div>
            </template>
          </v-card>
        </v-col>

        <v-col v-for="link in links" :key="link.href" cols="6">
          <v-card
            class="py-4"
            color="surface-variant"
            rel="noopener noreferrer"
            rounded="lg"
            :subtitle="`${link.price} €`"
            target="_blank"
            :title="link.title"
            variant="tonal"
            @click="addItem(link)"
          >
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import {ref} from "vue";

const links = [
  {
    href: 'https://vuetifyjs.com/',
    icon: 'mdi-text-box-outline',
    subtitle: 'Learn about all things Vuetify in our documentation.',
    title: 'Bratwurstsemmel',
    price: 3.5,
  },
  {
    href: 'https://vuetifyjs.com/introduction/why-vuetify/#feature-guides',
    icon: 'mdi-star-circle-outline',
    subtitle: 'Explore available framework Features.',
    title: 'Steaksemmel',
    price: 4.5,
  },
  {
    href: 'https://vuetifyjs.com/components/all',
    icon: 'mdi-widgets-outline',
    subtitle: 'Discover components in the API Explorer.',
    title: 'Breze mit Käse',
    price: 3,
  },
  {
    href: 'https://discord.vuetifyjs.com',
    icon: 'mdi-account-group-outline',
    subtitle: 'Connect with Vuetify developers.',
    title: 'Lecker Bierchen',
    price: 3.5,
  },
]

const price = ref(0.0)

const addItem = (item) => {
  price.value += item.price
}

const resetPrice = () => {
  price.value = 0
}
</script>
