<template>
  <v-row>
    <v-col class="text-center">
      <div>
        <label>
          Wallet Address
        </label>
        <v-text-field
        outlined
        filled
        v-model="searchAddress"
        
        ></v-text-field>
        <v-btn @click="handleSearch">Find</v-btn>
      </div>
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

export default {
  data() {
    return {
      searchAddress: "0xb56d3a16afd1619aa9dbd99918c3ab70f1d41042"
    }
  },
  methods: {
    handleSearch(){
      console.log(searchAddress)
      
      const {searchAddress} = this;
      console.log('searchAddress', searchAddress)
      this.$router.push(`/address/${searchAddress}`)
    }
  }
}
</script>

