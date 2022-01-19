<template>
  <v-app >
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="clipped"
      absolute
      flat
      app
      hide-on-scroll
      
      color="#111"
      border="bottom"
    >
      <!-- <v-app-bar-nav-icon @click.stop="drawer = !drawer" /> -->
      <!-- <v-btn
        icon
        @click.stop="miniVariant = !miniVariant"
      >
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn> -->
      <!-- <v-btn
        icon
        @click.stop="clipped = !clipped"
      >
        <v-icon>mdi-application</v-icon>
      </v-btn> -->
      <!-- <v-btn
        icon
        @click.stop="fixed = !fixed"
      >
        <v-icon>mdi-minus</v-icon>
      </v-btn> -->
      <v-toolbar-title v-text="title" />
      <v-spacer />

      <v-btn
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
      </v-btn>
      <v-btn
        text
        @click="goTo('/about')"
      >
        About
      </v-btn>
      <v-spacer />
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
      <div>THanks to Queen Cryptoria</div>
      <v-spacer />
      <div>Donate: thethirdman.eth</div>
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
        { hid: 'og:image', property: 'og:image', content: 'https://www.pandaearth.online/preview.png' }
      ]
    }
  },
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Inspire',
          to: '/inspire'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Panda Earth',
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
    }),
  },
  methods: {
    goTo(path){
      console.log('path', path);
      this.$router.push(path)
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
        this.$store.commit("uiStore/setWallet", accounts[0]);
      }

    },
  }
}
</script>
<style scoped>
.v-application{
  background: linear-gradient(267deg, #29e1d9, #29a5e1);
}
</style>
