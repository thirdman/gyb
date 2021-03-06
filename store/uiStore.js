// import { getField, updateField } from "vuex-map-fields";
// import { v4 as uuidv4 } from "uuid";
import Web3 from "web3";
import {
  CONTRACT_ABI,
  CONTRACT_ADDRESS,
  MAIN_CONTRACT_ADDRESS,
  MAIN_CONTRACT_ABI,
} from "./constants.js";
import { CONFIG } from "../accesswithnft.config.js";

export const state = () => ({
  isLive: CONFIG.isLive,
  config: CONFIG,
  devMode: true,
  hasWalletDialog: null,
  hasBalanceDialog: null,
  ActiveContract: null,
  targetNetwork: CONFIG.targetNetwork,
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
  tokenIdArray:
    CONFIG.targetNetwork === "rinkeby" ? CONFIG.nft.rinkeby : CONFIG.nft.main,
});

export const getters = {
  // getField,
  devMode: (state) => state.devMode,
  config: (state) => state.config,
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
  tokenIdArray: (state) => state.tokenIdArray,
  ownerStatus: (state) => state.ownerStatus,
  ownerAddress: (state) => state.ownerAddress,
  tokenOwner: (state) => state.tokenOwner,
  userIsOwner: (state) => state.userIsOwner,
  tokenBalances: (state) => state.tokenBalances,
  balanceStatus: (state) => state.balanceStatus,
  activeContractAddress: (state) => {
    const network = state.config.targetNetwork;
    const address =
      network === "main"
        ? state.config.contract.main
        : state.config.contract.rinkeby;
    return address;
  },
  activeContractABI: (state) => {
    const network = state.config.targetNetwork;
    const abi = network === "main" ? MAIN_CONTRACT_ABI : CONTRACT_ABI;
    return abi;
  },
  accessByBalance: (state) => {
    const { tokenBalances } = state;
    const tokenIdArray =
      CONFIG.targetNetwork === "rinkeby" ? CONFIG.nft.rinkeby : CONFIG.nft.main;
    if (!tokenBalances) {
      return;
    }
    console.group("tokenBalances");
    console.log("tokenBalances", tokenBalances);
    // let balances;
    // tokenIdArray.map((id) => {
    //   console.log(`map id ${id} pushing to balances`);
    //   // balances[id] ? : balances[id].push("test");
    //   // balances[id] =
    //   //   tokenBalances[id.toString()] && tokenBalances[id.toString()] > 0;
    // });
    // console.log("balancesArray", tokenIdArray);
    // NOTE: this is a hard coded way of checking. Future versions will automate this.
    // const bal1 = tokenBalances["1"] && tokenBalances["1"] > 0;
    // const bal2 = tokenBalances["2"] && tokenBalances["2"] > 0;
    // const bal3 = tokenBalances["3"] && tokenBalances["3"] > 0;
    // const bal4 = tokenBalances["4"] && tokenBalances["4"] > 0;
    // console.log({ bal1, bal2, bal3, bal4 });
    // console.log("bal1", bal1);
    // console.log("bal2", bal2);
    // console.log("bal3", bal3);
    // console.log("bal4", bal4);
    // const accessGranted = balances.every((value) => value === true);
    // const accessGranted = false;

    const minCount = CONFIG.minCount;
    let accessArray = Object.values(tokenBalances).map((value) => {
      const hasValue = value && value >= minCount;
      return hasValue;
    });

    const accessGranted =
      accessArray.length > 0 &&
      tokenIdArray.length === accessArray.length &&
      accessArray.every((value) => value === true);
    console.log("accessGranted", accessGranted, accessArray);
    console.groupEnd();
    return accessGranted;
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
  setTargetNetwork(state, value) {
    const tempConfig = { ...state.config, targetNetwork: value };
    console.log("setTargetNetwork", tempConfig);
    state.config = tempConfig;
  },
  setMode(state, value) {
    console.log("setMode");
    const tempConfig = { ...state.config, mode: value };
    state.config = tempConfig;
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
  setTokenBalances(state, object, reset = false) {
    if (reset) {
      console.log("reset token balances");
      state.tokenBalances = null;
    } else {
      const currentBalances = state.tokenBalances || {};
      const newBalances = { ...currentBalances, ...object };
      state.tokenBalances = newBalances;
    }
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
    const ABI = CONTRACT_ABI;
    const CONTRACT = CONTRACT_ADDRESS;
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
    const ABI = CONTRACT_ABI;
    const CONTRACT = CONTRACT_ADDRESS;
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
    const tokenIdArray =
      CONFIG.targetNetwork === "rinkeby" ? CONFIG.nft.rinkeby : CONFIG.nft.main;
    if (!tokenIdArray || tokenIdArray.length < 1) {
      return;
    }
    let [balance1, balance2, balance3, balance4, balance5] = await Promise.all([
      tokenIdArray.map((id) => {
        context.dispatch("getChildBalance", { mode: "gyb", tokenId: id });
      }),
      // context.dispatch("getChildBalance", { mode: "gyb", tokenId: 1 }),
      // context.dispatch("getChildBalance", { mode: "gyb", tokenId: 2 }),
      // context.dispatch("getChildBalance", { mode: "gyb", tokenId: 3 }),
      // context.dispatch("getChildBalance", { mode: "gyb", tokenId: 4 }),
      // context.dispatch("getChildBalance", { mode: "gyb", tokenId: 5 }),
    ]);

    console.log("balances", balance1, balance2, balance3, balance4, balance5);
    context.commit("setBalanceStatus", null);
  },

  async getChildBalance(context, payload) {
    console.log("context", context);
    const { commit, dispatch, getters, state } = context;
    const { walletAddress } = state;
    const { tokenId, mode } = payload;
    const { activeContractABI, activeContractAddress } = getters;
    const ABI = activeContractABI;
    const ADDRESS = activeContractAddress;
    // const CONTRACT = CONTRACT_ADDRESS;
    // console.log("mode", { mode, ABI, CONTRACT });
    const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
    var ActiveContract = new web3.eth.Contract(ABI, ADDRESS);
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

  // NFT URI
  async getNftData(context, payload) {
    const { state, getters } = context;
    // const { walletAddress } = state;
    const { mode = "uri", id = "1", contract } = payload;

    const { activeContractABI, activeContractAddress } = getters;
    const ABI = activeContractABI;
    const ADDRESS = activeContractAddress;

    const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
    var ActiveContract = new web3.eth.Contract(ABI, ADDRESS);
    if (!ActiveContract) {
      console.error("no ActiveContract");
      return;
    }
    console.log("getNftData", { ActiveContract });
    const nftUri = await ActiveContract.methods
      .uri(id)
      .call()
      .then((result) => {
        console.log("uri", result);
        // commit("setOwnerStatus", null);
        return result;
      });

    if (mode === "uri") {
      return nftUri;
    }
    if (mode === "object") {
      const ipfsPrefix = "ipfs://ipfs/";
      const ipfsProxyString = "https://ipfs.io/ipfs/";
      const cleanUrl = (url) => {
        const ipfsId = url.substring(12, url.length);
        return ipfsProxyString + ipfsId;
      };

      const uriTarget =
        nftUri.substring(0, 12) === ipfsPrefix ? cleanUrl(nftUri) : nftUri;

      console.log(
        "uriTarget",
        uriTarget,
        nftUri,
        nftUri.substring(0, 12),
        ipfsPrefix,
        cleanUrl(nftUri)
      );
      const { data, headers } = await this.$axios.get(uriTarget);
      console.log("object result = ", data, headers);
      console.log("typeof data", typeof data);
      if (typeof data !== "object") {
        return null;
      }
      if (data) {
        return data;
      } else {
        console.error("error getting uri", headers);
        return;
      }
    }
    if (mode === "src") {
      const { data, headers } = await this.$axios.get(nftUri);
      console.log("object result = ", data, headers);
      if (data) {
        return data.image;
      } else {
        console.error("error getting uri", error);
        return;
      }
    }
    // console.log("walletBalance", walletBalance);
    // const walletBalance = await ActiveContract.methods
    //   .balanceOf(walletAddress)
    //   .call()
    //   .then((result) => {
    //     console.log("done", result);
    //     // commit("setOwnerStatus", null);
    //     return result;
    //   });
    // console.log("walletBalance", walletBalance);
  },

  // LEGACY INIT FUNCTION
  async startApp(context, payload) {
    // const { commit } = context;
    // const { validTokenIdArray } = this;
    // const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
    // var MyContract = new web3.eth.Contract(PANDA_ABI, PANDA_CONTRACT_ADDRESS);
  },
};
