# SplitEquippable

The `ExternalEquippable` composite of RMRK legos uses the [`Nesting`](../Nesting/README.md),
[`MultiResource`](../MultiResource/README.md), [`Equippable`](../MergedEquippable/README.md#equippable) and
[`Base`](../MergedEquippable/README.md#base) RMRK legos. Unlike [`SplitEquippable`](../SplitEquippable/README.md) RMRK
lego composite, the external equippable splits `Nesting` apart from `MultiResource` and `Equippable` in order to provide
more space for custom business logic implementation.

## Abstract

In this tutorial we will examine the SplitEquippable composite of RMRK blocks:

- [`SimpleNestingExternalEquip`](./SimpleNestingExternalEquip.sol), [`SimpleExternalEquip`](./SimpleExternalEquip.sol)
and [SimpleBase](../SimpleBase.sol) work together to showcase the minimal implementation of SplitEquippable RMRK lego
composite.
- [`AdvancedNestingExternalEquip`](./AdvancedNestingExternalEquip.sol),
[`AdvancedExternalEquip`](./AdvancedExternalEquip.sol) and [`AdvancedBase`](../AdvancedBase.sol) work together to
showcase a more customizable implementation of the SplitEquippable RMRK lego composite.

Let's first examine the simple, minimal, implementation and then move on to the advanced one.

## Simple SplitEquippable

The simple `SplitEquippable` consists of three smart contracts. The [`SimpleBase`](../MergedEquippable/README.md#base)
is already examined in the `MergedEquippable` documentation. Let's first examine the `SimpleExternalEquip` and then move
on to the `SimpleNestingExternalEquip`.

**NOTE: As the `SimpleBase` smart contract is used by both `MergedEquippable` as well as `SplitEquippable` it resides
in the root `contracts/` directory.**

### SimpleExternalEquip

The `SimpleExternalEquip` example uses the
[`RMRKExternalEquipImpl`](https://github.com/rmrk-team/evm/blob/dev/contracts/implementations/RMRKExternalEquipImpl.sol).
It is used by importing it using the `import` statement below the `pragma` definition:

````solidity
import "@rmrk-team/evm-contracts/contracts/implementations/RMRKExternalEquipImpl.sol";
````

Once the `RMRKExternalEquipImpl.sol` is imported into our file, we can set the inheritance of our smart contract:

````solidity
contract SimpleExternalEquip is RMRKExternalEquipImpl {

}
````

The `RMRKExternalEquipImpl` implements all of the required functionality of the `Equippable` and `MultiResource` RMRK
legos. It implements resource and equippable management.

**WARNING: The `RMRKExternalEquipImpl` only has minimal access control implemented. If you intend to use it, make sure to
define your own, otherwise your smart contracts are at risk of unexpected behaviour.**

The constructor to initialize the `RMRKExternalEquipImpl` accepts the following arguments:

- `nestingAddress`: `address` type of argument specifying the address of the deployed `SimpleNestingExternalEquip` smart
contract

In order to properly initiate the inherited smart contract, our smart contract needs to accept the before mentioned argument in the `constructor` and pass it to the `RMRKExternalEquipImpl`:

````solidity
    constructor(
        address nestingAddress
    ) RMRKExternalEquipImpl(nestingAddress) {}
````

<details>
<summary>The <strong><i>SimpleExternalEquip.sol</i></strong> should look like this:</summary>

````solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

import "@rmrk-team/evm-contracts/contracts/implementations/RMRKExternalEquipImpl.sol";

contract SimpleExternalEquip is RMRKExternalEquipImpl {
    constructor(
        address nestingAddress
    ) RMRKExternalEquipImpl(nestingAddress) {}
}
````

</details>

#### RMRKExternalEquipImpl

Let's take a moment to examine the core of this implementation, the `RMRKExternalEquipImpl`.

It uses the `RMRKExternalEquip` and `OwnableLock` smart contracts from `RMRK` stack as well as `Strings` utility from
`OpenZeppelin`. To dive deeper into their operation, please refer to their respecitve documentation.

The following functions are available:

##### `getFallbackURI`

The `getFallbackURI` function is used to retrieve the fallback URI of the collection.

##### `setFallbackURI`

The `setFallbackURI` is used to set the fallback URI of the collection and accepts one argument:

- `fallbackURI`: `string` type of argument specifying the URI to be used as the fallback URI of the collection

##### `isTokenEnumeratedResource`

The `isTokenEnumeratedResource` is used to check wether the resource ID passed to it represents an enumerated resource:

- `resourceId`: `uint64` type of argument representing the ID of the resource we are validating

##### `setTokenEnumeratedResource`

The `setTokenEnumeratedResource` is used to set a token enumerated resource ID to the passed boolean value and accepts
two arguments:

- `resourceId`: `uint64` type of argument representing the ID of the resource we are setting
- `state`: `bool` type of argument representing the validity of the resource

##### `addResourceToToken`

The `addResourceToToken` is used to add a new resource to the token and accepts three arguments:

- `tokenId`: `uint256` type of argument specifying the ID of the token we are adding resource to
- `resourceId`: `uint64` type of argument specifying the ID of the resource we are adding to the token
- `overwrites`: `uint64` type of argument specifying the ID of the resource we are owerwriting with the desired resource

##### `addResourceEntry`

The `addResourceEntry` is used to add a new URI for the new resource of the token and accepts one argument:

- `metadataURI`: `string` type of argument specifying the metadata URI of a new resource

##### `setValidParentRefId`

The `setValidParentRefId` is used to declare which resources are equippable into the parent address at the given slot
and accepts three arguments:

- `referenceId`: `uint64` type of argument specifying the resources that can be equipped
- `parentAddress`: `address` type of argument specifying the address into which the resource is equippable
- `slotPartId`: `uint64` type of argument specifying the ID of the part it can be equipped to

### SimpleNestingExternalEquip

The `SimpleNestingExternalEquip` example uses the
[`RMRKNestingExternalEquipImpl`](https://github.com/rmrk-team/evm/blob/dev/contracts/implementations/RMRKNestingExternalEquipImpl.sol).
It is used by importing it using the `import` statement below the `pragma` definition:

````solidity
import "@rmrk-team/evm-contracts/contracts/implementations/RMRKNestingExternalEquipImpl.sol";
````

Once the `RMRKNestingExternalEquipImpl.sol` is imported into our file, we can set the inheritance of our smart contract:

````solidity
contract SimpleNestingExternalEquip is RMRKNestingExternalEquipImpl {
    
}
````

The `RMRKNestingExternalEquipImpl` implements all of the functionality of the `Nesting` RMRK lego block. It implements
minting and burning of the NFTs as well as setting the equippable address.

**WARNING: The `RMRKNestingExternalEquipImpl` only has minimal access control implemented. If you intend to use it, make
sure to define your own, otherwise your smart contracts are at risk of unexpected behaviour.**

The `constructor` to initialize the `RMRKNestingExternalEquipImpl` accepts the following arguments:

- `name_`: `string` type of argument specifying the name of the collection
- `symbol_`: `string` type of argument specifying the symbol of the collection
- `maxSupploy_`: `uint256` type of argument specifying the maximum amount of tokens in the collection
- `pricePerMint_`: `uint256` type of argument representing the price per mint in wei or the lowest denomination of a
native currency of the EVM to which the smart contract is deployed to
- `equippableAddress`: `address` type of argument specifying the address of the `SimpleExternalEquip` smart contract

In order to properly initialize the inherited smart contract, our smart contract needs to accept the arguments,
mentioned above, in the `constructor` and pass them to the `RMRKNestingExternalEquipImpl`:

````solidity
    constructor(
        string memory name,
        string memory symbol,
        uint256 maxSupply,
        uint256 pricePerMint,
        address equippableAddress
    ) RMRKNestingExternalEquipImpl(name, symbol, maxSupply, pricePerMint, equippableAddress) {}
````

<details>
<summary>The <strong><i>SimpleNestingExternalEquip.sol</i></strong> should look like this:</summary>

````solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

import "@rmrk-team/evm-contracts/contracts/implementations/RMRKNestingExternalEquipImpl.sol";

contract SimpleNestingExternalEquip is RMRKNestingExternalEquipImpl {
    constructor(
        string memory name,
        string memory symbol,
        uint256 maxSupply,
        uint256 pricePerMint,
        address equippableAddress
    ) RMRKNestingExternalEquipImpl(name, symbol, maxSupply, pricePerMint, equippableAddress) {}
}
````

</details>

#### RMRKNestingExternalEquipImpl

Let's take a moment to examine the core of this implementation, the `RMRKNestingExternalEquipImpl`.

It uses the `RMRKMintingUtils` and `RMRKNestingExternalEquip` smart contracts from RMRK stack. To dive deeper into their
operation, please refer to their respective documentation.

Two errors are defined:

````solidity
error RMRKMintUnderpriced();
error RMRKMintZero();
````

`RMRKMintUnderpriced()` is used when not enough value is used when attempting to mint a token and `RMRKMintZero` is used
when attempting to mint 0 tokens.

**WARNING: The `RMRKMultiResourceImpl` only has minimal access control implemented. If you intend to use it, make sure
to define your own, otherwise your smart contracts are at risk of unexpected behaviour.**

Let's examine the available methods:

##### `mint`

The `mint` function is used to mint parent NFTs and accepts two arguments:

- `to`: `address` type of argument that specifies who should receive the newly minted tokens
- `numToMint`: `uint256` type of argument that specifies how many tokens should be minted

There are a few constraints to this function:

- after minting, the total number of tokens should not exceed the maximum allowed supply
- attempthing to mint 0 tokens is not allowed as it makes no sense to pay for the gas without any effect
- value should accompany transaction equal to a price per mint multiplied by the `numToMint`

##### `mintNesting`

The `mintNesting` function is used to mint child NFTs to be owned by the parent NFT and accepts three arguments:

- `to`: `address` type of argument specifying the address of the smart contract to which the parent NFT belongs to
- `numToMint`: `uint256` type of argument specifying the amount of tokens to be minted
- `destinationId`: `uint256` type of argument specifying the ID of the parent NFT to which to mint the child NFT

The constraints of `mintNesting` are similar to the ones set out for `mint` function.

##### `burn`

Can only be called by a direct owner or a parent NFT's smart contract or a caller that was given the allowance and is
used to burn the NFT.

##### `setEquippableAddress`

The `setEquippableAddress` function is used to set the address of a deployed `SimpleExternalEquip` smart contract and
accepts one argument:

- `equippable`: `address` type of argument specifying the address of a deployed `SimpleExternalEquip` smart contract

### Deploy script

The deploy script for the simple `SplitEquippable` resides in the
[`deploySplitEquippable.ts`](../../scripts/deploySplitEquippable.ts).

The seploy script uses the `ethers`, `SimpleBase`, `SimpleEquippable`, `SimpleNestingExternalEquip`,
`RMRKEquipRenderUtils` and `ContractTransaction` imports. We will also define the `pricePerMint` constant, which will be
used to set the minting price of the tokens. The empty deploy script should look like this:

````typescript
import { ethers } from "hardhat";
import {
  SimpleBase,
  SimpleExternalEquip,
  SimpleNestingExternalEquip,
  RMRKEquipRenderUtils,
} from "../typechain-types";
import { ContractTransaction } from "ethers";

const pricePerMint = ethers.utils.parseEther("0.0001");

async function main() {

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
````

Since we will expand upon this deploy script in the [user journey](#user-journey), we will add a `deployContracts`
function. In it we will deploy one `SimpleExternalEquip` and one `SimpleExternalEquip` smart contract per example (we
will use `Kanaria` and `Gem` examples). In addition to that, we will also deploy the `SimpleBase` and the
`RMRKEquipRenderUtils` which we will use to piece together the final product of the user journey. Once the smart
contracts are deployed, we will output their addresses. The function is defined below the `main` function definition:

````typescript
async function deployContracts(): Promise<
  [
    SimpleNestingExternalEquip,
    SimpleExternalEquip,
    SimpleNestingExternalEquip,
    SimpleExternalEquip,
    SimpleBase,
    RMRKEquipRenderUtils
  ]
> {
  const equipFactory = await ethers.getContractFactory("SimpleExternalEquip");
  const nestingFactory = await ethers.getContractFactory(
    "SimpleNestingExternalEquip"
  );
  const baseFactory = await ethers.getContractFactory("SimpleBase");
  const viewsFactory = await ethers.getContractFactory("RMRKEquipRenderUtils");

  const kanariaNesting: SimpleNestingExternalEquip =
    await nestingFactory.deploy(
      "Kanaria",
      "KAN",
      1000,
      pricePerMint,
      ethers.constants.AddressZero
    );
  const gemNesting: SimpleNestingExternalEquip = await nestingFactory.deploy(
    "Gem",
    "GM",
    3000,
    pricePerMint,
    ethers.constants.AddressZero
  );

  const kanariaEquip: SimpleExternalEquip = await equipFactory.deploy(
    kanariaNesting.address
  );
  const gemEquip: SimpleExternalEquip = await equipFactory.deploy(
    gemNesting.address
  );
  const base: SimpleBase = await baseFactory.deploy("KB", "svg");
  const views: RMRKEquipRenderUtils = await viewsFactory.deploy();

  await kanariaNesting.deployed();
  await kanariaEquip.deployed();
  await gemNesting.deployed();
  await gemEquip.deployed();
  await base.deployed();

  const allTx = [
    await kanariaNesting.setEquippableAddress(kanariaEquip.address),
    await gemNesting.setEquippableAddress(gemEquip.address),
  ];
  await Promise.all(allTx.map((tx) => tx.wait()));
  console.log(
    `Sample contracts deployed to ${kanariaNesting.address} (Kanaria Nesting) | ${kanariaEquip.address} (Kanaria Equip), ${gemNesting.address} (Gem Nesting) | ${gemEquip.address} (Gem Equip) and ${base.address} (Base)`
  );

  return [kanariaNesting, kanariaEquip, gemNesting, gemEquip, base, views];
}
````

In order for the `deployContracts` to be called when running the deploy script, we have to add it to the `main`
function:

````typescript
  const [kanaria, gem, base, views] = await deployContracts();
````

A custom script added to [`package.json`](../../package.json) allows us to easily run the script:

````json
  "scripts": {
    "deploy-split-equippable": "hardhat run scripts/deploySplitEquippable.ts"
  }
````

Using the script with `npm run deploy-split-equippable` should return the following output:

````shell
npm run deploy-split-equippable

> @rmrk-team/evm-contract-samples@0.1.0 deploy-split-equippable
> hardhat run scripts/deploySplitEquippable.ts

Compiled 47 Solidity files successfully
Sample contracts deployed to 0x5FbDB2315678afecb367f032d93F642f64180aa3 (Kanaria Nesting) | 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0 (Kanaria Equip), 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512 (Gem Nesting) | 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9 (Gem Equip) and 0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9 (Base)
````

### User journey

With the deploy script ready, we can examine how the journey of a user using split equippable would look like.

The base of the user jourey script is the same as the deploy script, as we need to deploy the smart contract in order
to interact with it:

````typescript
import { ethers } from "hardhat";
import {
  SimpleBase,
  SimpleExternalEquip,
  SimpleNestingExternalEquip,
  RMRKEquipRenderUtils,
} from "../typechain-types";
import { ContractTransaction } from "ethers";

const pricePerMint = ethers.utils.parseEther("0.0001");

async function main() {
  const [kanariaNesting, kanariaEquip, gemNesting, gemEquip, base, views] =
    await deployContracts();
}

async function deployContracts(): Promise<
  [
    SimpleNestingExternalEquip,
    SimpleExternalEquip,
    SimpleNestingExternalEquip,
    SimpleExternalEquip,
    SimpleBase,
    RMRKEquipRenderUtils
  ]
> {
  const equipFactory = await ethers.getContractFactory("SimpleExternalEquip");
  const nestingFactory = await ethers.getContractFactory(
    "SimpleNestingExternalEquip"
  );
  const baseFactory = await ethers.getContractFactory("SimpleBase");
  const viewsFactory = await ethers.getContractFactory("RMRKEquipRenderUtils");

  const kanariaNesting: SimpleNestingExternalEquip =
    await nestingFactory.deploy(
      "Kanaria",
      "KAN",
      1000,
      pricePerMint,
      ethers.constants.AddressZero
    );
  const gemNesting: SimpleNestingExternalEquip = await nestingFactory.deploy(
    "Gem",
    "GM",
    3000,
    pricePerMint,
    ethers.constants.AddressZero
  );

  const kanariaEquip: SimpleExternalEquip = await equipFactory.deploy(
    kanariaNesting.address
  );
  const gemEquip: SimpleExternalEquip = await equipFactory.deploy(
    gemNesting.address
  );
  const base: SimpleBase = await baseFactory.deploy("KB", "svg");
  const views: RMRKEquipRenderUtils = await viewsFactory.deploy();

  await kanariaNesting.deployed();
  await kanariaEquip.deployed();
  await gemNesting.deployed();
  await gemEquip.deployed();
  await base.deployed();

  const allTx = [
    await kanariaNesting.setEquippableAddress(kanariaEquip.address),
    await gemNesting.setEquippableAddress(gemEquip.address),
  ];
  await Promise.all(allTx.map((tx) => tx.wait()));
  console.log(
    `Sample contracts deployed to ${kanariaNesting.address} (Kanaria Nesting) | ${kanariaEquip.address} (Kanaria Equip), ${gemNesting.address} (Gem Nesting) | ${gemEquip.address} (Gem Equip) and ${base.address} (Base)`
  );

  return [kanariaNesting, kanariaEquip, gemNesting, gemEquip, base, views];
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
````

Once the smart contracts are deployed, we can setup the Base. We will set it up have two fixed part options for
background, head, body and wings. Additionally we will add three slot options for gems. All of these will be added 
sing the [`addPartList`](#addpartlist) method. The call together with encapsulating `setupBase` function should look
like this:

````typescript
async function setupBase(base: SimpleBase, gemAddress: string): Promise<void> {
  // Setup base with 2 fixed part options for background, head, body and wings.
  // Also 3 slot options for gems
  const tx = await base.addPartList([
    {
      // Background option 1
      partId: 1,
      part: {
        itemType: 2, // Fixed
        z: 0,
        equippable: [],
        metadataURI: "ipfs://backgrounds/1.svg",
      },
    },
    {
      // Background option 2
      partId: 2,
      part: {
        itemType: 2, // Fixed
        z: 0,
        equippable: [],
        metadataURI: "ipfs://backgrounds/2.svg",
      },
    },
    {
      // Head option 1
      partId: 3,
      part: {
        itemType: 2, // Fixed
        z: 3,
        equippable: [],
        metadataURI: "ipfs://heads/1.svg",
      },
    },
    {
      // Head option 2
      partId: 4,
      part: {
        itemType: 2, // Fixed
        z: 3,
        equippable: [],
        metadataURI: "ipfs://heads/2.svg",
      },
    },
    {
      // Body option 1
      partId: 5,
      part: {
        itemType: 2, // Fixed
        z: 2,
        equippable: [],
        metadataURI: "ipfs://body/1.svg",
      },
    },
    {
      // Body option 2
      partId: 6,
      part: {
        itemType: 2, // Fixed
        z: 2,
        equippable: [],
        metadataURI: "ipfs://body/2.svg",
      },
    },
    {
      // Wings option 1
      partId: 7,
      part: {
        itemType: 2, // Fixed
        z: 1,
        equippable: [],
        metadataURI: "ipfs://wings/1.svg",
      },
    },
    {
      // Wings option 2
      partId: 8,
      part: {
        itemType: 2, // Fixed
        z: 1,
        equippable: [],
        metadataURI: "ipfs://wings/2.svg",
      },
    },
    {
      // Gems slot 1
      partId: 9,
      part: {
        itemType: 1, // Slot
        z: 4,
        equippable: [gemAddress], // Only gems tokens can be equipped here
        metadataURI: "",
      },
    },
    {
      // Gems slot 2
      partId: 10,
      part: {
        itemType: 1, // Slot
        z: 4,
        equippable: [gemAddress], // Only gems tokens can be equipped here
        metadataURI: "",
      },
    },
    {
      // Gems slot 3
      partId: 11,
      part: {
        itemType: 1, // Slot
        z: 4,
        equippable: [gemAddress], // Only gems tokens can be equipped here
        metadataURI: "",
      },
    },
  ]);
  await tx.wait();
  console.log("Base is set");
}
````

Notice how the `z` value of the background is `0` and that of the head is `3`. Also note how the `itemType` value of
the `Slot` type of fixed items is `2` and that of equippable items is `1`. Additionally the `metadataURI` is usually
left blank for the equippables, but has to be set for the fixed items. The `equippable` values have to be set to the
gem smart contracts for the equippable items.

In order for the `setupBase` to be called, we have to add it to the `main` function:

````typescript
  await setupBase(base, gemEquip.address);
````

**NOTE: The address of the `SimpleExternalEquip` part of `Gem` should be passed to the `setupBase`.**

With the Base set up, the tokens should now be minted. Both `Kanaria` and `Gem` tokens will be minted in the
`mintTokens`. To define how many tokens should be minted, `totalBirds` constant will be added below the `import`
statements:

````typescript
const totalBirds = 5;
````

The `mintToken` function should accept two arguments (`SimpleNestingExternalEquip` of `Kanaria` and `Gem`). We will
prepare a batch of transactions to mint the tokens and send them. Once the tokens are minted, we will output the total
number of tokens minted. While the `Kanaria` tokens will be minted to the `owner` address, the `Gem` tokens will be
minted using the [`mintNesting`](#mintnesting) method in order to be minted directly to the Kanaria tokens. We will
mint three `Gem` tokens to each `Kanaria`. Since all of the nested tokens need to be approved, we will also build a
batch of transaction to accept a single nest-minted `Gem` for each `Kanaria`:

````typescript
async function mintTokens(
  kanaria: SimpleNestingExternalEquip,
  gem: SimpleNestingExternalEquip
): Promise<void> {
  const [owner] = await ethers.getSigners();

  // Mint some kanarias
  let tx = await kanaria.mint(owner.address, totalBirds, {
    value: pricePerMint.mul(totalBirds),
  });
  await tx.wait();
  console.log(`Minted ${totalBirds} kanarias`);

  // Mint 3 gems into each kanariaNesting
  let allTx: ContractTransaction[] = [];
  for (let i = 1; i <= totalBirds; i++) {
    let tx = await gem.mintNesting(kanaria.address, 3, i, {
      value: pricePerMint.mul(3),
    });
    allTx.push(tx);
  }
  await Promise.all(allTx.map((tx) => tx.wait()));
  console.log(`Minted 3 gems into each kanariaNesting`);

  // Accept 3 gems for each kanariaNesting
  for (let i = 0; i < 3; i++) {
    allTx = [];
    for (let tokenId = 1; tokenId <= totalBirds; tokenId++) {
      let tx = await kanaria.acceptChild(tokenId, 0);
      allTx.push(tx);
    }
    await Promise.all(allTx.map((tx) => tx.wait()));
    console.log(`Accepted 1 gemNesting for each kanariaNesting`);
  }
}
````

In order for the `mintTokens` to be called, we have to add it to the `main` function:

````typescript
  await mintTokens(kanariaNesting, gemNesting);
````

Having minted both `Kanaria`s and `Gem`s, we can now add resources to them. The resources are added to the
`SimpleExternalEquip` parts of them. We will add resources to the `Kanaria` using the `addKanariaResources` function.
It accepts `Kanaria` and address of the `Base` smart contract. Resources will be added using the
[`addResourceEntry`](#addresourceentry) method. We will add a default resource, which doesn't need a `baseAddress`
value. The composed resource needs to have the `baseAddress`. We also specify the fixed parts IDs for background, head,
body and wings. Additionally we allow the gems to be equipped in the slot parts IDs. With the resource entires added,
we can add them to a token and then accept them as well:

````typescript
async function addKanariaResources(
  kanaria: SimpleExternalEquip,
  baseAddress: string
): Promise<void> {
  const resourceDefaultId = 1;
  const resourceComposedId = 2;
  let allTx: ContractTransaction[] = [];
  let tx = await kanaria.addResourceEntry(
    {
      id: resourceDefaultId,
      equippableRefId: 0, // Only used for resources meant to equip into others
      baseAddress: ethers.constants.AddressZero, // base is not needed here
      metadataURI: "ipfs://default.png",
    },
    [],
    []
  );
  allTx.push(tx);

  tx = await kanaria.addResourceEntry(
    {
      id: resourceComposedId,
      equippableRefId: 0, // Only used for resources meant to equip into others
      baseAddress: baseAddress, // Since we're using parts, we must define the base
      metadataURI: "ipfs://meta1.json",
    },
    [1, 3, 5, 7], // We're using first background, head, body and wings
    [9, 10, 11] // We state that this can receive the 3 slot parts for gems
  );
  allTx.push(tx);
  // Wait for both resources to be added
  await Promise.all(allTx.map((tx) => tx.wait()));
  console.log("Added 2 resource entries");

  // Add resources to token
  const tokenId = 1;
  allTx = [
    await kanaria.addResourceToToken(tokenId, resourceDefaultId, 0),
    await kanaria.addResourceToToken(tokenId, resourceComposedId, 0),
  ];
  await Promise.all(allTx.map((tx) => tx.wait()));
  console.log("Added resources to token 1");

  // Accept both resources:
  tx = await kanaria.acceptResource(tokenId, 0);
  await tx.wait();
  tx = await kanaria.acceptResource(tokenId, 0);
  await tx.wait();
  console.log("Resources accepted");
}
````

Adding resources to `Gem`s is done in the `addGemResources`. It accepts `SimpleExternalEquip` part of `Gem`, address of
the `SimpleExternalEquip` of `Kanaria` smart contract and the address of the `Base` smart contract. We will add 4
resources for each gem; one full version and three that match each slot. Reference IDs are specified for easier
reference from the child's perspective. The resources will be added one by one. Note how the full versions of gems
don't have the `equippableRefId`.

Having added the resource entries, we can now add the valid parent reference IDs using the
[`setValidParentRefd`](#setvalidparentrefid). For example if we want to add a valid reference for the left gem, we need
to pass thee value of equippable reference ID of the left gem, parent smart contract address (in our case this is
`SimpleExternalEquip` of `Kanaria` smart contract) and ID of the slot which was defined in `Base` (this is ID number 9
in the `Base` for the left gem).

Last thing to do is to add resources to the tokens using [`addResourceToToken`](#addresourcetotoken). Resource of type
A will be added to the gems 1 and 2, and the type B of the resource is added to gem 3. All of these should be accepted
using `acceptResource`:

````typescript
async function addGemResources(
  gem: SimpleExternalEquip,
  kanariaAddress: string,
  baseAddress: string
): Promise<void> {
  // We'll add 4 resources for each gemNesting, a full version and 3 versions matching each slot.
  // We will have only 2 types of gems -> 4x2: 8 resources.
  // This is not composed by others, so fixed and slot parts are never used.
  const gemVersions = 4;

  // These refIds are used from the child's perspective, to group resources that can be equipped into a parent
  // With it, we avoid the need to do set it resource by resource
  const equippableRefIdLeftGem = 1;
  const equippableRefIdMidGem = 2;
  const equippableRefIdRightGem = 3;

  // We can do a for loop, but this makes it clearer.
  let allTx = [
    await gem.addResourceEntry(
      // Full version for first type of gemNesting, no need of refId or base
      {
        id: 1,
        equippableRefId: 0,
        baseAddress: baseAddress,
        metadataURI: `ipfs://gems/typeA/full.svg`,
      },
      [],
      []
    ),
    await gem.addResourceEntry(
      // Equipped into left slot for first type of gemNesting
      {
        id: 2,
        equippableRefId: equippableRefIdLeftGem,
        baseAddress: baseAddress,
        metadataURI: `ipfs://gems/typeA/left.svg`,
      },
      [],
      []
    ),
    await gem.addResourceEntry(
      // Equipped into mid slot for first type of gemNesting
      {
        id: 3,
        equippableRefId: equippableRefIdMidGem,
        baseAddress: baseAddress,
        metadataURI: `ipfs://gems/typeA/mid.svg`,
      },
      [],
      []
    ),
    await gem.addResourceEntry(
      // Equipped into left slot for first type of gemNesting
      {
        id: 4,
        equippableRefId: equippableRefIdRightGem,
        baseAddress: baseAddress,
        metadataURI: `ipfs://gems/typeA/right.svg`,
      },
      [],
      []
    ),
    await gem.addResourceEntry(
      // Full version for second type of gemNesting, no need of refId or base
      {
        id: 5,
        equippableRefId: 0,
        baseAddress: ethers.constants.AddressZero,
        metadataURI: `ipfs://gems/typeB/full.svg`,
      },
      [],
      []
    ),
    await gem.addResourceEntry(
      // Equipped into left slot for second type of gemNesting
      {
        id: 6,
        equippableRefId: equippableRefIdLeftGem,
        baseAddress: baseAddress,
        metadataURI: `ipfs://gems/typeB/left.svg`,
      },
      [],
      []
    ),
    await gem.addResourceEntry(
      // Equipped into mid slot for second type of gemNesting
      {
        id: 7,
        equippableRefId: equippableRefIdMidGem,
        baseAddress: baseAddress,
        metadataURI: `ipfs://gems/typeB/mid.svg`,
      },
      [],
      []
    ),
    await gem.addResourceEntry(
      // Equipped into right slot for second type of gemNesting
      {
        id: 8,
        equippableRefId: equippableRefIdRightGem,
        baseAddress: baseAddress,
        metadataURI: `ipfs://gems/typeB/right.svg`,
      },
      [],
      []
    ),
  ];

  await Promise.all(allTx.map((tx) => tx.wait()));
  console.log(
    "Added 8 gemNesting resources. 2 Types of gems with full, left, mid and right versions."
  );

  // 9, 10 and 11 are the slot part ids for the gems, defined on the base.
  // e.g. Any resource on gemNesting, which sets its equippableRefId to equippableRefIdLeftGem
  //      will be considered a valid equip into any kanariaNesting on slot 9 (left gemNesting).
  allTx = [
    await gem.setValidParentRefId(equippableRefIdLeftGem, kanariaAddress, 9),
    await gem.setValidParentRefId(equippableRefIdMidGem, kanariaAddress, 10),
    await gem.setValidParentRefId(equippableRefIdRightGem, kanariaAddress, 11),
  ];
  await Promise.all(allTx.map((tx) => tx.wait()));

  // We add resources of type A to gemNesting 1 and 2, and type Bto gemNesting 3. Both are nested into the first kanariaNesting
  // This means gems 1 and 2 will have the same resource, which is totally valid.
  allTx = [
    await gem.addResourceToToken(1, 1, 0),
    await gem.addResourceToToken(1, 2, 0),
    await gem.addResourceToToken(1, 3, 0),
    await gem.addResourceToToken(1, 4, 0),
    await gem.addResourceToToken(2, 1, 0),
    await gem.addResourceToToken(2, 2, 0),
    await gem.addResourceToToken(2, 3, 0),
    await gem.addResourceToToken(2, 4, 0),
    await gem.addResourceToToken(3, 5, 0),
    await gem.addResourceToToken(3, 6, 0),
    await gem.addResourceToToken(3, 7, 0),
    await gem.addResourceToToken(3, 8, 0),
  ];
  await Promise.all(allTx.map((tx) => tx.wait()));
  console.log("Added 4 resources to each of 3 gems.");

  // We accept each resource for both gems
  for (let i = 0; i < gemVersions; i++) {
    allTx = [
      await gem.acceptResource(1, 0),
      await gem.acceptResource(2, 0),
      await gem.acceptResource(3, 0),
    ];
    await Promise.all(allTx.map((tx) => tx.wait()));
  }
  console.log("Accepted 4 resources to each of 3 gems.");
}
````

In order for the `addKanariaResources` and `addGemResources` to be called, we have to add them to the `main` function:

````typescript
  await addKanariaResources(kanariaEquip, base.address);
  await addGemResources(gemEquip, kanariaEquip.address, base.address);
````

With `Kanaria`s and `Gem`s ready, we can equip the gems to Kanarias using the `equipGems` function. We will build a
batch of `equip` transactions calling the `SimpleExternalEquip` of the `Kanaria` and send it all at once:

````typescript
async function equipGems(kanariaEquip: SimpleExternalEquip): Promise<void> {
  const allTx = [
    await kanariaEquip.equip({
      tokenId: 1, // Kanaria 1
      childIndex: 0, // Gem 1 is on position 0
      resourceId: 2, // Resource for the kanariaNesting which is composable
      slotPartId: 9, // left gemNesting slot
      childResourceId: 2, // Resource id for child meant for the left gemNesting
    }),
    await kanariaEquip.equip({
      tokenId: 1, // Kanaria 1
      childIndex: 2, // Gem 2 is on position 2 (positions are shifted when accepting children)
      resourceId: 2, // Resource for the kanariaNesting which is composable
      slotPartId: 10, // mid gemNesting slot
      childResourceId: 3, // Resource id for child meant for the mid gemNesting
    }),
    await kanariaEquip.equip({
      tokenId: 1, // Kanaria 1
      childIndex: 1, // Gem 3 is on position 1
      resourceId: 2, // Resource for the kanariaNesting which is composable
      slotPartId: 11, // right gemNesting slot
      childResourceId: 8, // Resource id for child meant for the right gemNesting
    }),
  ];
  await Promise.all(allTx.map((tx) => tx.wait()));
  console.log("Equipped 3 gems into first kanariaNesting");
}
````

In order for the `equipGems` to be called, we have to add it to the `main` function:

````typescript
  await equipGems(kanariaEquip);
````

Last thing to do is to compose the equippables with the `composeEquippables` function. It composes the whole NFT along
with the nested and equipped parts:

````typescript
async function composeEquippables(
  views: RMRKEquipRenderUtils,
  kanariaAddress: string
): Promise<void> {
  const tokenId = 1;
  const resourceId = 2;
  console.log(
    "Composed: ",
    await views.composeEquippables(kanariaAddress, tokenId, resourceId)
  );
}
````

In order for the `composeEquippables` to be called, we have to add it to the `main` function:

````typescript
  await composeEquippables(views, kanariaEquip.address);
````

With the user journey script concluded, we can add a custom helper to the [`package.json`](../../package.json) to make
running it easier:

````json
    "user-journey-split-equippable": "hardhat run scripts/splitEquippableUserJourney.ts"
````

Running it using `npm run user-journey-split-equippable` should return the following oputput:

````shell
npm run user-journey-split-equippable

> @rmrk-team/evm-contract-samples@0.1.0 user-journey-split-equippable
> hardhat run scripts/splitEquippableUserJourney.ts

Sample contracts deployed to 0x5FbDB2315678afecb367f032d93F642f64180aa3 | 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0, 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512 | 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9 and 0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9
Base is set
Minted 5 kanarias
Minted 3 gems into each kanariaNesting
Accepted 1 gemNesting for each kanariaNesting
Accepted 1 gemNesting for each kanariaNesting
Accepted 1 gemNesting for each kanariaNesting
Added 2 resource entries
Added resources to token 1
Resources accepted
Added 8 gemNesting resources. 2 Types of gems with full, left, mid and right versions.
Added 4 resources to each of 3 gems.
Accepted 4 resources to each of 3 gems.
Equipped 3 gems into first kanariaNesting
Composed:  [
  [
    BigNumber { value: "2" },
    BigNumber { value: "0" },
    '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
    'ipfs://meta1.json',
    id: BigNumber { value: "2" },
    equippableRefId: BigNumber { value: "0" },
    baseAddress: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
    metadataURI: 'ipfs://meta1.json'
  ],
  [
    [
      BigNumber { value: "1" },
      0,
      'ipfs://backgrounds/1.svg',
      partId: BigNumber { value: "1" },
      z: 0,
      metadataURI: 'ipfs://backgrounds/1.svg'
    ],
    [
      BigNumber { value: "3" },
      3,
      'ipfs://heads/1.svg',
      partId: BigNumber { value: "3" },
      z: 3,
      metadataURI: 'ipfs://heads/1.svg'
    ],
    [
      BigNumber { value: "5" },
      2,
      'ipfs://body/1.svg',
      partId: BigNumber { value: "5" },
      z: 2,
      metadataURI: 'ipfs://body/1.svg'
    ],
    [
      BigNumber { value: "7" },
      1,
      'ipfs://wings/1.svg',
      partId: BigNumber { value: "7" },
      z: 1,
      metadataURI: 'ipfs://wings/1.svg'
    ]
  ],
  [
    [
      BigNumber { value: "9" },
      BigNumber { value: "2" },
      4,
      BigNumber { value: "1" },
      '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
      '',
      partId: BigNumber { value: "9" },
      childResourceId: BigNumber { value: "2" },
      z: 4,
      childTokenId: BigNumber { value: "1" },
      childAddress: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
      metadataURI: ''
    ],
    [
      BigNumber { value: "10" },
      BigNumber { value: "3" },
      4,
      BigNumber { value: "2" },
      '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
      '',
      partId: BigNumber { value: "10" },
      childResourceId: BigNumber { value: "3" },
      z: 4,
      childTokenId: BigNumber { value: "2" },
      childAddress: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
      metadataURI: ''
    ],
    [
      BigNumber { value: "11" },
      BigNumber { value: "8" },
      4,
      BigNumber { value: "3" },
      '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
      '',
      partId: BigNumber { value: "11" },
      childResourceId: BigNumber { value: "8" },
      z: 4,
      childTokenId: BigNumber { value: "3" },
      childAddress: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
      metadataURI: ''
    ]
  ],
  resource: [
    BigNumber { value: "2" },
    BigNumber { value: "0" },
    '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
    'ipfs://meta1.json',
    id: BigNumber { value: "2" },
    equippableRefId: BigNumber { value: "0" },
    baseAddress: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
    metadataURI: 'ipfs://meta1.json'
  ],
  fixedParts: [
    [
      BigNumber { value: "1" },
      0,
      'ipfs://backgrounds/1.svg',
      partId: BigNumber { value: "1" },
      z: 0,
      metadataURI: 'ipfs://backgrounds/1.svg'
    ],
    [
      BigNumber { value: "3" },
      3,
      'ipfs://heads/1.svg',
      partId: BigNumber { value: "3" },
      z: 3,
      metadataURI: 'ipfs://heads/1.svg'
    ],
    [
      BigNumber { value: "5" },
      2,
      'ipfs://body/1.svg',
      partId: BigNumber { value: "5" },
      z: 2,
      metadataURI: 'ipfs://body/1.svg'
    ],
    [
      BigNumber { value: "7" },
      1,
      'ipfs://wings/1.svg',
      partId: BigNumber { value: "7" },
      z: 1,
      metadataURI: 'ipfs://wings/1.svg'
    ]
  ],
  slotParts: [
    [
      BigNumber { value: "9" },
      BigNumber { value: "2" },
      4,
      BigNumber { value: "1" },
      '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
      '',
      partId: BigNumber { value: "9" },
      childResourceId: BigNumber { value: "2" },
      z: 4,
      childTokenId: BigNumber { value: "1" },
      childAddress: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
      metadataURI: ''
    ],
    [
      BigNumber { value: "10" },
      BigNumber { value: "3" },
      4,
      BigNumber { value: "2" },
      '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
      '',
      partId: BigNumber { value: "10" },
      childResourceId: BigNumber { value: "3" },
      z: 4,
      childTokenId: BigNumber { value: "2" },
      childAddress: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
      metadataURI: ''
    ],
    [
      BigNumber { value: "11" },
      BigNumber { value: "8" },
      4,
      BigNumber { value: "3" },
      '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
      '',
      partId: BigNumber { value: "11" },
      childResourceId: BigNumber { value: "8" },
      z: 4,
      childTokenId: BigNumber { value: "3" },
      childAddress: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
      metadataURI: ''
    ]
  ]
]
````

This concludes our work on the simple Split equippable RMRK lego composite and we can now move on to examining the
advanced implementation.