# Nesting with MultiResource

[Nesting](../Nesting/README.md) and [MultiResource](../MultiResource/README.md) RMRK legos can be used together to
provide more utility to the NFT. To examine each separately, please refer to their respective examples.

## Abstract

In this tutorial we will examine the joined operation of the Nesting and MultiResource RMRK blocks using two examples:

- [SimpleNestingMultiResource](./SimpleNestingMultiResource.sol) is a minimal implementation of the Nesting and
MultiResource RMRK blocks operating together.
- [AdvancedNestingMultiResource](./AdvancedNestingMultiResource.sol) is a more customizable implementation of the
Nesting and MultiResource RMRK blocks operating together.

## SimpleNestingMultiResource

The `SimpleNestingMultiresource` example uses the
[`RMRKNestingMultiResourceImpl`](https://github.com/rmrk-team/evm/blob/dev/contracts/implementations/RMRKNestingMultiResourceImpl.sol).
It is used by using the `import` statement below the `pragma` definition:

````solidity
import "@rmrk-team/evm-contracts/contracts/implementations/RMRKNestingMultiResourceImpl.sol";
````

Once the `RMRKNestingMultiResource.sol` is imported into our file, we can set the inheritance of our smart contract:

````solidity
contract SimpleNestingMultiResource is RMRKNestingMultiResourceImpl {
    
}
````

The `RMRKNestingMultiResourceImpl` implements all of the required functionality of the Nested and MultiResource RMRK
legos. It implements minting of parent NFTS as well as child NFTs. Management of NFT resources is also implemented
alongside the classic NFT functionality.

**WARNING: The `RMRKNestingMultiResourceImpl` only has minimal access control implemented. If you intend to use it, make
sure to define your own, otherwise your smart contracts are at risk of unexpected behaviour.**

The `constructor` in this case accepts no arguments as all of the arguments required to properly initialize
`RMRKNestingMultiResourceImpl` are hardcoded:

- `RMRKNestingMultiResourceImpl`: represents the `name` argument and sets the name of the collection
- `SNMR`: represents the `symbol` argument and sets the symbol of the collection
- `1000`: represents the `maxSupply_` argument and sets the maximum amount of tokens in the collection
- `100_000_000`: represents the `pricePerMint_` argument and sets the price of minting one token in wei or the lowest
denomination of the native currency of the EVM to which the smart contract is deployed to
- `ipfs://meta`: represents the `collectionMetadata_` argument and sets the base URI of the collection metadata

With the arguments passed upon initialization defined, we can add our constructor:

````solidity
    constructor()
        RMRKNestingMultiResourceImpl("SimpleNestingMultiResource", "SNMR", 1000, 100_000_000, "ipfs://meta")
    {}
````

<details>
<summary>The <strong><i>SimpleNestingMultiResource.sol</i></strong> should look like this:</summary>

````solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

import "@rmrk-team/evm-contracts/contracts/implementations/RMRKNestingMultiResourceImpl.sol";

contract SimpleNestingMultiResource is RMRKNestingMultiResourceImpl {
    constructor()
        RMRKNestingMultiResourceImpl("SimpleNestingMultiResource", "SNMR", 1000, 100_000_000, "ipfs://meta")
    {}
}
````

</details>

### RMRKNestingMultiResourceImpl

Let's take a moment to examine the core of this implementation, the `RMRKNestingMultiResourceImpl`.

It uses `RMRKMintingUtils`, `RMRKCollectionMetadata` and `RMRKMultiResource` smart contracts from `RMRK` stack as well
as OpenZeppelin's `Strings` utility. To dive deeper into their operation, please refer to their respective
documentation.

Two errors are defined:

````solidity
error RMRKMintUnderpriced();
error RMRKMintZero();
````

`RMRKMintUnderpriced()` is used when not enough value is used when attempting to mint a token and `RMRKMintZero` is used
when attempting to mint 0 tokens.

#### `mint`

The `mint` function is used to mint parent NFTs and accepts two arguments:

- `to`: `address` type of argument that specifies who should receive the newly minted tokens
- `numToMint`: `uint256` type of argument that specifies how many tokens should be minted

There are a few constraints to this function:

- after minting, the total number of tokens should not exceed the maximum allowed supply
- attempthing to mint 0 tokens is not allowed as it makes no sense to pay for the gas without any effect
- value should accompany transaction equal to a price per mint multiplied by the `numToMint`

#### `getFallbackURI`

The `getFallbackURI` is used to retrieve the fallback URI of the collection.

#### `setFallbackURI`

The `setFallbackURI` is used to set the fallback URI of the collection and accepts one argument:

- `fallbackURI`: `string` type of argument specifying the URI to be used as the fallback URI of the collection

#### `isTokenEnumeratedResource`

The `isTokenEnumeratedResource` is used to check wether the resource ID passed to it represents an enumerated resource:

- `resourceId`: `uint64` type of argument representing the ID of the resource we are validating

#### `setTokenEnumeratedResource`

The `setTokenEnumeratedResource` is used to set a token enumerated resource ID to the passed boolean value and accepts
two arguments:

- `resourceId`: `uint64` type of argument representing the ID of the resource we are setting
- `state`: `bool` type of argument representing the validity of the resource

#### `addResourceToToken`

The `addResourceToToken` is used to add a new resource to the token and accepts three arguments:

- `tokenId`: `uint256` type of argument specifying the ID of the token we are adding resource to
- `resourceId`: `uint64` type of argument specifying the ID of the resource we are adding to the token
- `overwrites`: `uint64` type of argument specifying the ID of the resource we are owerwriting with the desired resource

#### `addResourceEntry`

The `addResourceEntry` is used to add a new URI for the new resource of the token and accepts one argument:

- `metadataURI`: `string` type of argument specifying the metadata URI of a new resource

#### `totalResources`

The `totalResources` is used to retrieve a total number of resources defined in the collection.

### Deploy script

The deploy script for the `SimpleNestingMultiResource` smart contract resides in the
[`deployNestingMultiResource.ts`](../../scripts/deployNestingMultiResource.ts).

The script uses the `ethers`, `SimpleNesting` and `ContractTransactio` imports. The empty deploy script should look like
this:

````typescript
import { ethers } from "hardhat";
import { SimpleNesting } from "../typechain-types";
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
    "SimpleNestingMultiResource"
  );
  const token: SimpleNestingMultiResource = await contractFactory.deploy();

  await token.deployed();
  console.log(`Sample contract deployed to ${token.address}`);
