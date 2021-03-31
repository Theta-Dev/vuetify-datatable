<template>
  <div>
    <v-tooltip
      v-if="!$vuetify.theme.dark"
      bottom
    >
      <template v-slot:activator="{ on }">
        <v-btn
          icon
          v-on="on"
          @click="toggleDarkMode"
        >
          <v-icon>{{ icons.on }}</v-icon>
        </v-btn>
      </template>
      <span>Dark Mode On</span>
    </v-tooltip>

    <v-tooltip
      v-else
      bottom
    >
      <template v-slot:activator="{ on }">
        <v-btn
          icon
          v-on="on"
          @click="toggleDarkMode"
        >
          <v-icon>{{ icons.off }}</v-icon>
        </v-btn>
      </template>
      <span>Dark Mode Off</span>
    </v-tooltip>
  </div>
</template>

<script>
import { mdiLightbulb, mdiWhiteBalanceSunny } from '@mdi/js';

export default {
  name: 'ToggleDarkMode',

  data: () => ({
    icons: {
      on: mdiLightbulb,
      off: mdiWhiteBalanceSunny,
    },
  }),

  methods: {
    toggleDarkMode() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
    },
  },
};
</script>
