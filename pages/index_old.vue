<template>
<v-container>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
     
      <div class="text-center">
        <h1>Panda Earth Info </h1>
      </div>
       <div class="text-center py-4">
        <nuxt-link to="/gallery" class="v-btn v-btn--outlined theme--dark v-size--default"><strong>Find your pandas...</strong></nuxt-link>
      </div>
      <v-divider />
      <!-- <div class="text-center mt-4">
      <v-card rounded elevation="3" width="400px" style="margin: auto;">
        <v-img src="https://pandaearth.online/preview.png" width="400px" />
      </v-card>
      </div> -->
      
    </v-col>
  </v-row>
  <v-row justify="center" align="center">
    <div v-if="$fetchState.pending"><v-icon large class="loading-icon">mdi-loading</v-icon> Loading ...</div>
    <div v-else-if="$fetchState.error">Error: {{ $fetchState.error.message }}</div>
    <v-col v-else class="text-center">
      <h2>Recent Listings</h2>
      <div class="gallery-wrap " v-if="events">
        <div class="gallery-item" v-for="(event, index) in events" :key="index"
        style="margin: 4px;" 
          >
          <v-card 
          width="240"
          light
          elevation="1"
          class="asset"
          
          @click="handleGoToDetail(event.asset.token_id)"
          >
            
            <v-card-subtitle  class="ma-0 pa-1" ><span>{{event.event_type === 'created' ? 'Listed' : event.event_type}} {{formatDate(event.created_date)}}</span>
           
              
            </v-card-subtitle>
            <v-card-text :style='`background: #${event.asset.background_color}`' >
              <v-img :src="event.asset.image_preview_url" height="240"  />
            </v-card-text>
          </v-card>
          <div class="text-body-2" v-if="event.starting_price">
            <img alt="ETH" class=" Price--eth-icon" src="https://storage.opensea.io/files/6f8e2979d428180222796ff4a33ab929.svg" size="16">
            {{(event.starting_price / 1e+18 ).toFixed(2) }}
            
            <!-- <span style="font-weight: bold">{{( asset.last_sale.total_price / 1e+18 ).toFixed(2) }}</span> -->
          </div>
        </div>
      </div>
      <label>Recent Sales</label>
      <div class="gallery-wrap " >
        <div class="gallery-item" v-for="(asset, index) in assets" :key="index"
        style="margin: 4px;" 
          >
          <v-card 
          width="120"
          light
          elevation="1"
          class="asset"
          
          @click="handleGoToDetail(asset.token_id)"
          >
            
            <v-card-subtitle  class="ma-0 pa-1" ><span>#{{asset.token_id}}</span>
              <!-- <v-btn icon small  @click="handleDetail(asset.id)">
                
              </v-btn> -->
              <span class="trait-pop" >
                {{getTrait(asset.traits, 'gen')}}
              </span>
              <span class="trait-pop" >
                {{getTrait(asset.traits, 'purity')}}
              </span>
            </v-card-subtitle>
            <v-card-text :style='`background: #${asset.background_color}`' >
              <v-img :src="asset.image_preview_url" height="90"  />
            </v-card-text>
          </v-card>
          <div class="text-body-2" v-if="asset.last_sale">
            <img alt="ETH" class=" Price--eth-icon" src="https://storage.opensea.io/files/6f8e2979d428180222796ff4a33ab929.svg" size="16">
              <!--{{asset.last_sale.payment_token.symbol}}</span> &nbsp; -->
            <span style="font-weight: bold">{{( asset.last_sale.total_price / 1e+18 ).toFixed(2) }}</span>
          </div>
        </div>
      </div>
      
    </v-col>
  </v-row>
</v-container>
</template>

<style scoped>
.gallery-wrap{
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: center;
}
.Price--eth-icon{
  filter: brightness(3);
  width: 8px;
}
.loading-icon{
  animation:spin 1s linear infinite;
}
.asset{
  transition: .3s ease box-shadow, .3s ease-in-out transform;
  transform: translateY(0px);
}
.asset:hover{
  transform: translateY(-2px);
  box-shadow: 0 3px 5px -1px rgba(0,0,0,.2),0 5px 8px 0 rgba(0,0,0,.14),0 1px 14px 0 rgba(0,0,0,.12) !important;
}
.trait-pop{
  font-size: .75rem;
  background: #146388;
  border-radius: 1rem;
  color: #fff;
  font-weight: bold;
  padding: 2px;
  display: inline-block;
  line-height: 1rem;
  min-width: 1.2rem;
  position: relative;
  
}
.trait-pop + .trait-pop{
  margin-left: -3px;
  background: #3287af;
}
label{
  font-size: .875em;
  text-transform: uppercase;
  font-weight: bold;
}
@keyframes spin { 
    100% { 
        transform:rotate(360deg); 
    } 
}
</style>
<script>
import Logo from '~/components/Logo.vue'
import VuetifyLogo from '~/components/VuetifyLogo.vue'
import { format, formatDistance, formatRelative, subDays } from 'date-fns'


