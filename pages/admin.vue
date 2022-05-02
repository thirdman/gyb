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
            <div><strong>{{config.mode}}</strong></div>
            <v-btn-toggle
              mandatory 
            >
            
              <v-btn
                x-large
                :highlighted="accessMode === 'all'" @click="() => this.setMode('all')">
                <v-icon>mdi-checkbox-multiple-marked-circle </v-icon>
                <span>ALL</span>
              </v-btn>
              <!-- <v-btn :selected="accessMode === 'contain'" @click="() => this.tempMode = 'contain'">
                <v-icon>mdi-checkbox-marked-circle</v-icon>
                <span>Contains minimum balance</span>
              </v-btn> -->
              <v-btn
                x-large  
                :selected="accessMode === 'any'" 
                @click="() => this.setMode('any')"
                >
                <v-icon>mdi-checkbox-multiple-marked</v-icon>
                <span>ANY</span>
              </v-btn>
              <v-btn
                x-large  
                disabled
                :selected="accessMode === 'single'" @click="() => this.setMode('single')">
                <v-icon>mdi-checkbox-multiple-marked</v-icon>
                <span>SINGLE </span>
              </v-btn>
            </v-btn-toggle>
            <div>
              <p v-if="accessMode === 'all'">ALL: The wallet must own each of the defined NFT. 
                <br />This method requires the NFT to have multiple editions
                <br />Eg. Must own one of Rarible NFT #2345, #4565, and #6789
                </p>
              <p v-if="accessMode === 'single'">
                SINGLE (not available): wallet must own the unique
              </p>
              <p v-if="accessMode === 'any'">ANY: The wallet can contain any nft from a defined address. 
                <br />This method allows the NFT to be unique
                <br />Eg. Must contain at least {{config.minCount}} CryptoKitty NFT. (dependent on minCount setting)

              </p>
            </div>
            <br />
            <label>Minimum Count</label>
            <div>{{config.minCount}}</div>
            <label>Is Live</label>
            <div>{{config.isLive ? 'yes' : 'no'}}</div>
            <label>Target Network</label>
            <div class="row ma-0 pa-0"> 
              
            <v-btn
              elevation="0"
              x-small
              v-if="config && config.targetNetwork" 
              :color="config.targetNetwork === 'rinkeby' ? 'orange' : 'success'" 
              class="pa-2 ma-4 ml-0"
              >
              {{config.targetNetwork}}
            </v-btn>
              
            
              <v-switch
                v-model="isRinkeby"
                inset
                :label="`${isRinkeby ? 'Use Rinkeby Network' : ' Use Main Network'}`"
              ></v-switch>
            
            </div>
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
            <div class="nft-list" v-if="config.targetNetwork === 'rinkeby'">
              <div v-for="(nftId, index) in config.nft.rinkeby" :key="`rinkeby-#${index}`" class="nft-list-item">
                  #{{nftId.toString()}}
                  <br />
                  <Nft :id="`${nftId}`" :contract="config.contract.rinkeby" />
              </div>
            </div>
            <v-divider></v-divider>
            <label>Main Contract</label>
            <div>{{config.contract.main}}</div>
            <label>Main NFTs</label>
            <!-- <div v-for="(nftId, index) in config.nft.main" :key="`main-#${index}`">
                #{{nftId.toString()}}
            </div> -->
            <div class="nft-list" v-if="config.targetNetwork === 'main'">
              <div v-for="(nftId, index) in config.nft.main" :key="`main-#${index}`" class="nft-list-item">
                  #{{nftId.toString()}}
                  <br />
                  <Nft
                    :id="`${nftId}`" 
                    :contract="config.contract.main.toString()"
                  />
                  {{config.contract.main}}
                  <!-- :contract="config.contract.main.toString()"  -->
              </div>
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

<style scoped lang="scss">
.nft-list{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  .nft-list-item{
    margin-right: 4px;
  }
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
  },
  data() {
    return {
      tempMode: 'balance',
      tokenId: "",
      url: "https://testnets.opensea.io/collection/unidentified-contract-vheq2nb5wa",
      
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
    
    isRinkeby: {
      get(){
        const {targetNetwork} = this.config;
        return targetNetwork === 'rinkeby' ? true : false;
      },
      set(newState){
        console.log('newstate', newState)
        const newNetwork = newState ? 'rinkeby' : 'main'; // newstate is boolean, true = rinkeby
        return this.setTargetNetwork(newNetwork)
      } 
    },
    accessMode: {
      get(){
        const {mode} = this.config;
        return mode;
      },
      set(newState){
        
         return this.setMode(newState)
      } 
    },
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
    ...mapMutations({
      setTargetNetwork: "uiStore/setTargetNetwork",
      setMode: "uiStore/setMode",
    })
    
  }
}
</script>
