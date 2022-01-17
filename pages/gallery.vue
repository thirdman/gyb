<template>
  <v-row>
    <v-col class="text-center">
      <div>Gallery</div>
      <div>
        <label>
          Your Wallet Address
        </label>
        <v-text-field
        outlined
        filled
        :value="searchAddress"></v-text-field>
        <v-btn @click="handleSearch">sdfg</v-btn>
      </div>
    </v-col>
  </v-row>
</template>


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
      this.$router.push(`/address/${searchAddress}`)
    }
  }
}
</script>

