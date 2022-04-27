// import { getField, updateField } from "vuex-map-fields";
// import { v4 as uuidv4 } from "uuid";
import Web3 from "web3";
import {
  PANDA_ABI,
  CONTRACT_ABI,
  PANDA_CONTRACT_ADDRESS,
  CONTRACT_ADDRESS,
} from "./constants.js";

export const state = () => ({
  devMode: true,
  hasWalletDialog: null,
  hasBalanceDialog: null,
  ActiveContract: null,
  targetNetwork: "rinkeby",
  walletChain: "ethereum",
  walletAddress: null,
  walletStatus: "",
  walletProvider: null,
  walletNetwork: null,
  profileObject: null,
  ensName: "",
  ownerStatus: null,
  ownerAddress: null,
  tokenOwner: null,
  tokenBalances: null,
  balanceStatus: null,
  userIsOwner: null,
  devAddresses: [
    "0x03f0d81c9a73930b8034553fc54152cbd6958d0b", // gareth
    "0xd1c248d1c9879dc3b5a846d4dccc5b7aa8fbf432", // gareth
    "0x63a9dbCe75413036B2B778E670aaBd4493aAF9F3", //natealex
    "0xDbB59151b18Dd72E9AC092706e93De5b5d7a9325", // trislit
  ],
  validTokenArray: [
    "0xed9583b4a8e2baef0dbd7c274ad40c68abd765bc", // Trislit nft 2
    // "0x663e4229142a27f00bafb5d087e1e730648314c3", // gareth
  ],
  validTokenIdArray: [
    "3430", // gareth
  ],
});

export const getters = {
  // getField,
  devMode: (state) => state.devMode,
  hasWallet: (state) => state.hasWallet,
  hasWalletDialog: (state) => state.hasWalletDialog,
  hasBalanceDialog: (state) => state.hasBalanceDialog,
  hasChainSelect: (state) => state.hasChainSelect,
  targetNetwork: (state) => state.targetNetwork,
  walletChain: (state) => state.walletChain,
  walletAddress: (state) => state.walletAddress,
  walletNetwork: (state) => state.walletNetwork,
  walletStatus: (state) => state.walletStatus,
  ensName: (state) => state.ensName,
  ownerStatus: (state) => state.ownerStatus,
  ownerAddress: (state) => state.ownerAddress,
  tokenOwner: (state) => state.tokenOwner,
  userIsOwner: (state) => state.userIsOwner,
  tokenBalances: (state) => state.tokenBalances,
  balanceStatus: (state) => state.balanceStatus,
  accessByBalance: (state) => {
    const { tokenBalances } = state;
    if (!tokenBalances) {
      return;
    }
    console.group("tokenBalances");
    console.log("tokenBalances", tokenBalances);
    // NOTE: this is a hard coded way of checking. Future versions will automate this.
    const bal1 = tokenBalances["1"] && tokenBalances["1"] > 0;
    const bal2 = tokenBalances["2"] && tokenBalances["2"] > 0;
    const bal3 = tokenBalances["3"] && tokenBalances["3"] > 0;
    const bal4 = tokenBalances["4"] && tokenBalances["4"] > 0;
    console.log({ bal1, bal2, bal3, bal4 });
    // console.log("bal1", bal1);
    // console.log("bal2", bal2);
    // console.log("bal3", bal3);
    // console.log("bal4", bal4);
    const allow = bal1 && bal2 && bal3 && bal4;
    console.log("ALLOW?", allow);
    console.groupEnd();
    return allow;
  },
};
export const mutations = {
  // updateField,
  setWalletDialog(state, value) {
    state.hasWalletDialog = value;
  },
  setBalanceDialog(state, value) {
    state.hasBalanceDialog = value;
  },

  setWallet(state, account) {
    console.log(account ? "setting account true" : "settings account false");
    state.hasWallet = account ? true : false;
    state.walletAddress = account ? account : null;
  },
  setWalletNetwork(state, value) {
    state.walletNetwork = value;
  },
  setContract(state, value) {
    state.ActiveContract = value;
  },
  setOwnerStatus(state, value) {
    state.ownerStatus = value;
  },
  setTokenOwner(state, value) {
    console.log("setTokenOwner setting to ", value);
    state.tokenOwner = value;
  },
  setUserIsOwner(state, value) {
    state.userIsOwner = value;
  },
  setBalanceStatus(state, value) {
    state.balanceStatus = value;
  },
  setTokenBalances(state, object) {
    const currentBalances = state.tokenBalances || {};
    const newBalances = { ...currentBalances, ...object };
    state.tokenBalances = newBalances;
  },
};

