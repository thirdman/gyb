<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
     
      <div class="text-center">
        <h1>Panda Earth Archive</h1>
      </div>
       <div class="text-center">
        <nuxt-link to="/gallery"><strong>Find your pandas...</strong></nuxt-link>
      </div>
      <div class="text-center mt-4">
      <v-card rounded elevation="3" width="400px" style="margin: auto;">
        <v-img src="https://pandaearth.online/preview.png" width="400px" />
      </v-card>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import Logo from '~/components/Logo.vue'
import VuetifyLogo from '~/components/VuetifyLogo.vue'

export default {
  head () {
    return {
      meta: [
        { hid: 'og:image', property: 'og:image', content: 'https://pandaearth.online/preview.png' }
      ]
    }
  },
  components: {
    Logo,
    VuetifyLogo
  }
}
</script>