export default {
  head () {
    return {
      meta: [
        { hid: 'og:image', property: 'og:image', content: 'https://www.superdthailand.com/media/wysiwyg/Test-Logo-Circle-black-transparent.png' }
      ]
    }
  },
  components: {
    Logo,
    VuetifyLogo
  },
  data(){
    return {
      tokenId: '',
      offset: 0,
      mode: 'all',
      assets: null,
      events: null,
    }
  },
  mounted(){
    this.getEvents();
  },
  async fetch() {
    const {
      mode,
      offset,
      tokenId,
    } = this;
    
    const myHeaders = new Headers({
          'Accept': 'application/json',
          'X-API-KEY': '224a36b5b34d45a29a6bf385b13356ee'
        });

      


      this.assets = await fetch(
        // `https://api.opensea.io/api/v1/assets?asset_contract_address=0x663e4229142a27F00baFB5D087e1e730648314c3&order_direction=desc&offset=0&limit=20`
        `https://api.opensea.io/api/v1/assets?order_direction=desc&order_by=sale_date&offset=${offset}&limit=16&collection=pandaearth`,
        {headers: myHeaders}
      ).then((response) => {
        console.log('fetch response', response)
      // The response is a Response instance.
      // You parse the data into a useable format using `.json()`
        return response.json();
      }).then(res => {
        console.log('res assets sold', res)
        const {assets } = res;
        // const detail = assets && assets[0]
        // console.log('detail', detail)
        // this.detail = detail
        // this.showDialog = true
        return assets
      })
      
      

  //     this.listings = await fetch(
  //       `https://api.opensea.io/api/v1/events?collection_slug=pandaearth&only_opensea=false&offset=0&limit=20`
  //       // `https://api.opensea.io/api/v1/assets?asset_contract_address=0x663e4229142a27F00baFB5D087e1e730648314c3&order_direction=desc&offset=0&limit=20`
  // //       `https://api.opensea.io/api/v1/assets?order_direction=asc&order_by=sale_price&offset=${offset}&limit=16&collection=pandaearth`
  //     ).then((response) => {
  //     // The response is a Response instance.
  //     // You parse the data into a useable format using `.json()`
  //       return response.json();
  //     }).then(res => {
  //       console.log('res listings', res)
  //       const {assets} = res;
  //       // const detail = assets && assets[0]
  //       // console.log('detail', detail)
  //       // this.detail = detail
  //       // this.showDialog = true
  //       return assets
  //     })
    
    
    console.log('assets:', this.assets)
    // console.log('listings:', this.listings)
      return
  },
  methods: {
  handleGoToDetail(id){
      
      if(!id){
        alert('Missing token Id')
        return
      }
      
      this.$router.push(`/address/all?id=${id}`)
    },
    getTrait(traits, target){
      
      const trait = traits.find(trait => trait.trait_type === target);
      const value = trait && trait.value;
      return value
    },
    formatDate(theData){
      const relativeDate = formatRelative(new Date(theData), new Date())
      console.log('relative', relativeDate)
      return relativeDate
    },

    async getEvents(){
      const { data, headers } = await this.$axios.get(`https://api.opensea.io/api/v1/events?collection_slug=pandaearth&only_opensea=false&offset=0&limit=20&event_type=created`, {
        // withCredentials: true,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Accept': 'application/json',
          'X-API-KEY': '224a36b5b34d45a29a6bf385b13356ee'
        }
      })
      .then((response) => {
        console.log('response', response)
        // return response.json();
      });
      // console.log('data', 'headers', data, headers, body)
      
      // if(body){
      //   console.log('body', body)
      // };
      // if(data){
      //   const {asset_events} = data
      //   console.log('asset_events', asset_events)
      //   this.events = asset_events;
      //   //         const today = format(new Date(), "'Today is a' eeee")
      //   //         const distance = formatDistance(subDays(new Date(), 3), new Date(), { addSuffix: true })
      //   // //=> "3 days ago"

      //   // const relative = formatRelative(subDays(new Date(), 3), new Date())

      //   // //=> "last Friday at 7:26 p.m."
      //   //         console.log('today ', today)
      //   //         console.log('today ', distance)
      //   //         console.log('today ', relative)
      // }
    }
  },
}
</script>
