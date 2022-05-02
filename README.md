# login with NFT

This is a Nuxt/Vue based app deployed on Vercel, that allows viewing of private contnet if the user's wallet wons required nft

NOTE:

## Modes

### 1. 'ALL' balance mode

- Uses NFT that can have multiple editions. (Eg. Rarible #12345 can have 20 owners). Users must own one of ALL the defined
  id's

### 2. 'ANY' balance mode (TBD)

- Uses a single NFT contract. This mode allows access by owning a minimul amount of NFT created by a contract. (eg. minimum 5 CryptoKitty NFT)

### 3. 'SINGLE' balance mode (TBD)

- Uses a single NFT id. This mode allows access by each single wallet that owns a unique NFT. (eg. CryptoKitty #12345). THis method would equate to giving access to a single waller.

## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
