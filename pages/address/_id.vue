<template>
  <v-row class="gallery-page">
    
    
    <v-col class="text-center">
      <div v-if="$fetchState.pending"><v-icon large class="loading-icon">mdi-loading</v-icon> Loading ...</div>
      <div v-else-if="$fetchState.error">Error: {{ $fetchState.error.message }}</div>
      <v-col v-else>
        <v-row >
            <v-col class="mb-4 pb-2">
                <v-btn v-if="!tokenId" @click="handleRefresh" >Reset</v-btn>
                <v-btn v-if="!tokenId" @click="handleNext" >Next Page</v-btn>
                <!-- <v-btn @click="handleConnect" v-if="!walletAddress">connect wallet</v-btn> -->
                <!-- <div v-if="walletAddress">Connected</div> -->
            </v-col>
        </v-row>
        <v-row >
          <v-col class="text-center mb-4 pa-2">
                <v-divider />
            <div v-if="!tokenId">Showing {{assets.length}} Panda{{assets.length > 1 ? 's' : ''}} for {{searchAddress}}</div>
            <div v-if="tokenId">Showing Panda {{tokenId}}</div>
            
            <!-- <div v-if="!tokenId">Showing {{assets.length}}</div> -->
          </v-col>
        </v-row>
        <v-dialog
          
          v-model="showDialog"
          scrollable
          max-width="900px"
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
            <div class="traits">
              <div 
                v-for="(trait, index) in detail.traits" :key="index" v-if="detail && detail.traits"
                class="trait">
                <label>{{trait.trait_type}}</label><br />
                <div>{{trait.value}}</div>
              </div>
            </div>
              <div 

                class="trait">
                <label>Background Color</label><br />
                <div><span class="swatch" :style='`background-color: #${detail.background_color}; width: 20px; height: 20px; display: inline-block; border-radius: 4px;`'>&nbsp;</span> #{{detail.background_color}} </div>
              </div>
              <v-divider/>
            <v-row> 
              <v-col>
              <div >
                <label>Owner</label><br />
                <div>{{detail.owner.address}}</div>
                <label>Active Address</label><br />
                <div>{{walletAddress || "Wallet not Connected"}}</div><br />
                <div >{{isOwner ? "You!" : ''}}</div>
              </div> 
              </v-col>
              <v-col >
                <v-card flat max-width="300px" >
                  <v-card-text class="px-0">
                    <v-img width="100px" :src="detail.image_thumbnail_url" :style="`background: #${detail.background_color}`" />
                    <a :href="detail.image_original_url" target="blank" v-if="isOwner">
                      <v-icon small>mdi-open-in-new</v-icon> View Original Image
                      </a>
                  </v-card-text>
                </v-card>
                
                <div v-if="walletAddress === detail.owner.address" >{{detail.owner.address}}</div>
                <div v-if="walletAddress === detail.owner.address" >is Owner</div>
              </v-col> 
            </v-row>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-btn
                color="blue darken-1"
                text
                @click="handleCloseDetail"
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
          elevation="1"
          class="asset"
          style="margin: 12px;"
          @click="handleDetail(asset.id)"
          >
            
            <v-card-title>#{{asset.token_id}} <v-spacer />
            <v-btn  icon  @click="handleDetail(asset.id)"><v-icon>mdi-dots-horizontal</v-icon></v-btn>
            </v-card-title>
            <v-card-text :style='`background: #${asset.background_color}`' >
              <v-img :src="asset.image_preview_url" height="260"  />
            </v-card-text>
          </v-card>
          
        </div>
      </v-col>
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
.traits{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.trait{
  flex-basis: 49.5%;
  margin-bottom: .5rem;
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

  import Web3 from "web3";
  import Web3Modal from "web3modal";
  import { mapMutations, mapGetters } from "vuex";
export default {

  data() {
    return {
      searchAddress: '',
      offset: 0,
      ids: [],
      assets: [],
      walletAddress2: null,
      tokenId: null,
      detail: null,
      showDialog: false,
      providerOptions: {
        walletconnect: {
          // package: WalletConnectProvider,
          options: {
            infuraId: "-"
          }
        }
      },
    }
  },
  created(){
    // console.log('id', this.$route.params.id)
    const {searchAddress} = this;
    const {params, query } = this.$route;
    console.log('thisroute', this.$route)
    this.searchAddress = params.id
    this.tokenId = query.id
    console.log('the search address is', searchAddress)
  },
  mounted(){
    this.$nextTick(async () => {
      console.log('connect...')
      // const web3modal = this.$refs.web3modal;
      // this.handleConnect()
      // this.$store.commit('setWeb3Modal', web3modal)
      // if (web3modal.cachedProvider) {
      //   await this.$store.dispatch('connect')
      //   this.subscribeMewBlockHeaders()
      // }

    })

  
  },
  computed: {
    ...mapGetters({
      walletAddress: "uiStore/walletAddress",
    }),
    isOwner(){
      const {walletAddress, detail } = this;
      if(!walletAddress || !detail) {return false}
      const tokenOwner = detail && detail.owner.address
      const isSame = this.stringEquals(tokenOwner, walletAddress);
      console.log('is owner tokenOwner', tokenOwner, walletAddress, isSame)
      
      return isSame
    }
  },
  async fetch() {
    const {
      searchAddress,
      ids,
      offset,
      tokenId,

    } = this;
    if(searchAddress === 'all'){
      this.assets = await fetch(
        `https://api.opensea.io/api/v1/assets?token_ids=${tokenId}&asset_contract_address=0x663e4229142a27F00baFB5D087e1e730648314c3&order_direction=desc&offset=0&limit=20`
      ).then((response) => {
      // The response is a Response instance.
      // You parse the data into a useable format using `.json()`
        return response.json();
      }).then(res => {
        console.log('res sinfle', res)
        const {assets } = res;
        const detail = assets && assets[0]
        console.log('detail', detail)
        this.detail = detail
        this.showDialog = true
        return assets
      })
      
      return
    } 
    // this.posts = await this.$http.$get('https://api.nuxtjs.dev/posts')
    console.log('about to get assets. Offset: ', offset, ' tokenid: ', tokenId,  ' searchAddress: ', searchAddress )
      this.assets = await fetch(
        `https://api.opensea.io/api/v1/assets?order_direction=asc&offset=${offset}&limit=50&collection=pandaearth&owner=${searchAddress}`
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
    ...mapMutations({
      setWallet: "uiStore/setWallet",
    }),
    handleSearch(){
      console.log(searchAddress)
      const {searchAddress} = this;
      this.$router.push(`/address/${searchAddress}`)
    },
    handleNext(){
      this.offset = this.offset + 50;
      this.$fetch()
      
    },
    handleRefresh(){
      this.offset = 0;
      this.$fetch()
    },
    handleDetail(id){
      console.log('id', id)
      const {assets} = this
      const thisAsset = assets && assets.find(asset => asset.id === id);
      console.log('thisAsset', thisAsset)
      this.detail = thisAsset
      this.showDialog = true
    },
    handleCloseDetail(){
      this.detail = null
      this.showDialog = false
    },
    openLink(url){
      window && window.open(url);
    },
    
    async handleConnect(){
      console.log('handle', Web3Modal)
      const providerOptions = this.providerOptions;

    const web3Modal = new Web3Modal({
      network: "mainnet", // optional
      cacheProvider: true, // optional
      providerOptions // required
    });

    const provider = await web3Modal.connect();

    const web3 = new Web3(provider);
    
    // console.log('web3', web3)
    // Get connected chain id from Ethereum node
    // const chainId = await web3.eth.getChainId();
    
    const accounts = await web3.eth.getAccounts();
      if(accounts[0]){
        // this.walletAddress = accounts[0];
        this.$store.commit("uiStore/setWallet", accounts[0]);
      }

    },
    stringEquals(a, b) {
      return typeof a === 'string' && typeof b === 'string'
        ? a.localeCompare(b, undefined, { sensitivity: 'accent' }) === 0
        : a === b;
    }

  }
}
</script>

