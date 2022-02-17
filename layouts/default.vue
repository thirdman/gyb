<template>
  <v-app >
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

      <!-- <v-btn
        text
        @click="goTo('/')"
      >
        Home
      </v-btn>
      <v-btn
        text
        @click="goTo('/gallery')"
      >
        Gallery
      </v-btn> -->
      <!-- <v-btn
        text
        @click="goTo('/admin')"
      >
        Admin
      </v-btn> -->
      <v-spacer />
      <v-card v-if="walletNetwork && targetNetwork === walletNetwork" color="success" class="pa-1 mr-2">
        {{walletNetwork}}
      </v-card>
      <v-card v-if="walletNetwork && targetNetwork !== walletNetwork" color="error" class="pa-1 mr-2">
        Please change to <strong>{{targetNetwork}}</strong> network
      </v-card>
      <div v-if="walletAddress">
        Connected
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
  
  import { mapMutations, mapGetters } from "vuex";
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
      title: 'NFTLOGIN',
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
    }),
  },
  methods: {
    goTo(path){
      console.log('path', path);
      this.$router.push(path)
    },
    async handleConnect(){
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
      if(accounts[0]){
        this.$store.commit("uiStore/setWallet", accounts[0]);
        this.$store.commit("uiStore/setWalletNetwork", networkId);
        this.$store.dispatch("uiStore/getBalances", {mode: 'gyb'});
        
      }

    },
  }
}
</script>
<style scoped>
.v-application{
  /* background: linear-gradient(267deg, #29e1d9, #29a5e1); */
}
</style>
