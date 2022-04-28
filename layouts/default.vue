<template>
  <v-app class="bg" id="abkdlfj" :style="{background: $vuetify.theme.themes['dark'].bg}">
    <v-app-bar
      :clipped-left="clipped"
      absolute
      flat
      app
      hide-on-scroll
      
      border="bottom"
      color="transparent" 
    >
      <v-toolbar-title v-text="title" />
      <v-spacer />

      <v-btn
        text
        @click="goTo('/')"
      >
        Visible Page
      </v-btn>
      <v-btn
        v-if="accessByBalance"
        :disabled="walletAddress ? false : true"
        text
        @click="goTo('/gallery')"
      >
        Hidden Page
      </v-btn>
      <v-btn
        text
        @click="goTo('/admin')"
      >
        Admin Page
      </v-btn>
      <v-spacer />
      <v-btn
        elevation="0"
        x-small
        v-if="walletNetwork && targetNetwork === walletNetwork" :color="walletNetwork === 'rinkeby' ? 'orange' : 'success'" class="pa-1 mr-2">
        {{walletNetwork}}
      </v-btn>
      <v-card v-if="walletNetwork && targetNetwork !== walletNetwork" color="error" class="pa-1 mr-2">
        Please change to <strong>{{targetNetwork}}</strong> network
      </v-card>
      <div v-if="walletAddress">
        <!-- <v-btn text @click="() => setBalanceDialog(!hasBalanceDialog)"><v-icon color="success" size="small">mdi-wallet</v-icon> -->

        <span v-if="balanceStatus"><v-icon small class="loading-icon">mdi-loading</v-icon> {{balanceStatus}} ...</span>
        </v-btn>
        <v-btn text @click="() => setWalletDialog(!hasWalletDialog)"><v-icon color="success" size="small">mdi-wallet</v-icon>{{formatAddress(walletAddress, 2)}} <v-icon>mdi-chevron-down</v-icon></v-btn>
        <v-dialog
          v-model="userDialog"
          scrollable
          max-width="900px"
        >
          <v-card light >
            <v-card-title>
              <v-icon>mdi-wallet</v-icon> {{walletAddress}}
              </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <label>WALLET </label>
              <div v-if="walletAddress">{{walletAddress}}</div>
              <label>NETWORK</label>
              <div>{{walletNetwork}}</div>
              
            </v-card-text>
             <v-divider></v-divider>
            <v-card-text>
              <label>STATUS </label>
              <div v-if="balanceStatus"><v-icon large class="loading-icon">mdi-loading</v-icon> Loading ...</div>
              <div v-if="balanceStatus">{{balanceStatus}}</div>
              <div v-if="tokenBalances" class="token-list">
              <div v-for="(value, id, index) in tokenBalances" :key="index" class="token-list-item text-center">
                <div>#{{id}}: {{value}}
                  <span v-if="value > 0"><v-icon small color="success" >mdi-check-bold</v-icon></span>
                  <span v-if="value < 1"><v-icon small color="red" >mdi-close-thick</v-icon></span>
                </div>
                <Nft
                  :id="`${id}`"
                  contract="0xed9583b4a8e2baef0dbd7c274ad40c68abd765bc"
                  size="80"
                  display="image"
                  elevation="1"
                  />
                
              </div>
            </div>
              <v-card
                dark
                flat
                color="red"
                class="pa-4"
                v-if="walletAddress && tokenBalances && !accessByBalance">
                <h3>Access Denied</h3>
              </v-card>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-btn
                text
                @click="() => setWalletDialog(false)"
                >
                Close
              </v-btn>
              <v-btn
                text
                @click="resetWallet"
                >
                Disconnect
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
      <v-btn
        @click="handleConnect"
        v-if="!walletAddress"
        outlined
      >
       Connect Wallet
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-dialog
          v-model="balanceDialog"
          scrollable
          max-width="900px"
        >
          <v-card light >
            <v-card-title>
              <v-icon>mdi-wallet</v-icon> {{balanceStatus || "Balances"}}
              <v-spacer />
              <v-btn small outlined @click="() => getBalances({mode: 'gyb'})">Check Balances</v-btn>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <label>STATUS </label>
              <div v-if="balanceStatus"><v-icon large class="loading-icon">mdi-loading</v-icon> Loading ...</div>
              <div v-if="balanceStatus">{{balanceStatus}}</div>
              <div v-if="tokenBalances">
              <div v-for="(value, id, index) in tokenBalances" :key="index">
                #{{id}} - {{value}}
                <Nft :id="`${id}`" contract="0xed9583b4a8e2baef0dbd7c274ad40c68abd765bc" size="80" mode="image" />
                <span v-if="value > 0"><v-icon small color="success" >mdi-check-bold</v-icon></span>
                <span v-if="value < 1"><v-icon small color="red" >mdi-close-thick</v-icon></span>
              </div>
            </div>
              <v-card
                dark
                flat
                color="red"
                class="pa-4"
                v-if="walletAddress && tokenBalances && !accessByBalance">
                <h3>Access Denied</h3>
              </v-card>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-btn text @click="() => setBalanceDialog(false)">Hide</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
    <!-- <v-navigation-drawer
      v-model="rightDrawer"
      :right="right"
      temporary
      fixed
    >
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light>
              mdi-repeat
            </v-icon>
          </v-list-item-action>
          <v-list-item-title>Switch drawer (click me)</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer> -->
    <v-footer
      :absolute="!fixed"
      app
      
    >
      <span>&copy; {{ new Date().getFullYear() }}</span>
      <v-spacer />
    </v-footer>
  </v-app>
