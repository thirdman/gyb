<template>
  <v-card class="NftElement ma-4" elevation="4" outlined  :color="this.status === 'error' ? 'red' : 'secondary'" width="200">
    <div v-if="this.status">{{this.status}}</div>
    <!-- <v-card-title v-if="this.data && this.data.name">
      {{this.data.name}}
    </v-card-title> -->
    
    <img :src="this.data.image" v-if="this.data && this.data.image" />
    <v-card-text v-if="this.data">
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
  min-width: 100px;
  
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
      default: null
    },
    mode: {
      type: String,
      default: null
    }
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
    const {id, mode = 'object'} = this;
    this.status = 'loading'
    const uriObject = await this.getNftData({mode: 'object', id: id, contract: '0xed9583b4a8e2baef0dbd7c274ad40c68abd765bc'}).catch((error) => {console.log('error', error)}).catch((error) => {console.log('uri object error', error)});
    console.log('uri object', uriObject)
    if(!uriObject || typeof uriObject !== 'object'){
      this.status = 'error'
      return
    }
    const {attributes, name, created_by, external_url, description, image_details, image, image_url} = uriObject
    this.data = {attributes, name, created_by, external_url, description, image_details, image, image_url}
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
