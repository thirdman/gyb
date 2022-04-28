<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="12" md="8">
     
      <div class="text-center">
        <h1>Admin</h1>
      </div>
       
       <div >
        <v-card  outlined color="transparent" class="text-center">
        <p>This page is Visible only to those with wallet in the admin whitelist</p>
        <p>In a production environment this page would be restricted</p>
        </v-card>
        <v-divider />
        <div >
        <v-card flat div class="mb-4" v-if="config && config.adminAddresses">
            <v-card-title>Admin Wallets</v-card-title>
          <v-card-text>
            <div v-for="(address, index) in config.adminAddresses" :key="index">
                {{address.toString()}}
                <span v-if="walletAddress && walletAddress.toString() === address.toString()"><v-icon small color="success" >mdi-check-bold</v-icon></span>
              </div>
          </v-card-text>
        </v-card>
        <v-card flat div class="mb-4" v-if="config">
          <v-card-title>Config</v-card-title>
          <v-card-text>
            <label>Title</label>
            <div>{{config.title}}</div>
            <label>Mode</label>
            <div>{{config.mode}}</div>
            <label>Is Live</label>
            <div>{{config.isLive ? 'yes' : 'no'}}</div>
            <label>Target Network</label>
            <div>{{config.targetNetwork}}</div>
          </v-card-text>
        </v-card>
        <v-card flat div class="mb-4" v-if="config">
          <v-card-title>Required NFT</v-card-title>
          <v-card-text>
            <label>Rinkeby Contract</label>
            <div>{{config.contract.rinkeby}}</div>
            <label>Rinkeby ID's</label>
            <!-- <div>
              <div>
                {{this.getNftData({mode: 'uri', id: 1, contract: '0xed9583b4a8e2baef0dbd7c274ad40c68abd765bc'})}}
              </div>
              <div>
                {{this.getNftData({mode: 'object', id: 1, contract: '0xed9583b4a8e2baef0dbd7c274ad40c68abd765bc'})}}
              </div>
              <div>
                
                <Nft id="1" contract="0xed9583b4a8e2baef0dbd7c274ad40c68abd765bc" />
              </div>
            </div> -->
            <div class="nft-list">
            <div v-for="(nftId, index) in config.nft.rinkeby" :key="`rinkeby-#${index}`" class="nft-list-item">
                #{{nftId.toString()}}
                <br />
                <Nft :id="`${nftId}`" contract="0xed9583b4a8e2baef0dbd7c274ad40c68abd765bc" />
            </div>
            </div>
            <v-divider></v-divider>
            <label>Main Contract</label>
            <div>{{config.contract.main}}</div>
            <label>Main NFTs</label>
            <div v-for="(nftId, index) in config.nft.main" :key="`main-#${index}`">
                #{{nftId.toString()}}
            </div>
          </v-card-text>
        </v-card>
        
        <v-card flat div class="mb-4" v-if="config">
          <v-card-title>Messages</v-card-title>
          <v-card-text>
            <label>Success</label>
            <div>{{config.messages.success}}</div>
            <label>Partial</label>
            <div>{{config.messages.partial}}</div>
            <label>Failure</label>
            <div>{{config.messages.failure}}</div>
          </v-card-text>
        </v-card>
        <v-card flat div class="mb-4" v-if="config">
          <v-card-title>URLS</v-card-title>
          <v-card-text>
            <h3>Rinkeby</h3>
            <label>Info</label>
            <div>{{config.urls.rinkeby.info}}</div>
            <label>Etherscan</label>
            <div>{{config.urls.rinkeby.etherscan}}</div>
            <label>Opensea</label>
            <div>{{config.urls.rinkeby.opensea}}</div>
            <label>Target</label>
            <div>{{config.urls.rinkeby.target}}</div>
            <v-divider></v-divider>
            <h3>Main</h3>
            <label>Info</label>
            <div>{{config.urls.main.info}}</div>
            <label>Etherscan</label>
            <div>{{config.urls.main.etherscan}}</div>
            <label>Opensea</label>
            <div>{{config.urls.main.opensea}}</div>
            <label>Target</label>
            <div>{{config.urls.main.target}}</div>
            
          </v-card-text>
        </v-card>
          <!-- <v-btn :disabled="!walletAddress" v-if="walletAddress && !tokenBalances" @click="() => getBalances({mode: 'gyb'})">Check Balances</v-btn> -->
          <!-- <v-card light flat div v-if="walletAddress " class="pa-4 mb-4"> -->
            <!-- <v-btn :disabled="!walletAddress" @click="() => getChildBalance({tokenId: 1, mode: 'gyb'})">Check Balance #1</v-btn>
            <v-btn :disabled="!walletAddress" @click="() => getChildBalance({tokenId: 2, mode: 'gyb'})">Check Balance #2</v-btn>
            <v-btn :disabled="!walletAddress" @click="() => getChildBalance({tokenId: 3, mode: 'gyb'})">Check Balance #3</v-btn>
            <v-btn :disabled="!walletAddress" @click="() => getChildBalance({tokenId: 4, mode: 'gyb'})">Check Balance #4</v-btn>
            <v-btn :disabled="!walletAddress" @click="() => getChildBalance({tokenId: 5, mode: 'gyb'})">Check Balance #5</v-btn> -->
            <!-- <v-card-title>
              <div>{{balanceStatus || "Balances"}}</div>
              <v-spacer />
              <v-btn small outlined @click="() => getBalances({mode: 'gyb'})">Check</v-btn>
            </v-card-title>
            <div v-if="balanceStatus"><v-icon large class="loading-icon">mdi-loading</v-icon> Loading ...</div>
            <div v-if="tokenBalances">
              <div v-for="(value, id, index) in tokenBalances" :key="index">
                #{{id}} - {{value}}
                <span v-if="value > 0"><v-icon small color="success" >mdi-check-bold</v-icon></span>
                <span v-if="value < 1"><v-icon small color="red" >mdi-close-thick</v-icon></span>
              </div>
            </div>
            <v-divider />
            <v-card-actions>
              <div v-if="!balanceStatus">
              ACCESS: {{accessByBalance ? "yes" : "no"}}
              </div>
              <div v-if="balanceStatus"><v-icon small class="loading-icon">mdi-loading</v-icon></div>
            </v-card-actions>
          </v-card> -->
        
        </div>
        <!-- <v-card outlined light  v-if="walletAddress && tokenBalances && !accessByBalance">
          <h3>Access Denied</h3>
        </v-card> -->
        
      
      </div>
    </v-col>
  </v-row>
