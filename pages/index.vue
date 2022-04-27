<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="12" md="8">
     
      <div class="text-center">
        <h1>Home</h1>
      </div>
       
       <div class="text-center">
         <v-card
          outlined
          dark
          flat
          v-if="!walletAddress " class="pa-4 mb-4"
          >
            <p>This page is visible to all users</p>
            <p>To obtain access connect an ethereum wallet that owns the Access NFT.</p>
         </v-card>
         
      <div >
        
            <!-- <v-btn :disabled="!walletAddress" @click="() => getChildBalance({tokenId: 1, mode: 'gyb'})">Check Balance #1</v-btn>
            <v-btn :disabled="!walletAddress" @click="() => getChildBalance({tokenId: 2, mode: 'gyb'})">Check Balance #2</v-btn>
            <v-btn :disabled="!walletAddress" @click="() => getChildBalance({tokenId: 3, mode: 'gyb'})">Check Balance #3</v-btn>
            <v-btn :disabled="!walletAddress" @click="() => getChildBalance({tokenId: 4, mode: 'gyb'})">Check Balance #4</v-btn>
            <v-btn :disabled="!walletAddress" @click="() => getChildBalance({tokenId: 5, mode: 'gyb'})">Check Balance #5</v-btn> -->
          <v-btn :disabled="!walletAddress" v-if="walletAddress && !tokenBalances" @click="() => getBalances({mode: 'gyb'})">Check Balances</v-btn>
          <!-- <v-card light flat div v-if="walletAddress " class="pa-4 mb-4">
            <v-card-title>
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
        <v-card
          dark
          color="danger"  v-if="walletAddress && tokenBalances && !accessByBalance">
          <h3>Access Denied</h3>
        </v-card>
      
      </div>
    </v-col>
  </v-row>
</template>

<style scoped>
.loading-icon{
  animation:spin 1s linear infinite;
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
import { mapMutations, mapGetters, mapActions } from "vuex";
import VueFriendlyIframe from "vue-friendly-iframe";
export default {
  created(){
    console.log('created', this.walletAddress)
    this.startApp();
  },
  mounted(){
    console.log('mounted', this.walletAddress)
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
