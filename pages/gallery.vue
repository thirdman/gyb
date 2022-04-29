<template>
  <v-row>
    <v-col class="text-center" >
      <div class="text-center">
        <h1>Gallery</h1>
      </div>
      <p>This page is visible to user with access NFT in wallet</p>
      
      <iframe
      v-if="accessByBalance"
      style="border:0; min-height: 600px;" 
      id="TWframe"
      width="100%"
      :height="600"
      :src="url"
      ></iframe>
      
    </v-col>
  </v-row>
</template>

<style >

</style>

<script>
import { mapMutations, mapGetters } from "vuex";
export default {
  head () {
    return {
      meta: [
        { 
        hid: "og:image",
        property: "og:image",
        content: "https://www.superdthailand.com/media/wysiwyg/Test-Logo-Circle-black-transparent.png",
      }
      ]
    }
  },
  mounted(){
    if(!this.accessByBalance){
      this.$router.push('/')
    }
  },
  data() {
    return {
      tokenId: "",
      url: "https://testnets.opensea.io/collection/unidentified-contract-vheq2nb5wa"
    }
  },
  computed: {
    ...mapGetters({
      walletAddress: "uiStore/walletAddress",
      accessByBalance: "uiStore/accessByBalance",
    }),
  },
  methods: {
    
  }
}
</script>

