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
      searchAddress: "0x263b604509d6a825719859ee458b2d91fb7d330d"
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