</template>

<script>
  import Web3 from "web3";
  import Web3Modal from "web3modal";
  import { formatEthAddress } from 'eth-address';
  import { mapMutations, mapGetters, mapActions } from "vuex";
export default {
  head () {
    return {
      meta: [
        { hid: 'og:image', property: 'og:image', content: 'https://www.superdthailand.com/media/wysiwyg/Test-Logo-Circle-black-transparent.png' }
      ]
    }
  },
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      miniVariant: false,
      right: true,
      rightDrawer: false,
      showUserContent: false,
      title: 'Site Name',
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
  computed: {
    ...mapGetters({
      walletAddress: "uiStore/walletAddress",
      walletNetwork: "uiStore/walletNetwork",
      targetNetwork: "uiStore/targetNetwork",
      hasBalanceDialog: "uiStore/hasBalanceDialog",
      hasWalletDialog: "uiStore/hasWalletDialog",
      balanceStatus: "uiStore/balanceStatus",
      tokenBalances: "uiStore/tokenBalances",
      accessByBalance: "uiStore/accessByBalance",
      
    }),
    userDialog: {
      get(){
        return this.hasWalletDialog
      },
      set(newState){
        return this.setWalletDialog(newState)
      } 
    },
    balanceDialog: {
      get(){
        return this.hasBalanceDialog
      },
      set(newState){
        return this.setBalanceDialog(newState)
      } 
    }
  },
  methods: {
    ...mapMutations({
      setBalanceDialog: "uiStore/setBalanceDialog",
      setWalletDialog: "uiStore/setWalletDialog",
    }),
    ...mapActions({
      getBalances: "uiStore/getBalances"
    }),
    formatAddress(address, number){ 
      return formatEthAddress(address, number)
    },
    handleDialog(newState = true){ 
      this.$store.commit("uiStore/setWalletDialog", newState);
    },
    goTo(path){
      console.log('path', path);
      this.$router.push(path)
    },
    resetWallet(){
      this.$store.commit("uiStore/setWallet", null);
      this.$store.commit("uiStore/setWalletNetwork", null);
      this.$store.commit("uiStore/setTokenBalances", null);
    },
    async handleConnect(doRedirect = true){
      console.log('handle', Web3Modal)
      const {targetNetwork = 'mainnet'} = this;
      const providerOptions = this.providerOptions;
      // const targetNetwork = targetNetwork || 'mainnet'
      const web3Modal = new Web3Modal({
        network: targetNetwork, // optional
        cacheProvider: true, // optional
        providerOptions // required
      });

      const provider = await web3Modal.connect();
      const web3 = new Web3(provider);
      
      // console.log('web3', web3)
      // Get connected chain id from Ethereum node
      // const chainId = await web3.eth.getChainId();
      const networkId = await web3.eth.net.getNetworkType()
      const accounts = await web3.eth.getAccounts();
      // Subscribe to accounts change
      provider.on("accountsChanged", (accounts) => {
        console.log(accounts);
      });

      // Subscribe to chainId change
      provider.on("chainChanged", (chainId) => {
        console.log('chainChanged', chainId);
      });

      // Subscribe to provider connection
      provider.on("connect", (info) => {
        console.log('connect', info);
      });

      // // Subscribe to provider disconnection
      // provider.on("disconnect", (error: { code: number; message: string }) => {
      //   console.log(error);
      // });
      if(accounts[0]){
        this.setWalletDialog(true);
        this.$store.commit("uiStore/setWallet", accounts[0]);
        this.$store.commit("uiStore/setWalletNetwork", networkId);
        await this.$store.dispatch("uiStore/getBalances", {mode: 'gyb'});
        if(doRedirect && this.accessByBalance){
          this.$store.commit("uiStore/setWalletDialog", false);
          this.goTo('/gallery')
        }
      }

    },
  }
}
</script>
<style scoped lang="scss">
.token-list{
  display: flex;
  flex-direction: row;
  .token-list-item{
    width: 200px;
    // bordeR: 1px solid pink;
    text-align: center;
  }
}
.v-application{
  /* background: linear-gradient(267deg, #29e1d9, #29a5e1); */
}
</style>
