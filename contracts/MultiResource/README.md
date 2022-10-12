# MultiResource

A *resource* is a type of output for an NFT, usually a media file.

A resource can be an image, a movie, a PDF file,... A multi-resource NFT is one that can output a different resource
based on specific contextual information, e.g. load a PDF if loaded into a PDF reader, vs. loading an image in a virtual
gallery.

A resource is NOT an NFT or a standalone entity you can reference. It is part of an NFT - one of several outputs it can
have.

Every RMRK NFT has zero or more resources. When it has zero resources, the metadata is "root level". Any new resource
added to this NFT will override the root metadata, making this NFT
[revealable](https://docs.rmrk.app/usecases/revealable).

## Abstract

In this tutorial we will examine the MultiResource RMRK block using two examples:

- [SimpleMultiResource](./SimpleMultiResource.sol) is a minimal implementation of the MultiResource RMRK block.
- [AdvancedMultiResource](./AdvancedMultiResource.sol) is a more customizable implementation of the MultiResource RMRK
block.

Let's first examine the simple, minimal, implementation and then move on to the advanced one.

## SimpleMultiResource

The `SimpleMultiResource` example uses the
[`RMRKMultiResourceImpl`](https://github.com/rmrk-team/evm/blob/dev/contracts/implementations/RMRKMultiResourceImpl.sol).
It is used by importing it using the `import` statement below the `pragma` definition:

````solidity
import "@rmrk-team/evm-contracts/contracts/implementations/RMRKMultiResourceImpl.sol";
````

Once the `RMRKMultiResourceImpl.sol` is imported into our file, we can set the inheritace of our smart contract:

````solidity
contract SimpleMultiResource is RMRKMultiResourceImpl {
    
}
````

We won't be passing all of the required parameters, to intialize `RMRKMultiResourceImpl` contract, to the constructor,
but will hardcode some of the values. The values that we will pass are:

- `maxSupply`: uint256 type of argument denoting the maximum number of NFTs in the collection
- `pricePerMint`: uint256 type of argument representing the price per mint in wei or the lowest denomination of a native
currency of the EVM to which the smart contract is deployed to

The parameters that we will hardcode to the initialization of `RMRKMultiResourceImpl` are:

- `name`: `string` type of argument representing the name of te collection will be set to `SimpleMultiResource`
- `symbol`: `string` type od argument representing the symbol of the collection will be set to `SMR`
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

So the constructor of the `SimpleMultiResource` should look like this:

````solidity
    constructor(
        uint256 maxSupply,
        uint256 pricePerMint
    ) RMRKMultiResourceImpl(
        "SimpleMultiResource",
        "SMR",
        maxSupply,
        pricePerMint,
        "ipfs://meta",
        "ipfs://tokenMeta",
        msg.sender,
        10
    ) {}
````

<details>
<summary>The <strong><i>SimpleMultiResource.sol</i></strong> should look like this:</summary>

````solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

import "@rmrk-team/evm-contracts/contracts/implementations/RMRKMultiResourceImpl.sol";

contract SimpleMultiResource is RMRKMultiResourceImpl {
    constructor(
        uint256 maxSupply,
        uint256 pricePerMint
    ) RMRKMultiResourceImpl(
        "SimpleMultiResource",
        "SMR",
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

### RMRKMultiResourceImpl

Let's take a moment to examine the core of this implementation, the `RMRKMultiResourceImpl`.

It uses the `RMRKRoyalties`, `RMRKMultiResource`, `RMRKCollectionMetadata` and `RMRKMintingUtils` smart contracts from
RMRK stack. To dive deeper into their operation, please refer to their respective documentation.

Two errors are defined:

````solidity
error RMRKMintUnderpriced();
error RMRKMintZero();
````

`RMRKMintUnderpriced()` is used when not enough value is used when attempting to mint a token and `RMRKMintZero()` is
used when attempting to mint 0 tokens.

The `RMRKMultiResourceImpl` implements all of the required functionality of the MultiResource lego. It implements
standard NFT methods like `mint`, `transfer`, `approve`, `burn`,... In addition to these methods it also implements the
methods specific to MultiResource RMRK lego:

- `addResourceToToken`
- `addResourceEntry`
- `totalResources`
- `tokenURI`
- `updateRoyaltyRecipient`

**WARNING: The `RMRKMultiResourceImpl` only has minimal access control implemented. If you intend to use it, make sure
to define your own, otherwise your smart contracts are at risk of unexpected behaviour.**

#### `mint`

The `mint` function is used to mint parent NFTs and accepts two arguments:

- `to`: `address` type of argument that specifies who should receive the newly minted tokens
- `numToMint`: `uint256` type of argument that specifies how many tokens should be minted

There are a few constraints to this function:

- after minting, the total number of tokens should not exceed the maximum allowed supply
- attempting to mint 0 tokens is not allowed as it makes no sense to pay for the gas without any effect
- value should accompany transaction equal to a price per mint multiplied by the `numToMint`

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

#### `tokenURI`

The `tokenURI` is used to retreive the metadata URI of the desired token and accepts one argument:

- `tokenId`: `uint256` type of argument representing the token ID of which we are retrieving the URI

#### `updateRoyaltyRecipient`

The `updateRoyaltyRecipient` function is used to update the royalty recipient and accepts one argument:

- `newRoyaltyRecipient`: `address` type of argument specifying the address of the new beneficiary recipient

### Deploy script

The deploy script for the `SimpleMultiResource` smart contract resides in the
[`deployNesting.ts`](../../scripts/deployMultiResource.ts).

The script uses the `ethers`, `SimpleMultiResource` and `ContractTransaction` imports. The empty deploy script should look like
this:

````typescript
import { ethers } from "hardhat";
import { SimpleMultiResource } from "../typechain-types";
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
    "SimpleMultiResource"
  );
  const token: SimpleMultiResource = await contractFactory.deploy(
    1000,
    pricePerMint
  );

  await token.deployed();
  console.log(`Sample contract deployed to ${token.address}`);
````

A custom script added to [`package.json`](../../package.json) allows us to easily run the script:

````json
  "scripts": {
    "deploy-multi-resource": "hardhat run scripts/deployMultiResource.ts"
  }
````

Using the script with `npm run deploy-multi-resource` should return the following output:

````shell
npm run deploy-multi-resource

> @rmrk-team/evm-contract-samples@0.1.0 deploy-multi-resource
> hardhat run scripts/deployMultiResource.ts

Compiled 47 Solidity files successfully
Sample contract deployed to 0x5FbDB2315678afecb367f032d93F642f64180aa3
````

### User journey

With the deploy script ready, we can examine how the journey of a user using multi resource would look like using this
smart contract.

The base of it is the same as the deploy script, as we need to deploy the smart contract in order to interact with it:

````typescript
import { ethers } from "hardhat";
import { SimpleMultiResource } from "../typechain-types";
import { ContractTransaction } from "ethers";

async function main() {
  const pricePerMint = ethers.utils.parseEther("0.0001");
  const totalTokens = 5;
  const [owner] = await ethers.getSigners();

  const contractFactory = await ethers.getContractFactory(
    "SimpleMultiResource"
  );
  const token: SimpleMultiResource = await contractFactory.deploy(
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
  console.log("Accepting token resources");
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

**NOTE: Accepting resources is done in a array that gets elements, new resources, appended to the end of it. Once the resource is accepted, the resource that was added lats, takes its place. For exaple:

We have resources `A`, `B`, `C` and `D` in the pending array organised like this: [`A`, `B`, `C`, `D`].

Accepting the resource `A` updates the array to look like this: [`D`, `B`, `C`].

Accepting the resource `B` updates the array to look like this: [`A`, `D`, `C`].**

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
    "user-journey-multi-resource": "hardhat run scripts/multiResourceUserJourney.ts"
````

Running it using `npm run user-journey-multi-resource` should return the following output:

````shell
 npm run user-journey-multi-resource

> @rmrk-team/evm-contract-samples@0.1.0 user-journey-multi-resource
> hardhat run scripts/multiResourceUserJourney.ts

Sample contract deployed to 0x5FbDB2315678afecb367f032d93F642f64180aa3
Minting tokens
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
Accepting token resources
Accepted first pending resource for token 1.
Accepted first pending resource for token 2.
Accepted first pending resource for token 3.
Accepted first pending resource for token 4.
Accepted first pending resource for token 5.
Awaiting for all tx to finish...
Getting URIs
Token 1 URI:  ipfs://metadata/1.json
Token totalTokens URI:  ipfs://metadata/5.json
````

This conclues our work on the [`SimpleMultiResource.sol`](./SimpleMultiResource.sol). We can now move on to examining the [`AdvancedMultiResource.sol`](./AdvancedMultiResource.sol).

## AdvancedMultiResource

The `AdvancedMultiResource` smart contract allows for more flexibility when using the multi resource lego. It implements
minimum required implementation in order to be compatible with RMRK multi resource, but leaves more business logic
implementation freedom to the developer. It uses the
[`RMRKMultiResource.sol`](https://github.com/rmrk-team/evm/blob/dev/contracts/RMRK/multiresource/RMRKMultiResource.sol)
import to gain access to the Multi resource lego:

````solidity
import "@rmrk-team/evm-contracts/contracts/RMRK/multiresource/RMRKMultiResource.sol";
````

We only need `name` and `symbol` of the NFT in order to properly initialize it after the `AdvancedMultiResource`
inherits it:

````solidity
contract AdvancedMultiResource is RMRKMultiResource {
    constructor(
        string memory name,
        string memory symbol
        // Custom optional: additional parameters
    )
        RMRKMultiResource(name, symbol)
    {
        // Custom optional: constructor logic
    }
}
````

This is all that is required to get you started with implementing the Multi resource RMRK lego.

<details>
<summary>The minimal <strong><i>AdvancedMultiResource.sol</i></strong> should look like this:</summary>

````solidity
// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.16;

import "@rmrk-team/evm-contracts/contracts/RMRK/multiresource/RMRKMultiResource.sol";

contract AdvancedMultiResource is RMRKMultiResource {
    constructor(
        string memory name,
        string memory symbol
        // Custom optional: additional parameters
    )
        RMRKMultiResource(name, symbol)
    {
        // Custom optional: constructor logic
    }
}
````

</details>

Using `RMRKMultiResource` requires custom implementation of minting logic. Available internal functions to use when
writing it are:

- `_mint(address to, uint256 tokenId)`
- `_safeMint(address to, uint256 tokenId)`
- `_safeMint(address to, uint256 tokenId, bytes memory data)`

In addition to the minting functions, you should also implement the burning, transfer and resource management functions if they apply to your use case:

- `_burn(uint256 tokenId)`
- `_addResourceEntry(uint64 id, string memory metadataURI)`
- `_addResourceToToken(uint256 tokenId, uint64 resourceId, uint64 overwrites)`
- `transferFrom(address from, address to, uint256 tokenId)`

Any additional functions supporting your NFT use case and utility can also be added. Remember to thoroughly test your
smart contracts with extensive test suites and define strict access control rules for the functions that you implement.

Happy multiresourcing! 🫧