export const actions = {
  async readMap(context, payload) {
    const { mapId, contractId } = payload;
  },
  async isOwner(context, payload) {
    const { tokenOwner } = payload;
    const { state } = context;
    const { walletAddress } = state;
    console.log("isowner", tokenOwner, walletAddress);
    if (tokenOwner === walletAddress) {
      context.commit("setUserIsOwner", true);
    } else {
      context.commit("setUserIsOwner", false);
    }
  },
  async checkOwner(context, payload) {
    const { commit, dispatch } = context;
    const { tokenId, mode = "panda" } = payload;
    const ABI = mode === "panda" ? PANDA_ABI : CONTRACT_ABI;
    const CONTRACT =
      mode === "panda" ? PANDA_CONTRACT_ADDRESS : CONTRACT_ADDRESS;
    const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
    console.log("mode", { mode, ABI, CONTRACT });
    var ActiveContract = new web3.eth.Contract(ABI, CONTRACT);
    console.log("checkOwner", tokenId);
    if (!ActiveContract) {
      console.error("no ActiveContract");
      return;
    }
    if (!tokenId) {
      return;
    }
    commit("setTokenOwner", "");
    commit("setOwnerStatus", "working");
    const tokenOwner = await ActiveContract.methods
      .ownerOf(tokenId)
      .call()
      .then((result) => {
        console.log("done", result);
        commit("setOwnerStatus", null);
        return result;
      });
    if (tokenOwner) {
      console.log("token owner: ", tokenOwner);
      commit("setTokenOwner", tokenOwner);
      dispatch("isOwner", { tokenOwner });
    }
  },
  async getBalance(context, payload) {
    const { commit, dispatch, state } = context;
    const { walletAddress } = state;
    const { tokenId, mode } = payload;
    const ABI = mode === "panda" ? PANDA_ABI : CONTRACT_ABI;
    const CONTRACT =
      mode === "panda" ? PANDA_CONTRACT_ADDRESS : CONTRACT_ADDRESS;
    console.log("mode", { mode, ABI, CONTRACT });
    const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
    var ActiveContract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);
    console.log("walletAddress", walletAddress);
    if (!ActiveContract) {
      console.error("no ActiveContract");
      return;
    }

    const walletBalance = await ActiveContract.methods
      .balanceOf(walletAddress)
      .call()
      .then((result) => {
        console.log("done", result);
        // commit("setOwnerStatus", null);
        return result;
      });
    console.log("walletBalance", walletBalance);
    // if (tokenOwner) {
    //   console.log("token owner: ", tokenOwner);
    //   commit("setTokenOwner", tokenOwner);
    //   dispatch("isOwner", { tokenOwner });
    // }
  },

  async getBalances(context, payload) {
    context.commit("setBalanceStatus", "working");
    let [balance1, balance2, balance3, balance4, balance5] = await Promise.all([
      // this.getChildBalance(),
      context.dispatch("getChildBalance", { mode: "gyb", tokenId: 1 }),
      context.dispatch("getChildBalance", { mode: "gyb", tokenId: 2 }),
      context.dispatch("getChildBalance", { mode: "gyb", tokenId: 3 }),
      context.dispatch("getChildBalance", { mode: "gyb", tokenId: 4 }),
      context.dispatch("getChildBalance", { mode: "gyb", tokenId: 5 }),
    ]);
    console.log("balances", balance1, balance2, balance3, balance4, balance5);
    context.commit("setBalanceStatus", null);
  },

  async getChildBalance(context, payload) {
    const { commit, dispatch, state } = context;
    const { walletAddress } = state;
    const { tokenId, mode } = payload;
    const ABI = CONTRACT_ABI;
    // const CONTRACT = CONTRACT_ADDRESS;
    // console.log("mode", { mode, ABI, CONTRACT });
    const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
    var ActiveContract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);
    if (!ActiveContract) {
      console.error("no ActiveContract");
      return;
    }

    // console.log("ActiveContract.methods", ActiveContract.methods);
    // const owner = await ActiveContract.methods
    //   .owner()
    //   .call()
    //   .then((result) => {
    //     console.log("done", result);
    //     // commit("setOwnerStatus", null);
    //     return result;
    //   })
    //   .catch((error) => {
    //     console.log("error: ", error);
    //   });
    const walletBalance = await ActiveContract.methods
      .balanceOf(walletAddress, tokenId)
      .call()
      .then((result) => {
        console.log("balance query done: ", result);
        // commit("setOwnerStatus", null);
        return result;
      })
      .catch((error) => {
        console.log("error: ", error);
      });
    console.log("walletBalance", walletBalance);
    if (walletBalance > -1) {
      const newObj = { [tokenId]: walletBalance };
      console.log("newObj", newObj);
      commit("setTokenBalances", newObj);
      return newObj;
    }
    return walletBalance;
    // if (tokenOwner) {
    //   console.log("token owner: ", tokenOwner);
    //   commit("setTokenOwner", tokenOwner);
    //   dispatch("isOwner", { tokenOwner });
    // }
  },
  async startApp(context, payload) {
    const { commit } = context;
    const { validTokenIdArray } = this;

    const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
    console.log("web3", web3);
    var MyContract = new web3.eth.Contract(PANDA_ABI, PANDA_CONTRACT_ADDRESS);

    // console.log("MyContract", MyContract.methods);
    // await commit("setContract", MyContract);

    // MyContract.methods
    //   .ownerOf(23)
    //   .call()
    //   .then((result) => {
    //     console.log("done", result);
    //   });

    // if (
    //   typeof adjAniContractLoadedCallback !== "undefined" &&
    //   adjAni.adjAniState.web3UsingInfura
    // ) {
    //   adjAniContractLoadedCallback();
    // }

    // adjAni.clearTransactions();

    // var accountInterval = setInterval(function () {
    //   web3.eth.getAccounts(function (err, accounts) {
    //     // if (window.useInfura) {
    //     //   return;
    //     // }

    //     const { walletAddress } = this;
    //     console.log("walletAddress: ", walletAddress, typeof walletAddress);
    //     console.log("conencted wallet: ", accounts[0]);
    //     if (accounts[0] !== walletAddress) {
    //       // adjAni.adjAniState.account = accounts[0];
    //       console.log("changing accounts", accounts[0]);

    //       commit("setWallet", accounts[0]);
    //       web3.eth.defaultAccount = accounts[0];
    //       // adjAni.adjAniContract.defaultAccount = accounts[0];
    //       // if (adjAni.adjAniState.account === undefined) {
    //       //   adjAni.adjAniState.accountUnlocked = false;
    //       // } else {
    //       //   adjAni.adjAniState.accountUnlocked = true;
    //       // }

    //       // if (typeof adjAniContractLoadedCallback !== "undefined") {
    //       //   adjAniContractLoadedCallback();
    //       // }
    //     }
    //     // adjAni.adjAniState.accountQueried = true;
    //   });
    // }, 1000);
  },
};
