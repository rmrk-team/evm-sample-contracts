# MultiAsset

An *asset* is a type of output for an NFT, usually a media file.

A asset can be an image, a movie, a PDF file, device config file... A multi-asset NFT is one that can output a different asset
based on specific contextual information, e.g. load a PDF if loaded into a PDF reader, vs. loading an image in a virtual
gallery, vs. loading hardware configuration in an IoT control hub.

A asset is NOT an NFT or a standalone entity you can reference. It is part of an NFT - one of several outputs it can
have.

Every RMRK NFT has zero or more assets. When it has zero assets, the metadata is "root level". Any new asset
added to this NFT will override the root metadata, making this NFT
[revealable](https://docs.rmrk.app/usecases/revealable).

## Abstract

In this tutorial we will examine the MultiAsset RMRK block using two examples:

- [SimpleMultiAsset](./SimpleMultiAsset.sol) is a minimal implementation of the MultiAsset RMRK block.
- [AdvancedMultiAsset](./AdvancedMultiAsset.sol) is a more customizable implementation of the MultiAsset RMRK
block.

Let's first examine the simple, minimal, implementation and then move on to the advanced one.

## SimpleMultiAsset

The `SimpleMultiAsset` example uses the
[`RMRKMultiAssetImpl`](https://github.com/rmrk-team/evm/blob/dev/contracts/implementations/RMRKMultiAssetImpl.sol).
It is used by importing it using the `import` statement below the `pragma` definition:

````solidity
import "@rmrk-team/evm-contracts/contracts/implementations/RMRKMultiAssetImpl.sol";
````

Once the `RMRKMultiAssetImpl.sol` is imported into our file, we can set the inheritace of our smart contract:

````solidity
contract SimpleMultiAsset is RMRKMultiAssetImpl {
    
}
````

We won't be passing all of the required parameters, to intialize `RMRKMultiAssetImpl` contract, to the constructor,
but will hardcode some of the values. The values that we will pass are:

- `maxSupply`: uint256 type of argument denoting the maximum number of NFTs in the collection
- `pricePerMint`: uint256 type of argument representing the price per mint in wei or the lowest denomination of a native
currency of the EVM to which the smart contract is deployed to

The parameters that we will hardcode to the initialization of `RMRKMultiAssetImpl` are:

- `name`: `string` type of argument representing the name of te collection will be set to `SimpleMultiAsset`
- `symbol`: `string` type od argument representing the symbol of the collection will be set to `SMA`
- `collectionMetadata_`: `string` type of argument representing the metadata URI of the collection will be set to
`ipfs://meta`
- `tokenURI_`: `string` type of argument representing the base metadata URI of tokens will be set to `ipfs://tokenMeta`
- `royaltyRecipient`: `address` type of argument representing the recipient of the royalty fees will be assigned
`msg.sender` value
- `royaltyPercentageBps`: `uint256` type of argument representing the royalty percentage in basis points will be set to
`10`

**NOTE: Basis points are the smallest supported denomination of percent. In our case this is one hundreth of a percent.
This means that 1 basis point equals 0.01% and 10000 basis points equal 100%. So for example, if you want to set royalty
percentage to 5%, the `royaltyPercentageBps` value should be 500.**

So the constructor of the `SimpleMultiAsset` should look like this:

````solidity
    constructor(
        uint256 maxSupply,
        uint256 pricePerMint
    ) RMRKMultiAssetImpl(
        "SimpleMultiAsset",
        "SMA",
        maxSupply,
        pricePerMint,
        "ipfs://meta",
        "ipfs://tokenMeta",
        msg.sender,
        10
    ) {}
````

<details>
<summary>The <strong><i>SimpleMultiAsset.sol</i></strong> should look like this:</summary>

````solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

import "@rmrk-team/evm-contracts/contracts/implementations/RMRKMultiAssetImpl.sol";

contract SimpleMultiAsset is RMRKMultiAssetImpl {
    // NOTE: Additional custom arguments can be added to the constructor based on your needs.
    constructor(
        uint256 maxSupply,
        uint256 pricePerMint
    ) RMRKMultiAssetImpl(
        "SimpleMultiAsset",
        "SMA",
        maxSupply,
        pricePerMint,
        "ipfs://meta",
        "ipfs://tokenMeta",
        msg.sender,
        10
    ) {}
}
````

</details>

### RMRKMultiAssetImpl

Let's take a moment to examine the core of this implementation, the `RMRKMultiAssetImpl`.

It uses the `RMRKRoyalties`, `RMRKMultiAsset`, `RMRKCollectionMetadata` and `RMRKMintingUtils` smart contracts from
RMRK stack. To dive deeper into their operation, please refer to their respective documentation.

Two errors are defined:

````solidity
error RMRKMintUnderpriced();
error RMRKMintZero();
````

`RMRKMintUnderpriced()` is used when not enough value is used when attempting to mint a token and `RMRKMintZero()` is
used when attempting to mint 0 tokens.

The `RMRKMultiAssetImpl` implements all of the required functionality of the MultiAsset lego. It implements
standard NFT methods like `mint`, `transfer`, `approve`, `burn`,... In addition to these methods it also implements the
methods specific to MultiAsset RMRK lego:

- `addAssetToToken`
- `addAssetEntry`
- `totalAssets`
- `tokenURI`
- `updateRoyaltyRecipient`

**WARNING: The `RMRKMultiAssetImpl` only has minimal access control implemented. If you intend to use it, make sure
to define your own, otherwise your smart contracts are at risk of unexpected behaviour.**

#### `mint`

The `mint` function is used to mint parent NFTs and accepts two arguments:

- `to`: `address` type of argument that specifies who should receive the newly minted tokens
- `numToMint`: `uint256` type of argument that specifies how many tokens should be minted

There are a few constraints to this function:

- after minting, the total number of tokens should not exceed the maximum allowed supply
- attempting to mint 0 tokens is not allowed as it makes no sense to pay for the gas without any effect
- value should accompany transaction equal to a price per mint multiplied by the `numToMint`

#### `addAssetToToken`

The `addAssetToToken` is used to add a new asset to the token and accepts three arguments:

- `tokenId`: `uint256` type of argument specifying the ID of the token we are adding asset to
- `assetId`: `uint64` type of argument specifying the ID of the asset we are adding to the token
- `overwrites`: `uint64` type of argument specifying the ID of the asset we are owerwriting with the desired asset

#### `addAssetEntry`

The `addAssetEntry` is used to add a new URI for the new asset of the token and accepts one argument:

- `metadataURI`: `string` type of argument specifying the metadata URI of a new asset

#### `totalAssets`

The `totalAssets` is used to retrieve a total number of assets defined in the collection.

#### `tokenURI`

The `tokenURI` is used to retreive the metadata URI of the desired token and accepts one argument:

- `tokenId`: `uint256` type of argument representing the token ID of which we are retrieving the URI

#### `updateRoyaltyRecipient`

The `updateRoyaltyRecipient` function is used to update the royalty recipient and accepts one argument:

- `newRoyaltyRecipient`: `address` type of argument specifying the address of the new beneficiary recipient

### Deploy script

The deploy script for the `SimpleMultiAsset` smart contract resides in the
[`deployNestable.ts`](../../scripts/deployMultiAsset.ts).

The script uses the `ethers`, `SimpleMultiAsset` and `ContractTransaction` imports. The empty deploy script should look like
this:

````typescript
import { ethers } from "hardhat";
import { SimpleMultiAsset } from "../typechain-types";
import { ContractTransaction } from "ethers";

async function main() {

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
````

Before we can deploy the parent and child smart contracts, we should prepare the constants that we will use in the
script:

````typescript
  const pricePerMint = ethers.utils.parseEther("0.0001");
  const totalTokens = 5;
  const [owner] = await ethers.getSigners();
````



Now that the constants are ready, we can deploy the smart contract and log the address of the contract to the console:

````typescript
  const contractFactory = await ethers.getContractFactory(
    "SimpleMultiAsset"
  );
  const token: SimpleMultiAsset = await contractFactory.deploy(
    1000,
    pricePerMint
  );

  await token.deployed();
  console.log(`Sample contract deployed to ${token.address}`);
````

A custom script added to [`package.json`](../../package.json) allows us to easily run the script:

````json
  "scripts": {
    "deploy-multi-asset": "hardhat run scripts/deployMultiAsset.ts"
  }
````

Using the script with `npm run deploy-multi-asset` should return the following output:

````shell
npm run deploy-multi-asset

> @rmrk-team/evm-contract-samples@0.1.0 deploy-multi-asset
> hardhat run scripts/deployMultiAsset.ts

Compiled 47 Solidity files successfully
Sample contract deployed to 0x5FbDB2315678afecb367f032d93F642f64180aa3
````

### User journey

With the deploy script ready, we can examine how the journey of a user using multi asset would look like using this
smart contract.

The base of it is the same as the deploy script, as we need to deploy the smart contract in order to interact with it:

````typescript
import { ethers } from "hardhat";
import { SimpleMultiAsset } from "../typechain-types";
import { ContractTransaction } from "ethers";

async function main() {
  const pricePerMint = ethers.utils.parseEther("0.0001");
  const totalTokens = 5;
  const [owner] = await ethers.getSigners();

  const contractFactory = await ethers.getContractFactory(
    "SimpleMultiAsset"
  );
  const token: SimpleMultiAsset = await contractFactory.deploy(
    1000,
    pricePerMint
  );

  await token.deployed();
  console.log(`Sample contract deployed to ${token.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
````

First thing that needs to be done after the smart contract is deployed it to mint the NFT. We will use the `totalTokens`
constant to specify how many tokens to mint:

````typescript
  console.log("Minting tokens");
  let tx = await token.mint(owner.address, totalTokens, {
    value: pricePerMint.mul(totalTokens),
  });
  await tx.wait();
  console.log(`Minted ${totalTokens} tokens`);
  const totalSupply = await token.totalSupply();
  console.log("Total tokens: %s", totalSupply);
````

Now that the tokens are minted, we can add new assets to the smart contract. We will prepare a batch of transactions
that will add simple IPFS metadata link for the assets in the smart contract. Once the transactions are ready, we
will send them and get all of the assets to output to the console:

````typescript
  console.log("Adding assets");
  let allTx: ContractTransaction[] = [];
  for (let i = 1; i <= totalTokens; i++) {
    let tx = await token.addAssetEntry(`ipfs://metadata/${i}.json`);
    allTx.push(tx);
  }
  console.log(`Added ${totalTokens} assets`);

  console.log("Awaiting for all tx to finish...");
  await Promise.all(allTx.map((tx) => tx.wait()));
````

Once the assets are added to the smart contract we can assign each asset to one of the tokens:

````typescript
  console.log("Adding assets to tokens");
  allTx = [];
  for (let i = 1; i <= totalTokens; i++) {
    // We give each token a asset id with the same number. This is just a coincidence, not a restriction.
    let tx = await token.addAssetToToken(i, i, 0);
    allTx.push(tx);
    console.log(`Added asset ${i} to token ${i}.`);
  }
  console.log("Awaiting for all tx to finish...");
  await Promise.all(allTx.map((tx) => tx.wait()));
````

After the assets are added to the NFTs, we have to accept them. We will do this by once again building a batch of
transactions for each of the tokens and send them at the end:

````typescript
  console.log("Accepting token assets");
  allTx = [];
  for (let i = 1; i <= totalTokens; i++) {
    // Accept pending asset for each token (on index 0)
    let tx = await token.acceptAsset(i, 0, i);
    allTx.push(tx);
    console.log(`Accepted first pending asset for token ${i}.`);
  }
  console.log("Awaiting for all tx to finish...");
  await Promise.all(allTx.map((tx) => tx.wait()));
````

**NOTE: Accepting assets is done in a array that gets elements, new assets, appended to the end of it. Once the asset is accepted, the asset that was added lats, takes its place. For exaple:

We have assets `A`, `B`, `C` and `D` in the pending array organised like this: [`A`, `B`, `C`, `D`].

Accepting the asset `A` updates the array to look like this: [`D`, `B`, `C`].

Accepting the asset `B` updates the array to look like this: [`A`, `D`, `C`].**

Finally we can check wether the URI are assigned as expected and output the values to the console:

````typescript
  console.log("Getting URIs");
  const uriToken1 = await token.tokenURI(1);
  const uriFinalToken = await token.tokenURI(totalTokens);

  console.log("Token 1 URI: ", uriToken1);
  console.log("Token totalTokens URI: ", uriFinalToken);
````

With the user journey script concluded, we can add a custom helper to the [`package.json`](../../package.json) to make
running it easier:

````json
    "user-journey-multi-asset": "hardhat run scripts/multiAssetUserJourney.ts"
````

Running it using `npm run user-journey-multi-asset` should return the following output:

````shell
 npm run user-journey-multi-asset

> @rmrk-team/evm-contract-samples@0.1.0 user-journey-multi-asset
> hardhat run scripts/multiAssetUserJourney.ts

Sample contract deployed to 0x5FbDB2315678afecb367f032d93F642f64180aa3
Minting tokens
Minted 5 tokens
Total tokens: 5
Adding assets
Added 5 assets
Awaiting for all tx to finish...
All assets: [
  BigNumber { value: "1" },
  BigNumber { value: "2" },
  BigNumber { value: "3" },
  BigNumber { value: "4" },
  BigNumber { value: "5" }
]
Adding assets to tokens
Added asset 1 to token 1.
Added asset 2 to token 2.
Added asset 3 to token 3.
Added asset 4 to token 4.
Added asset 5 to token 5.
Awaiting for all tx to finish...
Accepting token assets
Accepted first pending asset for token 1.
Accepted first pending asset for token 2.
Accepted first pending asset for token 3.
Accepted first pending asset for token 4.
Accepted first pending asset for token 5.
Awaiting for all tx to finish...
Getting URIs
Token 1 URI:  ipfs://metadata/1.json
Token totalTokens URI:  ipfs://metadata/5.json
````

This conclues our work on the [`SimpleMultiAsset.sol`](./SimpleMultiAsset.sol). We can now move on to examining the [`AdvancedMultiAsset.sol`](./AdvancedMultiAsset.sol).

## AdvancedMultiAsset

The `AdvancedMultiAsset` smart contract allows for more flexibility when using the multi asset lego. It implements
minimum required implementation in order to be compatible with RMRK multi asset, but leaves more business logic
implementation freedom to the developer. It uses the
[`RMRKMultiAsset.sol`](https://github.com/rmrk-team/evm/blob/dev/contracts/RMRK/multiasset/RMRKMultiAsset.sol)
import to gain access to the Multi asset lego:

````solidity
import "@rmrk-team/evm-contracts/contracts/RMRK/multiasset/RMRKMultiAsset.sol";
````

We only need `name` and `symbol` of the NFT in order to properly initialize it after the `AdvancedMultiAsset`
inherits it:

````solidity
contract AdvancedMultiAsset is RMRKMultiAsset {
    // NOTE: Additional custom arguments can be added to the constructor based on your needs.
    constructor(
        string memory name,
        string memory symbol
    )
        RMRKMultiAsset(name, symbol)
    {
        // Custom optional: constructor logic
    }
}
````

This is all that is required to get you started with implementing the Multi asset RMRK lego.

<details>
<summary>The minimal <strong><i>AdvancedMultiAsset.sol</i></strong> should look like this:</summary>

````solidity
// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.16;

import "@rmrk-team/evm-contracts/contracts/RMRK/multiasset/RMRKMultiAsset.sol";

contract AdvancedMultiAsset is RMRKMultiAsset {
    // NOTE: Additional custom arguments can be added to the constructor based on your needs.
    constructor(
        string memory name,
        string memory symbol
    )
        RMRKMultiAsset(name, symbol)
    {
        // Custom optional: constructor logic
    }
}
````

</details>

Using `RMRKMultiAsset` requires custom implementation of minting logic. Available internal functions to use when
writing it are:

- `_mint(address to, uint256 tokenId)`
- `_safeMint(address to, uint256 tokenId)`
- `_safeMint(address to, uint256 tokenId, bytes memory data)`

In addition to the minting functions, you should also implement the burning, transfer and asset management functions if they apply to your use case:

- `_burn(uint256 tokenId)`
- `_addAssetEntry(uint64 id, string memory metadataURI)`
- `_addAssetToToken(uint256 tokenId, uint64 assetId, uint64 overwrites)`
- `transferFrom(address from, address to, uint256 tokenId)`

Any additional functions supporting your NFT use case and utility can also be added. Remember to thoroughly test your
smart contracts with extensive test suites and define strict access control rules for the functions that you implement.

Happy multiresourcing! 🫧