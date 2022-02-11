<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
     
      <div class="text-center">
        <h1>Admin</h1>
      </div>
       <div class="text-center">
        <label>TOKEN OWNER CHECK</label>
        <!-- <p>Has Address: {{hasAddress ? "yes" : "no"}}</p> -->
        <p v-if="walletAddress">Connected Wallet: {{walletAddress}}</p>
        <v-divider />
      <div v-if="walletAddress">
        <v-btn :disabled="ownerStatus ? true :false " @click="() => checkOwner({tokenId: 12})">Check #12 (should be false)</v-btn>
        <v-btn :disabled="ownerStatus ? true :false " @click="() => checkOwner({tokenId: 3430})">Check #3430 (should be true)</v-btn>
        <div v-if="ownerStatus">{{ownerStatus}}</div>
        <div v-if="tokenOwner">Token Owner: {{tokenOwner}}</div>
        <div v-if="tokenOwner">User is Owner: {{userIsOwner ? "YES" : "NO"}}</div>
      </div>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from "vuex";
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
      tokenId: ""
    }
  },
  computed: {
    ...mapGetters({
      walletAddress: "uiStore/walletAddress",
      ownerStatus: "uiStore/ownerStatus",
      tokenOwner: "uiStore/tokenOwner",
      userIsOwner: "uiStore/userIsOwner",
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
      checkOwner: "uiStore/checkOwner"
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
