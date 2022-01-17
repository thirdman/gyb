<template>
  <v-row>
    <v-col class="text-center">
      <div>id</div>
      <div>
        <label>Address</label>
        {{searchAddress}}
      </div>
      <div class="gallery-wrap">
        <v-card 
        v-for="(asset, index) in assets" :key="index"
        width="260"
        light
        elevation="5"
        style="margin: 12px;"
        >
          
          <v-card-title>#{{asset.token_id}} {{asset.name}}</v-card-title>
          <v-card-text :style='`background: #${asset.background_color}`'>
            <v-img :src="asset.image_preview_url" height="260"  />
          </v-card-text>
        </v-card>
        {{assets.length}}
      </div>
    </v-col>
  </v-row>
</template>

<style scoped>
.gallery-wrap{
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
}
</style>
</style>
<script>

export default {
  data() {
    return {
      searchAddress: '',
      ids: [],
      assets: [],
    }
  },
  created(){
    // console.log('id', this.$route.params.id)
    const {params } = this.$route;
    this.searchAddress = params.id
  },
  
  async fetch() {
    const {
      searchAddress,
      ids
    } = this;
    
    // this.posts = await this.$http.$get('https://api.nuxtjs.dev/posts')
    
      this.assets = await fetch(
        `https://api.opensea.io/api/v1/assets?order_direction=asc&offset=0&limit=50&collection=pandaearth&owner=${searchAddress}`
        // 'https://api.opensea.io/api/v1/assets?token_ids=23&asset_contract_address=0x663e4229142a27F00baFB5D087e1e730648314c3&order_direction=desc&offset=0&limit=20'
        // 'https://api.opensea.io/api/v1/assets?owner=0x663e4229142a27f00bafb5d087e1e730648314c3&asset_contract_address=0x663e4229142a27F00baFB5D087e1e730648314c3&order_direction=desc&offset=0&limit=20',
        // 'https://api.opensea.io/api/v1/assets?token_ids=&asset_contract_address=0x663e4229142a27F00baFB5D087e1e730648314c3&order_direction=desc&offset=0&limit=20'
      ).then((response) => {
      // The response is a Response instance.
      // You parse the data into a useable format using `.json()`
        return response.json();
      }).then(res => {
        console.log('res', res)
        const {assets } = res;
        
        return assets
      })
    
    console.log('assets:', this.assets)
  },
  methods: {
    handleSearch(){
      console.log(searchAddress)
      const {searchAddress} = this;
      this.$router.push(`/address/${searchAddress}`)
    }
  }
}
</script>

