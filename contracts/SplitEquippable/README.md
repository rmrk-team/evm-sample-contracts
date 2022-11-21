# SplitEquippable

The `ExternalEquippable` composite of RMRK legos uses the [`Nestable`](../Nestable/README.md),
[`MultiAsset`](../MultiAsset/README.md), [`Equippable`](../MergedEquippable/README.md#equippable) and
[`Base`](../MergedEquippable/README.md#base) RMRK legos. Unlike [`MergedEquippable`](../MergedEquippable/README.md) RMRK
lego composite, the external equippable splits `Nestable` apart from `MultiAsset` and `Equippable` in order to provide
more space for custom business logic implementation.

## Abstract

In this tutorial we will examine the SplitEquippable composite of RMRK blocks:

- [`SimpleNestableExternalEquip`](./SimpleNestableExternalEquip.sol), [`SimpleExternalEquip`](./SimpleExternalEquip.sol)
and [SimpleBase](../SimpleBase.sol) work together to showcase the minimal implementation of SplitEquippable RMRK lego
composite.
- [`AdvancedNestableExternalEquip`](./AdvancedNestableExternalEquip.sol),
[`AdvancedExternalEquip`](./AdvancedExternalEquip.sol) and [`AdvancedBase`](../AdvancedBase.sol) work together to
showcase a more customizable implementation of the SplitEquippable RMRK lego composite.

Let's first examine the simple, minimal, implementation and then move on to the advanced one.

## Simple SplitEquippable

The simple `SplitEquippable` consists of three smart contracts. The [`SimpleBase`](../MergedEquippable/README.md#base)
is already examined in the `MergedEquippable` documentation. Let's first examine the `SimpleExternalEquip` and then move
on to the `SimpleNestableExternalEquip`.

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

The `RMRKExternalEquipImpl` implements all of the required functionality of the `Equippable` and `MultiAsset` RMRK
legos. It implements asset and equippable management.

**WARNING: The `RMRKExternalEquipImpl` only has minimal access control implemented. If you intend to use it, make sure to
define your own, otherwise your smart contracts are at risk of unexpected behaviour.**

The constructor to initialize the `RMRKExternalEquipImpl` accepts the following arguments:

- `nestableAddress`: `address` type of argument specifying the address of the deployed `SimpleNestableExternalEquip` smart
contract

In order to properly initiate the inherited smart contract, our smart contract needs to accept the before mentioned argument in the `constructor` and pass it to the `RMRKExternalEquipImpl`:

````solidity
    constructor(
        address nestableAddress
    ) RMRKExternalEquipImpl(nestableAddress) {}
````

<details>
<summary>The <strong><i>SimpleExternalEquip.sol</i></strong> should look like this:</summary>

````solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

import "@rmrk-team/evm-contracts/contracts/implementations/RMRKExternalEquipImpl.sol";

contract SimpleExternalEquip is RMRKExternalEquipImpl {
    constructor(
        address nestableAddress
    ) RMRKExternalEquipImpl(nestableAddress) {}
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

##### `isTokenEnumeratedAsset`

The `isTokenEnumeratedAsset` is used to check wether the asset ID passed to it represents an enumerated asset:

- `assetId`: `uint64` type of argument representing the ID of the asset we are validating

##### `setTokenEnumeratedAsset`

The `setTokenEnumeratedAsset` is used to set a token enumerated asset ID to the passed boolean value and accepts
two arguments:

- `assetId`: `uint64` type of argument representing the ID of the asset we are setting
- `state`: `bool` type of argument representing the validity of the asset

##### `addAssetToToken`

The `addAssetToToken` is used to add a new asset to the token and accepts three arguments:

- `tokenId`: `uint256` type of argument specifying the ID of the token we are adding asset to
- `assetId`: `uint64` type of argument specifying the ID of the asset we are adding to the token
- `overwrites`: `uint64` type of argument specifying the ID of the asset we are owerwriting with the desired asset

##### `addAssetEntry`

The `addAssetEntry` is used to add a new URI for the new asset of the token and accepts one argument:

- `metadataURI`: `string` type of argument specifying the metadata URI of a new asset

##### `setValidParentRefId`

The `setValidParentRefId` is used to declare which assets are equippable into the parent address at the given slot
and accepts three arguments:

- `referenceId`: `uint64` type of argument specifying the assets that can be equipped
- `parentAddress`: `address` type of argument specifying the address into which the asset is equippable
- `slotPartId`: `uint64` type of argument specifying the ID of the part it can be equipped to

### SimpleNestableExternalEquip

The `SimpleNestableExternalEquip` example uses the
[`RMRKNestableExternalEquipImpl`](https://github.com/rmrk-team/evm/blob/dev/contracts/implementations/RMRKNestableExternalEquipImpl.sol).
It is used by importing it using the `import` statement below the `pragma` definition:

````solidity
import "@rmrk-team/evm-contracts/contracts/implementations/RMRKNestableExternalEquipImpl.sol";
````

Once the `RMRKNestableExternalEquipImpl.sol` is imported into our file, we can set the inheritance of our smart contract:

````solidity
contract SimpleNestableExternalEquip is RMRKNestableExternalEquipImpl {
    
}
````

The `RMRKNestableExternalEquipImpl` implements all of the functionality of the `Nestable` RMRK lego block. It implements
minting and burning of the NFTs as well as setting the equippable address.

**WARNING: The `RMRKNestableExternalEquipImpl` only has minimal access control implemented. If you intend to use it, make
sure to define your own, otherwise your smart contracts are at risk of unexpected behaviour.**

The `constructor` to initialize the `RMRKNestableExternalEquipImpl` accepts the following arguments:

- `name_`: `string` type of argument specifying the name of the collection
- `symbol_`: `string` type of argument specifying the symbol of the collection
- `maxSupploy_`: `uint256` type of argument specifying the maximum amount of tokens in the collection
- `pricePerMint_`: `uint256` type of argument representing the price per mint in wei or the lowest denomination of a
native currency of the EVM to which the smart contract is deployed to
- `equippableAddress_`: `address` type of argument specifying the address of the `SimpleExternalEquip` smart contract
- `collectionMetadata_`: `string` type of argument specifying the metadata URI of the whole collection
- `tokenURI_`: `string` type of argument specifying the base URI of the token metadata
- `royaltyRecipient`: `address` type of argument specifying the address of the beneficiary of royalties
- `royaltyPercentageBps`: `uint256` type of argument specifying the royalty percentage in basis points

**NOTE: Basis points are the smallest supported denomination of percent. In our case this is one hundreth of a percent.
This means that 1 basis point equals 0.01% and 10000 basis points equal 100%. So for example, if you want to set royalty
percentage to 5%, the `royaltyPercentageBps` value should be 500.**

In order to properly initialize the inherited smart contract, our smart contract needs to accept the arguments,
mentioned above, in the `constructor` and pass them to the `RMRKNestableExternalEquipImpl`:

````solidity
    constructor(
        string memory name,
        string memory symbol,
        uint256 maxSupply,
        uint256 pricePerMint,
        address equippableAddress,
        string memory collectionMetadata,
        string memory tokenURI,
        address royaltyRecipient,
        uint256 royaltyPercentageBps
    ) RMRKNestableExternalEquipImpl(
        name,
        symbol,
        maxSupply,
        pricePerMint,
        equippableAddress,
        collectionMetadata,
        tokenURI,
        royaltyRecipient,
        royaltyPercentageBps
    ) {}
````

<details>
<summary>The <strong><i>SimpleNestableExternalEquip.sol</i></strong> should look like this:</summary>

````solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

import "@rmrk-team/evm-contracts/contracts/implementations/RMRKNestableExternalEquipImpl.sol";

contract SimpleNestableExternalEquip is RMRKNestableExternalEquipImpl {
    constructor(
        string memory name,
        string memory symbol,
        uint256 maxSupply,
        uint256 pricePerMint,
        address equippableAddress,
        string memory collectionMetadata,
        string memory tokenURI,
        address royaltyRecipient,
        uint256 royaltyPercentageBps
    ) RMRKNestableExternalEquipImpl(
        name,
        symbol,
        maxSupply,
        pricePerMint,
        equippableAddress,
        collectionMetadata,
        tokenURI,
        royaltyRecipient,
        royaltyPercentageBps
    ) {}
}
````

</details>

#### RMRKNestableExternalEquipImpl

Let's take a moment to examine the core of this implementation, the `RMRKNestableExternalEquipImpl`.

It uses the `RMRKNestableExternalEquip`, `RMRKRoyalties`, `RMRKCollectionMetadata` and `RMRKMintingUtils` smart contracts
from RMRK stack. To dive deeper into their operation, please refer to their respective documentation.

Two errors are defined:

````solidity
error RMRKMintUnderpriced();
error RMRKMintZero();
````

`RMRKMintUnderpriced()` is used when not enough value is used when attempting to mint a token and `RMRKMintZero()` is
used when attempting to mint 0 tokens.

**WARNING: The `RMRKMultiAssetImpl` only has minimal access control implemented. If you intend to use it, make sure
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

##### `nestMint`

The `nestMint` function is used to mint child NFTs to be owned by the parent NFT and accepts three arguments:

- `to`: `address` type of argument specifying the address of the smart contract to which the parent NFT belongs to
- `numToMint`: `uint256` type of argument specifying the amount of tokens to be minted
- `destinationId`: `uint256` type of argument specifying the ID of the parent NFT to which to mint the child NFT

The constraints of `nestMint` are similar to the ones set out for `mint` function.

##### `setEquippableAddress`

The `setEquippableAddress` function is used to set the address of a deployed `SimpleExternalEquip` smart contract and
accepts one argument:

- `equippable`: `address` type of argument specifying the address of a deployed `SimpleExternalEquip` smart contract

#### `tokenURI`

The `tokenURI` is used to retreive the metadata URI of the desired token and accepts one argument:

- `tokenId`: `uint256` type of argument representing the token ID of which we are retrieving the URI

#### `updateRoyaltyRecipient`

The `updateRoyaltyRecipient` function is used to update the royalty recipient and accepts one argument:

- `newRoyaltyRecipient`: `address` type of argument specifying the address of the new beneficiary recipient

### Deploy script

The deploy script for the simple `SplitEquippable` resides in the
[`deploySplitEquippable.ts`](../../scripts/deploySplitEquippable.ts).

The deploy script uses the `ethers`, `SimpleBase`, `SimpleEquippable`, `SimpleNestableExternalEquip`,
`RMRKEquipRenderUtils` and `ContractTransaction` imports. We will also define the `pricePerMint` constant, which will be
used to set the minting price of the tokens. The empty deploy script should look like this:

````typescript
import { ethers } from "hardhat";
import {
  SimpleBase,
  SimpleExternalEquip,
  SimpleNestableExternalEquip,
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
    SimpleNestableExternalEquip,
    SimpleExternalEquip,
    SimpleNestableExternalEquip,
    SimpleExternalEquip,
    SimpleBase,
    RMRKEquipRenderUtils
  ]
> {
  const [beneficiary] = await ethers.getSigners();
  const equipFactory = await ethers.getContractFactory("SimpleExternalEquip");
  const nestableFactory = await ethers.getContractFactory(
    "SimpleNestableExternalEquip"
  );
  const baseFactory = await ethers.getContractFactory("SimpleBase");
  const viewsFactory = await ethers.getContractFactory("RMRKEquipRenderUtils");

  const nestableKanaria: SimpleNestableExternalEquip =
    await nestableFactory.deploy(
      "Kanaria",
      "KAN",
      1000,
      pricePerMint,
      ethers.constants.AddressZero,
      "ipfs://collectionMeta",
      "ipfs://tokenMeta",
      await beneficiary.getAddress(),
      10
    );
  const nestableGem: SimpleNestableExternalEquip = await nestableFactory.deploy(
    "Gem",
    "GM",
    3000,
    pricePerMint,
    ethers.constants.AddressZero,
    "ipfs://collectionMeta",
    "ipfs://tokenMeta",
    await beneficiary.getAddress(),
    10
  );

  const kanariaEquip: SimpleExternalEquip = await equipFactory.deploy(
    nestableKanaria.address
  );
  const gemEquip: SimpleExternalEquip = await equipFactory.deploy(
    nestableGem.address
  );
  const base: SimpleBase = await baseFactory.deploy("KB", "svg");
  const views: RMRKEquipRenderUtils = await viewsFactory.deploy();

  await nestableKanaria.deployed();
  await kanariaEquip.deployed();
  await nestableGem.deployed();
  await gemEquip.deployed();
  await base.deployed();

  const allTx = [
    await nestableKanaria.setEquippableAddress(kanariaEquip.address),
    await nestableGem.setEquippableAddress(gemEquip.address),
  ];
  await Promise.all(allTx.map((tx) => tx.wait()));
  console.log(
    `Sample contracts deployed to ${nestableKanaria.address} (Kanaria Nestable) | ${kanariaEquip.address} (Kanaria Equip), ${nestableGem.address} (Gem Nestable) | ${gemEquip.address} (Gem Equip) and ${base.address} (Base)`
  );

  return [nestableKanaria, kanariaEquip, nestableGem, gemEquip, base, views];
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
Sample contracts deployed to 0x5FbDB2315678afecb367f032d93F642f64180aa3 (Kanaria Nestable) | 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0 (Kanaria Equip), 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512 (Gem Nestable) | 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9 (Gem Equip) and 0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9 (Base)
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
  SimpleNestableExternalEquip,
  RMRKEquipRenderUtils,
} from "../typechain-types";
import { ContractTransaction } from "ethers";

const pricePerMint = ethers.utils.parseEther("0.0001");

async function main() {
  const [nestableKanaria, kanariaEquip, nestableGem, gemEquip, base, views] =
    await deployContracts();
}

async function deployContracts(): Promise<
  [
    SimpleNestableExternalEquip,
    SimpleExternalEquip,
    SimpleNestableExternalEquip,
    SimpleExternalEquip,
    SimpleBase,
    RMRKEquipRenderUtils
  ]
> {
  const [beneficiary] = await ethers.getSigners();
  const equipFactory = await ethers.getContractFactory("SimpleExternalEquip");
  const nestableFactory = await ethers.getContractFactory(
    "SimpleNestableExternalEquip"
  );
  const baseFactory = await ethers.getContractFactory("SimpleBase");
  const viewsFactory = await ethers.getContractFactory("RMRKEquipRenderUtils");

  const nestableKanaria: SimpleNestableExternalEquip =
    await nestableFactory.deploy(
      "Kanaria",
      "KAN",
      1000,
      pricePerMint,
      ethers.constants.AddressZero,
      "ipfs://collectionMeta",
      "ipfs://tokenMeta",
      await beneficiary.getAddress(),
      10
    );
  const nestableGem: SimpleNestableExternalEquip = await nestableFactory.deploy(
    "Gem",
    "GM",
    3000,
    pricePerMint,
    ethers.constants.AddressZero,
    "ipfs://collectionMeta",
    "ipfs://tokenMeta",
    await beneficiary.getAddress(),
    10
  );

  const kanariaEquip: SimpleExternalEquip = await equipFactory.deploy(
    nestableKanaria.address
  );
  const gemEquip: SimpleExternalEquip = await equipFactory.deploy(
    nestableGem.address
  );
  const base: SimpleBase = await baseFactory.deploy("KB", "svg");
  const views: RMRKEquipRenderUtils = await viewsFactory.deploy();

  await nestableKanaria.deployed();
  await kanariaEquip.deployed();
  await nestableGem.deployed();
  await gemEquip.deployed();
  await base.deployed();

  const allTx = [
    await nestableKanaria.setEquippableAddress(kanariaEquip.address),
    await nestableGem.setEquippableAddress(gemEquip.address),
  ];
  await Promise.all(allTx.map((tx) => tx.wait()));
  console.log(
    `Sample contracts deployed to ${nestableKanaria.address} (Kanaria Nestable) | ${kanariaEquip.address} (Kanaria Equip), ${nestableGem.address} (Gem Nestable) | ${gemEquip.address} (Gem Equip) and ${base.address} (Base)`
  );

  return [nestableKanaria, kanariaEquip, nestableGem, gemEquip, base, views];
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

The `mintToken` function should accept two arguments (`SimpleNestableExternalEquip` of `Kanaria` and `Gem`). We will
prepare a batch of transactions to mint the tokens and send them. Once the tokens are minted, we will output the total
number of tokens minted. While the `Kanaria` tokens will be minted to the `owner` address, the `Gem` tokens will be
minted using the [`nestMint`](#nestMint) method in order to be minted directly to the Kanaria tokens. We will
mint three `Gem` tokens to each `Kanaria`. Since all of the nested tokens need to be approved, we will also build a
batch of transaction to accept a single nest-minted `Gem` for each `Kanaria`:

````typescript
async function mintTokens(
  kanaria: SimpleNestableExternalEquip,
  gem: SimpleNestableExternalEquip
): Promise<void> {
  const [owner] = await ethers.getSigners();

  // Mint some kanarias
  let tx = await kanaria.mint(owner.address, totalBirds, {
    value: pricePerMint.mul(totalBirds),
  });
  await tx.wait();
  console.log(`Minted ${totalBirds} kanarias`);

  // Mint 3 gems into each nestableKanaria
  let allTx: ContractTransaction[] = [];
  for (let i = 1; i <= totalBirds; i++) {
    let tx = await gem.nestMint(kanaria.address, 3, i, {
      value: pricePerMint.mul(3),
    });
    allTx.push(tx);
  }
  await Promise.all(allTx.map((tx) => tx.wait()));
  console.log(`Minted 3 gems into each nestableKanaria`);

  // Accept 3 gems for each kanaria
  console.log("Accepting Gems");
  for (let tokenId = 1; tokenId <= totalBirds; tokenId++) {
    allTx = [
      await kanaria.acceptChild(tokenId, 2, gem.address, 3 * tokenId),
      await kanaria.acceptChild(tokenId, 1, gem.address, 3 * tokenId - 1),
      await kanaria.acceptChild(tokenId, 0, gem.address, 3 * tokenId - 2),
    ];
  }
  await Promise.all(allTx.map((tx) => tx.wait()));
  console.log(`Accepted gems for each kanaria`);
}
````

In order for the `mintTokens` to be called, we have to add it to the `main` function:

````typescript
  await mintTokens(nestableKanaria, nestableGem);
````

Having minted both `Kanaria`s and `Gem`s, we can now add assets to them. The assets are added to the
`SimpleExternalEquip` parts of them. We will add assets to the `Kanaria` using the `addKanariaAssets` function.
It accepts `Kanaria` and address of the `Base` smart contract. Assets will be added using the
[`addAssetEntry`](#addassetentry) method. We will add a default asset, which doesn't need a `baseAddress`
value. The composed asset needs to have the `baseAddress`. We also specify the fixed parts IDs for background, head,
body and wings. Additionally we allow the gems to be equipped in the slot parts IDs. With the asset entires added,
we can add them to a token and then accept them as well:

````typescript
async function addKanariaAssets(
  kanaria: SimpleExternalEquip,
  baseAddress: string
): Promise<void> {
  const assetDefaultId = 1;
  const assetComposedId = 2;
  let allTx: ContractTransaction[] = [];
  let allTx: ContractTransaction[] = [];
  let tx = await kanaria.addAssetEntry(
    0, // Only used for assets meant to equip into others
    ethers.constants.AddressZero, // base is not needed here
    "ipfs://default.png",
    [],
    []
  );
  allTx.push(tx);

  tx = await kanaria.addAssetEntry(
    0, // Only used for assets meant to equip into others
    baseAddress, // Since we're using parts, we must define the base
    "ipfs://meta1.json",
    [1, 3, 5, 7], // We're using first background, head, body and wings
    [9, 10, 11] // We state that this can receive the 3 slot parts for gems
  );
  allTx.push(tx);
  // Wait for both assets to be added
  await Promise.all(allTx.map((tx) => tx.wait()));
  console.log("Added 2 asset entries");

  // Add assets to token
  const tokenId = 1;
  allTx = [
    await kanaria.addAssetToToken(tokenId, assetDefaultId, 0),
    await kanaria.addAssetToToken(tokenId, assetComposedId, 0),
  ];
  await Promise.all(allTx.map((tx) => tx.wait()));
  console.log("Added assets to token 1");

  // Accept both assets:
  tx = await kanaria.acceptAsset(tokenId, 0, assetDefaultId);
  await tx.wait();
  tx = await kanaria.acceptAsset(tokenId, 0, assetComposedId);
  await tx.wait();
  console.log("Assets accepted");
}
````

Adding assets to `Gem`s is done in the `addGemAssets`. It accepts `SimpleExternalEquip` part of `Gem`, address of
the `SimpleExternalEquip` of `Kanaria` smart contract and the address of the `Base` smart contract. We will add 4
assets for each gem; one full version and three that match each slot. Reference IDs are specified for easier
reference from the child's perspective. The assets will be added one by one. Note how the full versions of gems
don't have the `equippableRefId`.

Having added the asset entries, we can now add the valid parent reference IDs using the
`setValidParentForEquippableGroup`. For example if we want to add a valid reference for the left gem, we need to pass
the value of equippable reference ID of the left gem, parent smart contract address (in our case this is
`SimpleExternalEquip` of `Kanaria` smart contract) and ID of the slot which was defined in `Base` (this is ID number 9
in the `Base` for the left gem).

Last thing to do is to add assets to the tokens using [`addAssetToToken`](#addassettotoken). Asset of type
A will be added to the gems 1 and 2, and the type B of the asset is added to gem 3. All of these should be accepted
using `acceptAsset`:

````typescript
async function addGemAssets(
  gem: SimpleExternalEquip,
  kanariaAddress: string,
  baseAddress: string
): Promise<void> {
  // We'll add 4 assets for each nestableGem, a full version and 3 versions matching each slot.
  // We will have only 2 types of gems -> 4x2: 8 assets.
  // This is not composed by others, so fixed and slot parts are never used.
  const gemVersions = 4;

  // These refIds are used from the child's perspective, to group assets that can be equipped into a parent
  // With it, we avoid the need to do set it asset by asset
  const equippableRefIdLeftGem = 1;
  const equippableRefIdMidGem = 2;
  const equippableRefIdRightGem = 3;

  // We can do a for loop, but this makes it clearer.
  let allTx = [
    await gem.addAssetEntry(
      // Full version for first type of gem, no need of refId or base
      0,
      baseAddress,
      `ipfs://gems/typeA/full.svg`,
      [],
      []
    ),
    await gem.addAssetEntry(
      // Equipped into left slot for first type of gem
      equippableRefIdLeftGem,
      baseAddress,
      `ipfs://gems/typeA/left.svg`,
      [],
      []
    ),
    await gem.addAssetEntry(
      // Equipped into mid slot for first type of gem
      equippableRefIdMidGem,
      baseAddress,
      `ipfs://gems/typeA/mid.svg`,
      [],
      []
    ),
    await gem.addAssetEntry(
      // Equipped into left slot for first type of gem
      equippableRefIdRightGem,
      baseAddress,
      `ipfs://gems/typeA/right.svg`,
      [],
      []
    ),
    await gem.addAssetEntry(
      // Full version for second type of gem, no need of refId or base
      0,
      ethers.constants.AddressZero,
      `ipfs://gems/typeB/full.svg`,
      [],
      []
    ),
    await gem.addAssetEntry(
      // Equipped into left slot for second type of gem
      equippableRefIdLeftGem,
      baseAddress,
      `ipfs://gems/typeB/left.svg`,
      [],
      []
    ),
    await gem.addAssetEntry(
      // Equipped into mid slot for second type of gem
      equippableRefIdMidGem,
      baseAddress,
      `ipfs://gems/typeB/mid.svg`,
      [],
      []
    ),
    await gem.addAssetEntry(
      // Equipped into right slot for second type of gem
      equippableRefIdRightGem,
      baseAddress,
      `ipfs://gems/typeB/right.svg`,
      [],
      []
    ),
  ];

  await Promise.all(allTx.map((tx) => tx.wait()));
  console.log(
    "Added 8 nestableGem assets. 2 Types of gems with full, left, mid and right versions."
  );

  // 9, 10 and 11 are the slot part ids for the gems, defined on the base.
  // e.g. Any asset on nestableGem, which sets its equippableGroupId to equippableRefIdLeftGem
  //      will be considered a valid equip into any nestableKanaria on slot 9 (left nestableGem).
  allTx = [
    await gem.setValidParentForEquippableGroup(equippableRefIdLeftGem, kanariaAddress, 9),
    await gem.setValidParentForEquippableGroup(equippableRefIdMidGem, kanariaAddress, 10),
    await gem.setValidParentForEquippableGroup(equippableRefIdRightGem, kanariaAddress, 11),
  ];
  await Promise.all(allTx.map((tx) => tx.wait()));

  // We add assets of type A to nestableGem 1 and 2, and type Bto nestableGem 3. Both are nested into the first nestableKanaria
  // This means gems 1 and 2 will have the same asset, which is totally valid.
  allTx = [
    await gem.addAssetToToken(1, 1, 0),
    await gem.addAssetToToken(1, 2, 0),
    await gem.addAssetToToken(1, 3, 0),
    await gem.addAssetToToken(1, 4, 0),
    await gem.addAssetToToken(2, 1, 0),
    await gem.addAssetToToken(2, 2, 0),
    await gem.addAssetToToken(2, 3, 0),
    await gem.addAssetToToken(2, 4, 0),
    await gem.addAssetToToken(3, 5, 0),
    await gem.addAssetToToken(3, 6, 0),
    await gem.addAssetToToken(3, 7, 0),
    await gem.addAssetToToken(3, 8, 0),
  ];
  await Promise.all(allTx.map((tx) => tx.wait()));
  console.log("Added 4 assets to each of 3 gems.");

  // We accept each asset for all gems
  allTx = [
    await gem.acceptAsset(1, 3, 4),
    await gem.acceptAsset(1, 2, 3),
    await gem.acceptAsset(1, 1, 2),
    await gem.acceptAsset(1, 0, 1),
    await gem.acceptAsset(2, 3, 4),
    await gem.acceptAsset(2, 2, 3),
    await gem.acceptAsset(2, 1, 2),
    await gem.acceptAsset(2, 0, 1),
    await gem.acceptAsset(3, 3, 8),
    await gem.acceptAsset(3, 2, 7),
    await gem.acceptAsset(3, 1, 6),
    await gem.acceptAsset(3, 0, 5),
  ];
  await Promise.all(allTx.map((tx) => tx.wait()));
  console.log("Accepted 4 assets to each of 3 gems.");
}
````

In order for the `addKanariaAssets` and `addGemAssets` to be called, we have to add them to the `main` function:

````typescript
  await addKanariaAssets(kanariaEquip, base.address);
  await addGemAssets(gemEquip, kanariaEquip.address, base.address);
````

With `Kanaria`s and `Gem`s ready, we can equip the gems to Kanarias using the `equipGems` function. We will build a
batch of `equip` transactions calling the `SimpleExternalEquip` of the `Kanaria` and send it all at once:

````typescript
async function equipGems(kanariaEquip: SimpleExternalEquip): Promise<void> {
  const allTx = [
    await kanaria.equip({
      tokenId: 1, // Kanaria 1
      childIndex: 2, // Gem 1 is on position 2
      assetId: 2, // Asset for the kanaria which is composable
      slotPartId: 9, // left gem slot
      childAssetId: 2, // Asset id for child meant for the left gem
    }),
    await kanaria.equip({
      tokenId: 1, // Kanaria 1
      childIndex: 1, // Gem 2 is on position 1
      assetId: 2, // Asset for the kanaria which is composable
      slotPartId: 10, // mid gem slot
      childAssetId: 3, // Asset id for child meant for the mid gem
    }),
    await kanaria.equip({
      tokenId: 1, // Kanaria 1
      childIndex: 0, // Gem 3 is on position 0
      assetId: 2, // Asset for the kanaria which is composable
      slotPartId: 11, // right gem slot
      childAssetId: 8, // Asset id for child meant for the right gem
    }),
  ];
  await Promise.all(allTx.map((tx) => tx.wait()));
  console.log("Equipped 3 gems into first nestableKanaria");
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
  const assetId = 2;
  console.log(
    "Composed: ",
    await views.composeEquippables(kanariaAddress, tokenId, assetId)
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
Minted 3 gems into each nestableKanaria
Accepted 1 nestableGem for each nestableKanaria
Accepted 1 nestableGem for each nestableKanaria
Accepted 1 nestableGem for each nestableKanaria
Added 2 asset entries
Added assets to token 1
Assets accepted
Added 8 nestableGem assets. 2 Types of gems with full, left, mid and right versions.
Added 4 assets to each of 3 gems.
Accepted 4 assets to each of 3 gems.
Equipped 3 gems into first nestableKanaria
Composed:  [
  [
    BigNumber { value: "2" },
    BigNumber { value: "0" },
    '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
    'ipfs://meta1.json',
    id: BigNumber { value: "2" },
    equippableGroupId: BigNumber { value: "0" },
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
      childAssetId: BigNumber { value: "2" },
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
      childAssetId: BigNumber { value: "3" },
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
      childAssetId: BigNumber { value: "8" },
      z: 4,
      childTokenId: BigNumber { value: "3" },
      childAddress: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
      metadataURI: ''
    ]
  ],
  asset: [
    BigNumber { value: "2" },
    BigNumber { value: "0" },
    '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
    'ipfs://meta1.json',
    id: BigNumber { value: "2" },
    equippableGroupId: BigNumber { value: "0" },
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
      childAssetId: BigNumber { value: "2" },
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
      childAssetId: BigNumber { value: "3" },
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
      childAssetId: BigNumber { value: "8" },
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

## Advanced SplitEqiuppable

The advanced `SplitEquippable` consists of three smart contracts. The
[`AdvancedBase`](../MergedEquippable/README.md#advancedbase) is already examined in the `MergedEquippable`
documentation. Let's first examine the `AdvancedExternalEquip` and then move on to the `AdvancedNestableExternalEquip`.

**NOTE: As the `AdvancedBase` smart contract is used by both `MergedEquippable` as well as `SplitEquippable` it resides
in the root `contracts/` directory.**

### AdvancedExternalEquip

The [`AdvancedExternalEquip.sol`](./AdvancedExternalEquip.sol) smart contract represents the minimum required
implementation in order for the smart contract to be compatible with the `MultiAsset` and `Equippable` part of the
`ExternalEquip` RMRK lego composite. It uses the
[`RMRKExternalEquip`](https://github.com/rmrk-team/evm/blob/dev/contracts/RMRK/equippable/RMRKExternalEquip.sol) import
to gain access to the `MultiAsset` and `Equippable` part of the External equippable RMRK lego composite:

````solidity
import "@rmrk-team/evm-contracts/contracts/RMRK/equippable/RMRKExternalEquip.sol";
````

We only need the `nestableAddress`, which is the address of the deployed `AdvancedNestableExternalEquip` smart contract,
in order to properly initialize it after the `AdvancedExternalEquip` inherits it:

````solidity
contract AdvancedExternalEquip is RMRKExternalEquip {
    constructor(
        address nestableAddress
    )
        RMRKExternalEquip(nestableAddress)
    {
        // Custom optional: constructor logic
    }
}
````

**NOTE: Passing `0x0` as the value of `nestableAddress` allows us to initialize the smart contract without having the
addeess of the deployed `AdvancedExternalEquip` and allows us to add it at a later point in time.**

This is all that is required to get you started with implementing the `MultiAsset` and `Equippable` parts of the
external equippable RMRK lego composite.

<details>
<summary>The minimal <strong><i>AdvancedExternalEquip.sol</i></strong> should look like this:</summary>

````solidity
// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.16;

import "@rmrk-team/evm-contracts/contracts/RMRK/equippable/RMRKExternalEquip.sol";

/* import "hardhat/console.sol"; */

contract AdvancedExternalEquip is RMRKExternalEquip {
    constructor(
        address nestableAddress
    )
        RMRKExternalEquip(nestableAddress)
    {
        // Custom optional: constructor logic
    }
}
````

</details>

Using `RMRKExternalEquip` requires custom implementation of asset management logic. Available internal functions when writing it are:

- `_setNestableAddress(address nestableAddress)`
- `_addAssetEntry(ExtendedAsset calldata asset, uint64[] calldata fixedPartIds, uint64[] calldata slotPartIds)`
- `_addAssetToToken(uint256 tokenId, uint64 assetId, uint64 overwrites)`
- `_setValidParentForEquippableGroup(uint64 equippableGroupId, address parentAddress, uint64 slotPartId)`

### AdvancedNestableExternalEquip

The [`AdvancedNestableExternalEquip`](./AdvancedNestableExternalEquip.sol) smart contracts represents the minimum required
implementation in order for the smart contract to be compatible with the `Nestable` part of the `ExternalEquip` RMRK lego
composite. It uses the
[`RMRKNestableExternalEquip`](https://github.com/rmrk-team/evm/blob/dev/contracts/RMRK/equippable/RMRKNestableExternalEquip.sol)
import to gain access to the `Nestable` part of the External equippable RMRK lego composite:

````solidity
import "@rmrk-team/evm-contracts/contracts/RMRK/equippable/RMRKNestableExternalEquip.sol";
````

We only need the `name` and `symbol` of the NFT collection in order to properly initialize it after the
`AdvancedNestableExternalEquip` inherits it:

````solidity
contract AdvancedNestableExternalEquip is RMRKNestableExternalEquip {
    constructor(
        string memory name,
        string memory symbol
    )
        RMRKNestableExternalEquip(name, symbol)
    {
        // Custom optional: constructor logic
    }
}
````

This is all that is required to get you started with implementing the `Nestable` part of the external equippable RMRK lego composite.

<details>
<summary>The minimal <strong><i>AdvancedNestableExternalEquip.sol</i></strong> should look like this:</summary>

````solidity
// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.16;

import "@rmrk-team/evm-contracts/contracts/RMRK/equippable/RMRKNestableExternalEquip.sol";

contract AdvancedNestableExternalEquip is RMRKNestableExternalEquip {
    constructor(
        string memory name,
        string memory symbol
    )
        RMRKNestableExternalEquip(name, symbol)
    {
        // Custom optional: constructor logic
    }
}
````

</details>

Using `RMRKNestableExternalEquip`requires custom implementation of minting logic. Available internal functions to use when writing it are:

- `_mint(address to, uint256 tokenId)`
- `_safeMint(address to, uint256 tokenId)`
- `_safeMint(address to, uint256 tokenId, bytes memory data)`
- `_nestMint(address to, uint256 tokenId, uint256 destinationId)`

The latter is used to nest mint the NFT directly to the parent NFT. If you intend to support it at the minting stage,
you should implement it in your smart contract.

In addition to the minting functions, you should also implement the burning and transfer functions if they apply to your
use case:

- `_burn(uint256 tokenId)`
- `transferFrom(address from, address to, uint256 tokenId)`
- `nestTransfer(address from, address to, uint256 tokenId, uint256 destinationId)`

It is also important to implement the function for setting the address of the deployed `AdvancedExternalEquip`:

- `_setEquippableAddress(address equippable)`

Any additional function supporting your NFT use case and utility can also be added. Remember to thoroughly test your
smart contracts with extensive test suites and define strict access control rules for the functions that you implement.

Happy equipping! 🛠