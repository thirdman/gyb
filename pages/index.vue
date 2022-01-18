<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
     
      <div class="text-center">
        <h1>Panda Earth Archive</h1>
      </div>
       <div class="text-center">
        <nuxt-link to="/gallery">Find your pandas...</nuxt-link>
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
        { hid: 'og:image', property: 'og:image', content: require('~/assets/images/preview.png') }
      ]
    }
  },
  components: {
    Logo,
    VuetifyLogo
  }
}
</script>