</template>

<style scoped>
.nft-list{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.loading-icon{
  animation:spin 1s linear infinite;
}


/* @keyframes spin { 
    100% { 
        transform:rotate(360deg); 
    } 
} */

</style>
<script>
import { mapMutations, mapGetters, mapActions } from "vuex";
import VueFriendlyIframe from "vue-friendly-iframe";
export default {
  created(){
    console.log('created', this.walletAddress)
    this.startApp();
  },
  mounted(){
    console.log('mounted', this.walletAddress)
    console.log('mounted', this.config)
    if(this.walletAddress){
      this.searchAddress = this.walletAddress
    }
  },
  data() {
    return {
      searchAddress: "0xb56d3a16afd1619aa9dbd99918c3ab70f1d41042",
      tokenId: "",
      url: "https://testnets.opensea.io/collection/unidentified-contract-vheq2nb5wa"
    }
  },
  computed: {
    ...mapGetters({
      config: "uiStore/config",
      walletAddress: "uiStore/walletAddress",
      walletNetwork: "uiStore/walletNetwork",
      ownerStatus: "uiStore/ownerStatus",
      tokenOwner: "uiStore/tokenOwner",
      userIsOwner: "uiStore/userIsOwner",
      tokenBalances: "uiStore/tokenBalances",
      balanceStatus: "uiStore/balanceStatus",
      accessByBalance: "uiStore/accessByBalance",
    }),
    hasAddress() {
      const {walletAddress} = this;
      if(walletAddress){
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    ...mapActions({
      startApp: "uiStore/startApp",
      checkOwner: "uiStore/checkOwner",
      getBalance: "uiStore/getBalance",
      getBalances: "uiStore/getBalances",
      getChildBalance: "uiStore/getChildBalance",
      getNftData: "uiStore/getNftData",
    }),
    handleSetUser(){
      const {walletAddress} = this;
      //const {searchAddress = ''} = this;
      this.searchAddress = walletAddress
      this.$router.push(`/address/${walletAddress}`)
    }
  }
}
</script>
