exports.CONFIG = {
  isLive: true,
  title: "dametime",
  targetNetwork: "rinkeby",
  mode: "balance",
  minCount: 1,
  adminAddresses: [
    "0x29831f9c95c7Be7b7DE65be1cEee038390d8Dde8", // gareth brave
    // "0x03f0d81c9a73930b8034553fc54152cbd6958d0b", // gareth chrome
    "0xd1c248d1c9879dc3b5a846d4dccc5b7aa8fbf432", // gareth metamask
    "0xDbB59151b18Dd72E9AC092706e93De5b5d7a9325", // trislit
  ],
  contract: {
    rinkeby: "0xed9583b4a8e2baef0dbd7c274ad40c68abd765bc",
    main: "0x",
  },
  nft: {
    rinkeby: [1, 2, 3, 4],
    main: [23, 45],
  },
  messages: {
    ready:
      "To obtain access connect an ethereum wallet that owns the Access NFT.",
    success: "Access Granted",
    partial: "Wallet does not contain all required NFT",
    failure: "Access Denied. Wallet does not contain required NFT",
  },
  urls: {
    rinkeby: {
      target:
        "https://testnets.opensea.io/collection/unidentified-contract-vheq2nb5wa",
      info: "https://pixsoulinc.com/clients/DT/",
      etherscan:
        "https://rinkeby.etherscan.io/address/0xed9583b4a8e2baef0dbd7c274ad40c68abd765bc",
      opensea:
        "https://testnets.opensea.io/collection/unidentified-contract-vheq2nb5wa",
    },
    main: {
      target:
        "https://testnets.opensea.io/collection/unidentified-contract-vheq2nb5wa",
      info: "https://pixsoulinc.com/clients/DT/",
      etherscan: "",
      opensea: "",
    },
  },
  colors: {
    background: "#292479",
  },
};
