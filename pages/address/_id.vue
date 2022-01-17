<template>
  <v-row class="gallery-page">
    <v-col class="text-center">
      <div>id</div>
      <div>
        <label>Address</label>
        {{searchAddress}}
      </div>
      <v-dialog
        v-model="showDialog"
        scrollable
        max-width="300px"
      >
        <v-card light v-if="detail">
          <v-card-title>#{{detail.token_id}} Detail</v-card-title>
          <v-divider></v-divider>
          <v-card-text style="height: 400px;">
            
           <div v-if="detail" class="py-4">
             <label>Description</label><br />
            {{detail.description}}
           </div> 
           <v-divider/>
            <div 
              v-for="(trait, index) in detail.traits" :key="index" v-if="detail && detail.traits"
              class="trait">
              <label>{{trait.trait_type}}</label><br />
              <div>{{trait.value}}</div>
            </div>
            
            <v-divider/>
           <div >
             <a :href="detail.image_original_url" target="blank">
               <v-icon small>mdi-open-in-new</v-icon> View Original Image
            </a>
           </div> 
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn
              color="blue darken-1"
              text
              @click="showDialog = false"
            >
              Close
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="openLink(`https://opensea.io/assets/0x663e4229142a27f00bafb5d087e1e730648314c3/${detail.token_id}`)"
            >
              <v-icon small>mdi-open-in-new</v-icon>
              opensea
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <div class="gallery-wrap">
        <v-card 
        v-for="(asset, index) in assets" :key="index"
        width="260"
        light
        elevation="5"
        style="margin: 12px;"
        >
          
          <v-card-title>#{{asset.token_id}} <v-spacer />
          <v-btn  icon  @click="handleDetail(asset.id)"><v-icon>mdi-dots-horizontal</v-icon></v-btn>
          </v-card-title>
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
.gallery-page{
  background: linear-gradient(267deg, #29e1d9, #29a5e1);
}
.gallery-wrap{
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  
}
.trait{
  margin-bottom: .5rem;
  
}
label{
  font-size: .875em;
  text-transform: uppercase;
  font-weight: bold;
}
</style>

<script>

export default {
  data() {
    return {
      searchAddress: '',
      ids: [],
      assets: [],
      detail: null,
      showDialog: false
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
    },
    handleDetail(id){
      console.log('id', id)
      const {assets} = this
      const thisAsset = assets && assets.find(asset => asset.id === id);
      console.log('thisAsset', thisAsset)
      this.detail = thisAsset
      this.showDialog = true
    },
    openLink(url){
      window && window.open(url);
    }
  }
}
</script>

