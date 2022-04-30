<template>
  <v-card 
  class="NftElement" 
  :class="`display-${display}`"
  :elevation="elevation" 
  outlined  
  :color="this.status === 'error' ? 'red' : 'secondary'" 
  :width="size"
  :height="display=== 'image' ? size : ''"
  >
    <div v-if="this.status">
      <span v-if="this.status && this.status === 'loading'"><v-icon small class="loading-icon">mdi-loading</v-icon></span>
      {{this.status}}
      </div>
    <!-- <v-card-title v-if="this.data && this.data.name">
      {{this.data.name}}
    </v-card-title> -->
    
    <img :src="this.data.image" v-if="this.data && this.data.image" />
    <v-card-text v-if="this.data && display=== 'full'">
      <label>ID</label><br />
      <div>#{{this.id}}</div>
      <label>Name</label><br />
      <div>{{this.data.name}}</div>
      <label>Description</label><br />
      <div>{{this.data.description}}</div>
    </v-card-text>
  </v-card>
</template>

<style lang="scss">
.NftElement{
  min-width: 80px;
  margin: 0 auto .5rem;
  &.display-image{
    img{
      object-fit: cover;
    }
  }
  // max-height: 300px;
  
  img{
    width: 100%;
    height: 100%;
    max-width: 900px;
    max-height: 200px;
    object-fit: contain;
  }
}
</style>

<script>
import { mapMutations, mapGetters, mapActions } from "vuex";
export default {
  props: {
    id: {
      type: String,
      default: null
    },
    contract: {
      type: String,
      default: '0xed9583b4a8e2baef0dbd7c274ad40c68abd765bc'
    },
    mode: {
      type: String,
      default: null
    },
    display: {
      type: String,
      default: 'full'
    },
    size: {
      type: String,
      default: '200'
    }, 
    elevation: {
      type: String,
      default: '4'
    }, 
  },
  data () {
    return {
      
      status: '',
      data: null,
      src: '',
      image: '',
      artist: '',
      url: '',
      name: '',
      description: '',
      attributes: null,
      image_details: null,
    }
  },
  async fetch() {
    const {id, contract, mode = 'object'} = this;
    this.status = 'loading'
    const uriObject = await this.getNftData({mode: 'object', id: id, contract: contract}).catch((error) => {console.log('error', error)}).catch((error) => {console.log('uri object error', error)});
    console.log('uri object', uriObject)
    if(!uriObject || typeof uriObject !== 'object'){
      this.status = 'error'
      return
    }
    const {attributes, name, created_by, external_url, description, image_details, image, image_url} = uriObject
    
    const ipfsPrefix = "ipfs://ipfs/";
      // const ipfsProxyString = "https://ipfs.io/ipfs/";
      const ipfsGatewayString = "https://gateway.pinata.cloud/ipfs/";
      const cleanUrl = (url) => {
        const ipfsId = url.substring(12, url.length);
        return ipfsGatewayString + ipfsId;
      };

    const cleanedUrl =
        image.substring(0, 12) === ipfsPrefix ? cleanUrl(image) : "abcd";


    this.data = {attributes, name, created_by, external_url, description, image_details, image: cleanedUrl, image_url}
      console.log('this.data', this.data)
    if(!uriObject){
      this.status = 'error'
    } else {

      this.status = null
    }
    // this.data = await fetch(
    //   uri
    // ).then(res => res.json())
  },
  
  methods: {
    ...mapActions({
      getNftData: "uiStore/getNftData",
    }),
  }
}
</script>
