# Nestable with MultiAsset

[Nestable](../Nestable/README.md) and [MultiAsset](../MultiAsset/README.md) RMRK legos can be used together to
provide more utility to the NFT. To examine each separately, please refer to their respective examples.

## Abstract

In this tutorial we will examine the joined operation of the Nestable and MultiAsset RMRK blocks using two examples:

- [SimpleNestableMultiAsset](./SimpleNestableMultiAsset.sol) is a minimal implementation of the Nestable and
MultiAsset RMRK blocks operating together.
- [AdvancedNestableMultiAsset](./AdvancedNestableMultiAsset.sol) is a more customizable implementation of the
Nestable and MultiAsset RMRK blocks operating together.

## SimpleNestableMultiAsset

The `SimpleNestableMultiasset` example uses the
[`RMRKNestableMultiAssetImpl`](https://github.com/rmrk-team/evm/blob/dev/contracts/implementations/nativeTokenPay/RMRKNestableMultiAssetImpl.sol).
It is used by using the `import` statement below the `pragma` definition:

````solidity
import "@rmrk-team/evm-contracts/contracts/implementations/nativeTokenPay/RMRKNestableMultiAssetImpl.sol";
````

Once the `RMRKNestableMultiAsset.sol` is imported into our file, we can set the inheritance of our smart contract:

````solidity
contract SimpleNestableMultiAsset is RMRKNestableMultiAssetImpl {
    
}
````

The `RMRKNestableMultiAssetImpl` implements all of the required functionality of the Nested and MultiAsset RMRK
legos. It implements minting of parent NFTS as well as child NFTs. Management of NFT assets is also implemented
alongside the classic NFT functionality.

**WARNING: The `RMRKNestableMultiAssetImpl` only has minimal access control implemented. If you intend to use it, make
sure to define your own, otherwise your smart contracts are at risk of unexpected behaviour.**

The `constructor` in this case accepts no arguments as most of the arguments required to properly initialize
`RMRKNestableMultiAssetImpl` are hardcoded:

- `RMRKNestableMultiAssetImpl`: represents the `name` argument and sets the name of the collection
- `SNMA`: represents the `symbol` argument and sets the symbol of the collection
- `ipfs://meta`: represents the `collectionMetadata_` argument and sets the URI of the collection metadata
- `ipfs://tokenMeta`: represents the `tokenURI_` argument and sets the base URI of the token metadata

The only available variable to pass to the `constructor` is:

- `data`: struct type of argument providing a number of initialization values, used to avoid initialization transaction
  being reverted due to passing too many parameters

**NOTE: The `InitData` struct is used to pass the initialization parameters to the implementation smart contract. This
is done so that the execution of the deploy transaction doesn't revert because we are trying to pass too many
arguments.**

**The `InitData` struct contains the following fields:**

````solidity
[
    erc20TokenAddress,
    tokenUriIsEnumerable,
    royaltyRecipient,
    royaltyPercentageBps, // Expressed in basis points
    maxSupply,
    pricePerMint
]
````

**NOTE: Basis points are the smallest supported denomination of percent. In our case this is one hundreth of a percent.
This means that 1 basis point equals 0.01% and 10000 basis points equal 100%. So for example, if you want to set royalty
percentage to 5%, the `royaltyPercentageBps` value should be 500.**

With the arguments passed upon initialization defined, we can add our constructor:

````solidity
    constructor(InitData memory data)
        RMRKNestableMultiAssetImpl(
            "SimpleNestableMultiAsset",
            "SNMA",
            "ipfs://meta",
            "ipfs://tokenMeta",
            data
        )
    {}
````

<details>
<summary>The <strong><i>SimpleNestableMultiAsset.sol</i></strong> should look like this:</summary>

````solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

import "@rmrk-team/evm-contracts/contracts/implementations/nativeTokenPay/RMRKNestableMultiAssetImpl.sol";

contract SimpleNestableMultiAsset is RMRKNestableMultiAssetImpl {
    // NOTE: Additional custom arguments can be added to the constructor based on your needs.
    constructor(InitData memory data)
        RMRKNestableMultiAssetImpl(
            "SimpleNestableMultiAsset",
            "SNMA",
            "ipfs://meta",
            "ipfs://tokenMeta",
            data
        )
    {}
}
````

</details>

### RMRKNestableMultiAssetImpl

Let's take a moment to examine the core of this implementation, the `RMRKNestableMultiAssetImpl`.

It uses `RMRKRoyalties`, `RMRKNestableMultiAsset`, `RMRKCollectionMetadata` and `RMRKMintingUtils` smart contracts
from `RMRK` stack. To dive deeper into their operation, please refer to their respective documentation.

Two errors are defined:

````solidity
error RMRKMintUnderpriced();
error RMRKMintZero();
````

`RMRKMintUnderpriced()` is used when not enough value is used when attempting to mint a token and `RMRKMintZero()` is
used when attempting to mint 0 tokens.

#### `mint`

The `mint` function is used to mint parent NFTs and accepts two arguments:

- `to`: `address` type of argument that specifies who should receive the newly minted tokens
- `numToMint`: `uint256` type of argument that specifies how many tokens should be minted

There are a few constraints to this function:

- after minting, the total number of tokens should not exceed the maximum allowed supply
- attempting to mint 0 tokens is not allowed as it makes no sense to pay for the gas without any effect
- value should accompany transaction equal to a price per mint multiplied by the `numToMint`

#### `nestMint`

The `nestMint` function is used to mint child NFTs to be owned by the parent NFT and accepts three arguments:

- `to`: `address` type of argument specifying the address of the smart contract to which the parent NFT belongs to
- `numToMint`: `uint256` type of argument specifying the amount of tokens to be minted
- `destinationId`: `uint256` type of argument specifying the ID of the parent NFT to which to mint the child NFT

The constraints of `nestMint` are similar to the ones set out for `mint` function.

#### `addAssetToToken`

The `addAssetToToken` is used to add a new asset to the token and accepts three arguments:

- `tokenId`: `uint256` type of argument specifying the ID of the token we are adding asset to
- `assetId`: `uint64` type of argument specifying the ID of the asset we are adding to the token
- `overwrites`: `uint64` type of argument specifying the ID of the asset we are overwriting with the desired asset

#### `addAssetEntry`

The `addAssetEntry` function is used to add a new URI for the new asset of the token and accepts one argument:

- `metadataURI`: `string` type of argument specifying the metadata URI of a new asset

#### `totalAssets`

The `totalAssets` function is used to retrieve a total number of assets defined in the collection.

#### `transfer`

The `transfer` function is used to transfer one token from one account to another and accepts two arguments:

- `to`: `address` type of argument specifying the address of the account to which the token should be transferred to
- `tokenId`: `uint256` type of argument specifying the token ID of the token to be transferred

#### `nestTransfer`

The `nestTransfer` is used to transfer the NFT to another NFT residing in a specified contract. It can only be called by
a direct owner or a parent NFT's smart contract or a caller that was given the allowance. This will nest the given NFT
into the specified one. It accepts three arguments:

- `to`: `address` type of argument specifying the address of the intended parent NFT's smart contract
- `tokenId`: `uint256` type of argument specifying the ID of the token we want to send to be nested
- `destinationId`: `uint256` type of argument specifying the ID of the intended parent token NFT

#### `tokenURI`

The `tokenURI` is used to retrieve the metadata URI of the desired token and accepts one argument:

- `tokenId`: `uint256` type of argument representing the token ID of which we are retrieving the URI

#### `updateRoyaltyRecipient`

The `updateRoyaltyRecipient` function is used to update the royalty recipient and accepts one argument:

- `newRoyaltyRecipient`: `address` type of argument specifying the address of the new beneficiary recipient

### Deploy script

The deploy script for the `SimpleNestableMultiAsset` smart contract resides in the
[`deployNestableMultiAsset.ts`](../../scripts/deployNestableMultiAsset.ts).

The script uses the `ethers`, `SimpleNestable` and `ContractTransaction` imports. The empty deploy script should look like
this:

````typescript
import { ethers } from "hardhat";
import { SimpleNestable } from "../typechain-types";
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
  const pricePerMint = ethers.utils.parseEther("0.0000000001");
  const totalTokens = 5;
  const [owner] = await ethers.getSigners();
````

Now that the constants are ready, we can deploy the smart contract and log the addresses of the contracts to the
console:

````typescript
  const contractFactory = await ethers.getContractFactory(
    "SimpleNestableMultiAsset"
  );
  const token: SimpleNestableMultiAsset = await contractFactory.deploy(
    {
      erc20TokenAddress: ethers.constants.AddressZero,
      tokenUriIsEnumerable: true,
      royaltyRecipient: await owner.getAddress(),
      royaltyPercentageBps: 10,
      maxSupply: 1000,
      pricePerMint: pricePerMint
    }
  );

  await token.deployed();
  console.log(`Sample contract deployed to ${token.address}`);
````

A custom script added to [`package.json`](../../package.json) allows us to easily run the script:

````json
  "scripts": {
    "deploy-nestable-multi-asset": "hardhat run scripts/deployNestableMultiAsset.ts"
  }
````

Using the script with `npm run deploy-nestable-multi-asset` should return the following output:

````shell
npm run deploy-nestable-multi-asset

> @rmrk-team/evm-contract-samples@0.1.0 deploy-nestable-multi-asset
> hardhat run scripts/deployNestableMultiAsset.ts

Sample contract deployed to 0x5FbDB2315678afecb367f032d93F642f64180aa3
````

### User journey

With the deploy script ready, we can examine how the journey of a user using nestable with multi asset would look like
using this smart contract.

The catalog of it is the same as the deploy script, as we need to deploy the smart contract in order to interact with it:

````typescript
import { ethers } from "hardhat";
import { SimpleNestableMultiAsset } from "../typechain-types";
import { ContractTransaction } from "ethers";

async function main() {
  const pricePerMint = ethers.utils.parseEther("0.0000000001");
  const totalTokens = 5;
  const [ owner, tokenOwner] = await ethers.getSigners();

  const contractFactory = await ethers.getContractFactory(
    "SimpleNestableMultiAsset"
  );
  const token: SimpleNestableMultiAsset = await contractFactory.deploy(
    {
      erc20TokenAddress: ethers.constants.AddressZero,
      tokenUriIsEnumerable: true,
      royaltyRecipient: await owner.getAddress(),
      royaltyPercentageBps: 10,
      maxSupply: 1000,
      pricePerMint: pricePerMint
    }
  );

  await token.deployed();
  console.log(`Sample contract deployed to ${token.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
````

**NOTE: We assign the `tokenOwner` the second available signer, so that the assets are not automatically accepted when
added to the token. This happens when an account adding an asset to a token is also the owner of said token.**

First thing that needs to be done after the smart contracts are deployed is to mint the NFTs. We will use the
`totalTokens` constant in order to specify how many of the tokens to mint:

````typescript
  console.log("Minting NFTs");
  let tx = await token.mint(tokenOwner.address, totalTokens, {
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
transactions for each of the tokens and send them out one by one at the end:

````typescript
  console.log("Accepting assets to tokens");
  allTx = [];
  for (let i = 1; i <= totalTokens; i++) {
    // Accept pending asset for each token (on index 0)
    let tx = await token.connect(tokenOwner).acceptAsset(i, 0, i);
    allTx.push(tx);
    console.log(`Accepted first pending asset for token ${i}.`);
  }
  console.log("Awaiting for all tx to finish...");
  await Promise.all(allTx.map((tx) => tx.wait()));
````

**NOTE: Accepting assets is done in a array that gets elements, new assets, appended to the end of it. Once the asset is
accepted, the asset that was added lats, takes its place. For example:**

**We have assets `A`, `B`, `C` and `D` in the pending array organised like this: [`A`, `B`, `C`, `D`].**

**Accepting the asset `A` updates the array to look like this: [`D`, `B`, `C`].**

**Accepting the asset `B` updates the array to look like this: [`A`, `D`, `C`].**

Having accepted the assets, we can check that the URIs are assigned as expected:

````typescript
  console.log("Getting URIs");
  const uriToken1 = await token.tokenURI(1);
  const uriToken5 = await token.tokenURI(totalTokens);

  console.log("Token 1 URI: ", uriToken1);
  console.log("Token totalTokens URI: ", uriToken5);
````

With the assets properly assigned to the tokens, we can now nest the token with ID 5 into the token with ID 1 and
check their ownership to verify successful nesting:

````typescript
  console.log("Nesting token with ID 5 into token with ID 1");
  await token.connect(tokenOwner).nestTransferFrom(tokenOwner.address, token.address, 5, 1, "0x");
  const parentId = await token.ownerOf(5);
  const rmrkParent = await token.directOwnerOf(5);
  console.log("Token's id 5 owner  is ", parentId);
  console.log("Token's id 5 rmrk owner is ", rmrkParent);
````

We can now add a custom helper to the [`package.json`](../../package.json) to make running it easier:

````json
    "user-journey-nestable-multi-asset": "hardhat run scripts/nestableMultiAssetUserJourney.ts"
````

Running it using `npm run user-journey-nestable-multi-asset` should return the following output:

````shell
npm run user-journey-nestable-multi-asset

> @rmrk-team/evm-contract-samples@0.1.0 user-journey-nestable-multi-asset
> hardhat run scripts/nestableMultiAssetUserJourney.ts

Sample contract deployed to 0x5FbDB2315678afecb367f032d93F642f64180aa3
Minting NFTs
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
Accepting assets to tokens
Accepted first pending asset for token 1.
Accepted first pending asset for token 2.
Accepted first pending asset for token 3.
Accepted first pending asset for token 4.
Accepted first pending asset for token 5.
Awaiting for all tx to finish...
Getting URIs
Token 1 URI:  ipfs://metadata/1.json
Token totalTokens URI:  ipfs://metadata/5.json
Nesting token with ID 5 into token with ID 1
Token's id 5 owner  is  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Token's id 5 rmrk owner is  [
  '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  BigNumber { value: "1" },
  true
]
````

This concludes our work on the [`SimpleNestableMultiAsset.sol`](./SimpleNestableMultiAsset.sol). We can now move on
to examining the [`AdvancedNestableMultiAsset`](./AdvancedNestableMultiAsset.sol).

## AdvancedNestableMultiAsset

The `AdvancedNestableMultiAsset` smart contract allows for more flexibility when using the nestable and multi asset
legos together. It implements the minimum required implementation in order to be compatible with RMRK nestable and multi
asset, but leaves more business logic implementation freedom to the developer. It uses the
[`RMRKNestableMultiAsset.sol`](https://github.com/rmrk-team/evm/blob/dev/contracts/RMRK/nestable/RMRKNestableMultiAsset.sol)
import to gain access to the joined Nestable and Multi asset legos:

````solidity
import "@rmrk-team/evm-contracts/contracts/RMRK/nestable/RMRKNestableMultiAsset.sol";
````

We only need `name` and `symbol` of the NFT in order to properly initialize it after the `AdvancedNestableMultiAsset`
inherits it:

````solidity
contract AdvancedNestableMultiAsset is RMRKNestableMultiAsset {
    // NOTE: Additional custom arguments can be added to the constructor based on your needs.
    constructor(
        string memory name,
        string memory symbol
    )
        RMRKNestableMultiAsset(name, symbol)
    {
        // Custom optional: constructor logic
    }
}
````

This is all that is required to get you started with implementing the joined Nestable and Multi asset RMRK legos.

<details>
<summary>The minimal <strong><i>AdvancedNestableMultiAsset.sol</i></strong> should look like this:</summary>

````solidity
// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.16;

import "@rmrk-team/evm-contracts/contracts/RMRK/nestable/RMRKNestableMultiAsset.sol";

contract AdvancedNestableMultiAsset is RMRKNestableMultiAsset {
    // NOTE: Additional custom arguments can be added to the constructor based on your needs.
    constructor(
        string memory name,
        string memory symbol
    )
        RMRKNestableMultiAsset(name, symbol)
    {
        // Custom optional: constructor logic
    }
}
````

</details>

Using `RMRKNestableMultiAsset` requires custom implementation of minting logic. Available internal functions to use when writing it are:

- `_mint(address to, uint256 tokenId)`
- `_safeMint(address to, uint256 tokenId)`
- `_safeMint(address to, uint256 tokenId, bytes memory data)`
- `_nestMint(address to, uint256 tokenId, uint256 destinationId)`

The latter is used to nest mint the NFT directly to the parent NFT. If you intend to support it at the minting stage,
you should implement it in your smart contract.

In addition to the minting functions, you should also implement the burning, transfer and asset management functions if they apply to your use case:

- `_burn(uint256 tokenId)`
- `transferFrom(address from, address to, uint256 tokenId)`
- `nestTransfer(address from, address to, uint256 tokenId, uint256 destinationId)`
- `_addAssetEntry(uint64 id, string memory metadataURI)`
- `_addAssetToToken(uint256 tokenId, uint64 assetId, uint64 overwrites)`

Any additional function supporting your NFT use case and utility can also be added. Remember to thoroughly test your
smart contracts with extensive test suites and define strict access control rules for the functions that you implement.

Happy multiassetful nesting! 🐣🫧🐣