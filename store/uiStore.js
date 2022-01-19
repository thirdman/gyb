// import { getField, updateField } from "vuex-map-fields";
// import { v4 as uuidv4 } from "uuid";

export const state = () => ({
  devMode: true,
  network: "rinkeby",
  walletChain: "ethereum",
  walletAddress: null,
  walletStatus: "",
  walletProvider: null,
  walletNetwork: null,
  profileObject: null,
  ensName: "",
  devAddresses: [
    "0x03f0d81c9a73930b8034553fc54152cbd6958d0b", // gareth
    "0xd1c248d1c9879dc3b5a846d4dccc5b7aa8fbf432", // gareth
    "0x63a9dbCe75413036B2B778E670aaBd4493aAF9F3", //natealex
    "0xDbB59151b18Dd72E9AC092706e93De5b5d7a9325", // trislit
  ],
});

export const getters = {
  // getField,
  devMode: (state) => state.devMode,
  hasWallet: (state) => state.hasWallet,
  hasChainSelect: (state) => state.hasChainSelect,
  walletChain: (state) => state.walletChain,
  walletAddress: (state) => state.walletAddress,
  walletNetwork: (state) => state.walletNetwork,
  walletStatus: (state) => state.walletStatus,
  ensName: (state) => state.ensName,
};
export const mutations = {
  // updateField,
  setWalletChain(state, value) {
    state.walletChain = value;
  },
  setWallet(state, account) {
    console.log(account ? "setting account true" : "settings account false");
    state.hasWallet = account ? true : false;
    state.walletAddress = account ? account : null;
  },
};

export const actions = {
  async readMap(context, payload) {
    const { mapId, contractId } = payload;
  },
};
