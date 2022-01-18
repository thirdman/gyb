<template>
  <v-row>
    <v-col class="text-center" >
      <v-card outlined class="mt-1 my-auto" max-width="450px"  style="background: rgb(25 153 206 / 68%); margin-left: auto; margin-right: auto;">
      <v-card-title>Wallet Address</v-card-title>
        <v-card-text>
        
        <v-text-field
        outlined
        filled
        v-model="searchAddress"
        
        
        ></v-text-field>
        <v-btn @click="handleSearch">Find</v-btn>
        </v-card-text>
      </v-card>
      <v-card elevation="0" class="mt-8" max-width="450px"  style="background: rgb(25 153 206 / 68%);  margin-left: auto; margin-right: auto;">
      <v-card-title>Find a panda</v-card-title>
        
        <v-card-text>
          <v-text-field
        outlined
        filled
        v-model="tokenId"
        placeholder="eg. 1234"
        ></v-text-field>
        <v-btn @click="handleSearchToken">Find</v-btn>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style >
label{
  font-size: .875em;
  text-transform: uppercase;
  font-weight: bold;
}
</style>

<script>
import ogImage from '@/assets/images/preview.png';
export default {
  head () {
    return {
      meta: [
        { hid: 'og:image', property: 'og:image', content: this.BASE_URL+ ogImage }
      ]
    }
  },
  data() {
    return {
      searchAddress: "0xb56d3a16afd1619aa9dbd99918c3ab70f1d41042",
      tokenId: ""
    }
  },
  methods: {
    handleSearch(){
      const {searchAddress = ''} = this;
      console.log('searchAddress', searchAddress)
      this.$router.push(`/address/${searchAddress}`)
    },
    handleSearchToken(){
      console.log('about to find token')
      const {tokenId, searchAddress = ''} = this;
      if(!tokenId){
        alert('Missing token Id')
        return
      }
      
      this.$router.push(`/address/all?id=${tokenId}`)
    }
  }
}
</script>

