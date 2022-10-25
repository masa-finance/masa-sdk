@masa-finance/masa-sdk / [Exports](modules.md)

# Masa SDK

## Installation

Yarn  
`yarn add @masa-finance/masa-sdk --save`

NPM  
`npm i @masa-finance/masa-sdk --save`

### Usage

Browser:

```typescript
import { Masa } from "@masa-finance/masa-sdk";
import { ethers } from "ethers";

// with metamask
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

export const masa = new Masa({ wallet: signer });
```

Node:

```typescript
import { Masa } from "@masa-finance/masa-sdk";
import { ethers } from "ethers";

const provider = new ethers.providers.JsonRpcProvider(
  "your blockchain rpc endpoint"
);

const wallet = new ethers.Wallet("your private key", provider);

export const masa = new Masa({ wallet });

```

### Interface

For a detailed interface description see [Masa](./docs/modules.md)

### Config

```typescript
new Masa({
  // wallet object is always mandatory
  wallet,
  // api endpoint to the masa infrastructure
  apiUrl: "https://middleware.masa.finance",
  // masa environment dev, test, beta, prod
  environment: "prod",
  // network name to use goerli, mainnet
  network: "goerli",
  // arweave endpoint to use
  arweave: {
    host: "arweave.net",
    port: 443,
    protocol: "https",
    logging: false,
  },
});
```