````

A custom script added to [`package.json`](../../package.json) allows us to easily run the script:

````json
  "scripts": {
    "deploy-nesting-multi-resource": "hardhat run scripts/deployNestingMultiResource.ts"
  }
````

Using the script with `npm run deploy-nesting-multi-resource` should return the following output:

````shell
npm run deploy-nesting-multi-resource

> @rmrk-team/evm-contract-samples@0.1.0 deploy-nesting-multi-resource
> hardhat run scripts/deployNestingMultiResource.ts

Sample contract deployed to 0x5FbDB2315678afecb367f032d93F642f64180aa3
````

### User journey

With the deploy script ready, we can examine how the journey of a user using nesting with multi resource would look like
using this smart contract.

The base of it is the same as the deploy script, as we need to deploy the smart contract in order to interact with it:

````typescript
import { ethers } from "hardhat";
import { SimpleNestingMultiResource } from "../typechain-types";
import { ContractTransaction } from "ethers";

async function main() {
  const pricePerMint = ethers.utils.parseEther("0.0000000001");
  const totalTokens = 5;
  const [owner] = await ethers.getSigners();

  const contractFactory = await ethers.getContractFactory(
    "SimpleNestingMultiResource"
  );
  const token: SimpleNestingMultiResource = await contractFactory.deploy();

  await token.deployed();
  console.log(`Sample contract deployed to ${token.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
````

First thing that needs to be done after the smart contracts are deployed is to mint the NFTs. We will use the
`totalTokens` constant in order to specify how many of the tokens to mint:

````typescript
  console.log("Minting NFTs");
  let tx = await token.mint(owner.address, totalTokens, {
    value: pricePerMint.mul(totalTokens),
  });
  await tx.wait();
  console.log(`Minted ${totalTokens} tokens`);
  const totalSupply = await token.totalSupply();
  console.log("Total tokens: %s", totalSupply);
````

Now that the tokens are minted, we can add new resources to the smart contract. We will prepare a batch of transactions
that will add simple IPFS metadata link for the resources in the smart contract. Once the transactions are ready, we
will send them and get all of the resources to output to the console:

````typescript
  console.log("Adding resources");
  let allTx: ContractTransaction[] = [];
  for (let i = 1; i <= totalTokens; i++) {
    let tx = await token.addResourceEntry(`ipfs://metadata/${i}.json`);
    allTx.push(tx);
  }
  console.log(`Added ${totalTokens} resources`);

  console.log("Awaiting for all tx to finish...");
  await Promise.all(allTx.map((tx) => tx.wait()));

  const resourceIds = await token.getAllResources();
  console.log("All resources: %s", resourceIds);
````

Getting resources using `getAllResources` returns the array of the resource IDs.

Once the resources are added to the smart contract we can assign each resource to one of the tokens:

````typescript
  console.log("Adding resources to tokens");
  allTx = [];
  for (let i = 1; i <= totalTokens; i++) {
    // We give each token a resource id with the same number. This is just a coincidence, not a restriction.
    let tx = await token.addResourceToToken(i, i, 0);
    allTx.push(tx);
    console.log(`Added resource ${i} to token ${i}.`);
  }
  console.log("Awaiting for all tx to finish...");
  await Promise.all(allTx.map((tx) => tx.wait()));
````

After the resources are added to the NFTs, we have to accept them. We will do this by once again building a batch of
transactions for each of the tokens and send them at the end:

````typescript
  console.log("Accepting resources to tokens");
  allTx = [];
  for (let i = 1; i <= totalTokens; i++) {
    // Accept pending resource for each token (on index 0)
    let tx = await token.acceptResource(i, 0);
    allTx.push(tx);
    console.log(`Accepted first pending resource for token ${i}.`);
  }
  console.log("Awaiting for all tx to finish...");
  await Promise.all(allTx.map((tx) => tx.wait()));
````

**NOTE: Accepting resources for tokens is done in a FIFO like stack. So if you have 3 pending resources and accept the
first one using index 0, the remaining indices get updated and the last resource can now be found at index 1.**

Having accepted the resources, we can check that the URIs are assigned as expected:

````typescript
  console.log("Getting URIs");
  const uriToken1 = await token.tokenURI(1);
  const uriToken5 = await token.tokenURI(totalTokens);

  console.log("Token 1 URI: ", uriToken1);
  console.log("Token totalTokens URI: ", uriToken5);
````

With the resources properly assigned to the tokens, we can now nest the token with ID 5 into the token with ID 1 and
check their ownershipt to verify successful nesting:

````typescript
  console.log("Nesting token with ID 5 into token with ID 1");
  await token.nestTransfer(token.address, 5, 1);
  const parentId = await token.ownerOf(5);
  const rmrkParent = await token.rmrkOwnerOf(5);
  console.log("Token's id 5 owner  is ", parentId);
  console.log("Token's id 5 rmrk owner is ", rmrkParent);
````

We can now add a custom helper to the [`package.json`](../../package.json) to make running it easier:

````json
    "user-journey-nesting-multi-resource": "hardhat run scripts/nestingMultiResourceUserJourney.ts"
````

Running it using `npm run user-journey-nesting-multi-resource` should return the following output:

````shell
npm run user-journey-nesting-multi-resource

> @rmrk-team/evm-contract-samples@0.1.0 user-journey-nesting-multi-resource
> hardhat run scripts/nestingMultiResourceUserJourney.ts

Sample contract deployed to 0x5FbDB2315678afecb367f032d93F642f64180aa3
Minting NFTs
Minted 5 tokens
Total tokens: 5
Adding resources
Added 5 resources
Awaiting for all tx to finish...
All resources: [
  BigNumber { value: "1" },
  BigNumber { value: "2" },
  BigNumber { value: "3" },
  BigNumber { value: "4" },
  BigNumber { value: "5" }
]
Adding resources to tokens
Added resource 1 to token 1.
Added resource 2 to token 2.
Added resource 3 to token 3.
Added resource 4 to token 4.
Added resource 5 to token 5.
Awaiting for all tx to finish...
Accepting resources to tokens
Accepted first pending resource for token 1.
Accepted first pending resource for token 2.
Accepted first pending resource for token 3.
Accepted first pending resource for token 4.
Accepted first pending resource for token 5.
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

This concludes our work on the [`SimpleNestingMultiResource.sol`](./SimpleNestingMultiResource.sol). We can now move on
to examining the [`AdvancedNestingMultiResource`](./AdvancedNestingMultiResource.sol).