# MergedEquippable

The `MergedEquippable` composite of RMRK legos uses both the [`Nestable`](../Nestable/README.md) and
[`MultiAsset`](../MultiAsset/README.md) RMRK legos as well as the `Equippable` lego. In addition to these three
RMRK legos, it also requires the `Base` RMRK lego. Let's first examine the `Base` RMRK lego and then the `Equippable`
one.

#### Base

A *Base* can be considered a catalogue of parts from which an NFT can be composed. Parts can be either of the slot type
or fixed type. Slots are intended for equippables.

**NOTE: Bases are used through assets. Assets can cherry pick from the list of parts within the base, they can
also define the slots they are allowed to receive.**

Bases can be of different media types.

The base's type indicates what the final output of an NFT will be when this asset is being rendered. Supported types
are PNG, SVG, audio, video, even mixed.

#### Equippable

Equippables are NFTs that can be equipped in the before metioned slots. They have a set format and predefined space in
the parent NFT.

Assets that can be equipped into a slot each have a reference ID. The reference ID can be used to specify which
parent NFT the group of assets belonging to a specific reference ID can be equipped to. Additionally slots can
specify which collection can be used within it or to allow any collection to be equipped into it.

Each slot of the NFT can have a predefined collection of allowed NFT collections to be equipped to this slot.

## Abstract

In this tutorial we will examine the MergedEquippable composite of RMRK blocks:

- [SimpleEquippable](./SimpleEquippable.sol) and [SimpleBase](../SimpleBase.sol) work together to showcase the minimal
implementation of the MergedEquippable RMRK lego composite.
- [AdvancedEquippable](./AdvancedEquippable.sol) and [AdvancedBase](../AdvancedBase.sol) work together to showcase a more
customizable implementation of the MergedEquippable RMRK lego composite.

Let's first examine the simple, minimal, implementation and then move on to the advanced one.

## Simple MergedEquippable

The simple `MergedEquippable` consists of two smart contracts. Let's first examine the `SimpleBase` smart contract and
then move on to the `SimpleEquippable`.

### SimpleBase

**NOTE: As the `SimpleBase` smart contract is used by both `MergedEquippable` as well as `SplitEquippable` it resides
in the root `contracts/` directory.**

The `SimpleBase` example uses the
[`RMRKBaseStorageImpl`](https://github.com/rmrk-team/evm/blob/dev/contracts/implementations/RMRKBaseStorageImpl.sol). It
is used by importing it using the `import` statement below the `pragma` definition:

````solidity
import "@rmrk-team/evm-contracts/contracts/implementations/RMRKBaseStorageImpl.sol";
````

Once the `RMRKBaseStorageImpl.sol` is imported into out file, we can set the inheritance of our smart contract:

````solidity
contract SimpleBase is RMRKBaseStorageImpl {

}
````

The `RMRKBaseStorageImpl` implements all of the required functionality of the Base RMRK lego. It implements adding of
parts and equippable addresses as well as managing the equippables.

**WARNING: The `RMRKBaseStorageImpl` only has minimal access control implemented. If you intend to use it, make sure to
define your own, otherwise your smart contracts are at risk of unexpected behaviour.**

The `constructor` to initialize the `RMRKBaseStorageImpl` accepts the following arguments:

- `symbol_`: `string` type of argument representing the symbol if the base lego
- `type_`: `string` type of argument representing the type of the base lego

In order to properly initialize the inherited smart contract, our smart contract needs to accept the arguments, mentioned
above, in the `constructor` and pass them to `RMRKBaseStorageImpl`:

````solidity
    constructor(
        string memory symbol,
        string memory type_
    ) RMRKBaseStorageImpl(symbol, type_) {}
````

<details>
<summary>The <strong><i>SimpleBase.sol</i></strong> should look like this:</summary>

````solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

import "@rmrk-team/evm-contracts/contracts/implementations/RMRKBaseStorageImpl.sol";

contract SimpleBase is RMRKBaseStorageImpl {
    // NOTE: Additional custom arguments can be added to the constructor based on your needs.
    constructor(
        string memory symbol,
        string memory type_
    ) RMRKBaseStorageImpl(symbol, type_) {}
}
````

</details>

#### RMRKBaseStorageImpl

Let's take a moment to examine the core of this implementation, the `RMRKBaseStorageImpl`.

It uses the `RMRKBaseStorage` and `OwnableLock` smart contracts from `RMRK` stack. To dive deeper into their operation,
please refer to their respective documentation.

The following functions are available:

##### `addPart`

The `addPart` function is used to add a single base item entry and accept one argument:

- `intakeStruct`: `struct` type of argument used to pass the values of the part to be base item entry to be added. It
consists of:
    - `partId`: `uint64` type of argument specifying the ID of the entry we want to add
    - `part`: `struct` type of argument defining the RMRK base item. It consists of:
        - `itemType`: `enum` type of argument defining the type of the item. The possible values are:
            - `None`
            - `Slot`
            - `Fixed`
        - `z`: `uint8` type of argument specifying the layer the visual should appear in on the SVG base
        - `equippable`: `address[]` type of argument specifying the addresses of the collections that can equip this
        part
        - `metadataURI`: `string` type of argument specifying the metadata URI of the part

The `intakeStruct` should look something like this:

````json
[
    partID,
    [
        itemType,
        z,
        [
            permittedCollectionAddress0,
            permittedCollectionAddress1,
            permittedCollectionAddress2
        ],
        metadataURI
    ]
]
````

##### `addPartList`

The `addPartList` function is used to add a batch of base items entries and accepts an array of `IntakeStruct`s
described above. So an example of two IntakeStructs that would be passed to the function is:

````json
[
    [
        partID0,
        [
            itemType,
            z,
            [
                permittedCollectionAddress0,
                permittedCollectionAddress1,
                permittedCollectionAddress2
            ],
            metadataURI
        ]
    ],
    [
        partID1,
        [
            itemType,
            z,
            [
                permittedCollectionAddress0,
                permittedCollectionAddress1,
                permittedCollectionAddress2
            ],
            metadataURI
        ]
    ]
]
````

##### `addEquippableAddresses`

The `addEquippableAddresses` function is used to add a number of equippable addresses to a single base entry. These
define the collections that are allowed to be equipped in place of the base entry. It accepts two arguments:

- `partId`: `uint64` type of argument specifying the ID of the part that we are adding the equippable addresses to.
Only parts of slot type are valid.
- `equippableAddresses`: `address[]` type of argument specifying the array of addresses of the collections that may
equip this part

##### `setEquippableAddresses`

The `setEquippableAddreses` function is used to update the equippable addresses of a single base entry. 
Using it overwrites the currently set equippable addresses. It accepts two arguments:

- `partId`: `uint64` type of argument specifying the ID of the part that we are setting the equippable addresses for.
Only parts of slot type are valid.
- `equippableAddresses`: `address[]` type of argument specifying the array of addresses of the collections that may
equip this part

##### `setEquippableToAll`

The `setEquippableToAll` function is used to set the desired entry as equippable to any collection and accepts one
argument:

- `partId`: `uint64` type of argument specifying which base entry we want to set as being equippable to any collection

##### `resetEquippableAddresses`

The `resetEquippableAddresses` function is used to remove all of the entries allowing for the entry to be equipped and
accepts one argument:

- `partId`: `uint64` type of argument specifying which part we want to remove the equippable addresses from. Only
parts of slot type are valid.

### SimpleEquippable

The `SimpleEquippable` example uses the
[`RMRKEquippableImpl`](https://github.com/rmrk-team/evm/blob/dev/contracts/implementations/RMRKEquippableImpl.sol). It
is used by importing it using the `import` statement below the `pragma` definition: 

````solidity
import "@rmrk-team/evm-contracts/contracts/implementations/RMRKEquippableImpl.sol";
````

The [`RMRKEquipRenderUtils`](https://github.com/rmrk-team/evm/blob/dev/contracts/RMRK/utils/RMRKEquipRenderUtils.sol) is
imported in the same manner, but only so that we can use it within the user journey script:

````solidity
import "@rmrk-team/evm-contracts/contracts/RMRK/utils/RMRKEquipRenderUtils.sol";
````

Once both are imported, we can set the inheritance of our smart contract for the `RMRKEquippableImpl.sol`:

````solidity
contract SimpleEquippable is RMRKEquippableImpl {

}
````

The `RMRKEquippableImpl` implements all of the required functionality of the MergedEquippable RMRK lego composite. It
implements minting, burning and asset management.

**WARNING: The `RMRKEquippableImpl` only has minimal access control implemented. If you intend to use it, make sure to
define your own, otherwise your smart contracts are at risk of unexpected behaviour.**

The `constructor` to initialize the `RMRKEquippableImpl` accepts the following arguments:

- `name`: `string` type of argument specifying the name of the collection
- `symbol`: `string` type of argument specifying the symbol of the collection
- `maxSupply`: `uint256` type of argument specifying the maximum amount of tokens in the collection
- `pricePerMint`: `uint256` type of argument specifying the price per the NFT mint. It is expressed in `wei` or minimum
denomination of the native currency of the EVM to which the smart contract is deployed to
- `collectionMetadata`: `string` type of argument specifying the metadata URI of the whole collection
- `tokenURI`: `string` type of argument specifying the base URI of the token metadata
- `royaltyRecipient`: `address` type of argument specifying the address of the beneficiary of royalties
- `royaltyPercentageBps`: `uint256` type of argument specifying the royalty percentage in basis points

**NOTE: Basis points are the smallest supported denomination of percent. In our case this is one hundreth of a percent.
This means that 1 basis point equals 0.01% and 10000 basis points equal 100%. So for example, if you want to set royalty
percentage to 5%, the `royaltyPercentageBps` value should be 500.**

In order to properly initiate the inherited smart contract, our smart contract needs to accept the arguments, mentioned
above, in the `constructor` and pass them to the `RMRKEquippableImpl`:

````solidity
    constructor(
        string memory name,
        string memory symbol,
        uint256 maxSupply,
        uint256 pricePerMint,
        string memory collectionMetadata,
        string memory tokenURI,
        address royaltyRecipient,
        uint256 royaltyPercentageBps
    ) RMRKEquippableImpl(
        name,
        symbol,
        maxSupply,
        pricePerMint,
        collectionMetadata,
        tokenURI,
        royaltyRecipient,
        royaltyPercentageBps
    ) {}
````

<details>
<summary>The <strong><i>SimpleEquippable.sol</i></strong> should look like this:</summary>

````solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

import "@rmrk-team/evm-contracts/contracts/implementations/RMRKEquippableImpl.sol";
import "@rmrk-team/evm-contracts/contracts/RMRK/utils/RMRKEquipRenderUtils.sol";

contract SimpleEquippable is RMRKEquippableImpl {
    // NOTE: Additional custom arguments can be added to the constructor based on your needs.
    constructor(
        string memory name,
        string memory symbol,
        uint256 maxSupply,
        uint256 pricePerMint,
        string memory collectionMetadata,
        string memory tokenURI,
        address royaltyRecipient,
        uint256 royaltyPercentageBps
    ) RMRKEquippableImpl(
        name,
        symbol,
        maxSupply,
        pricePerMint,
        collectionMetadata,
        tokenURI,
        royaltyRecipient,
        royaltyPercentageBps
    ) {}
}
````

</details>

#### RMRKEquippableImpl

Let's take a moment to examine the core of this implementation, the `RMRKEquippableImpl`.

It uses the `RMRKEquippable`, `RMRKRoyalties`, `RMRKCollectionMetadata` and `RMRKMintingUtils` smart contracts from
`RMRK` stack. to dive deeper into their operation, please refer to their respective documentation.

Two errors are defined:

````solidity
error RMRKMintUnderpriced();
error RMRKMintZero();
````

`RMRKMintUnderpriced()` is used when not enough value is used when attempting to mint a token and `RMRKMintZero()` is
used when attempting to mint 0 tokens.

##### `mint`

The `mint` function is used to mint parent NFTs and accepts two arguments:

- `to`: `address` type of argument that specifies who should receive the newly minted tokens
- `numToMint`: `uint256` type of argument that specifies how many tokens should be minted

There are a few constraints to this function:

- after minting, the total number of tokens should not exceed the maximum allowed supply
- attempting to mint 0 tokens is not allowed as it makes no sense to pay for the gas without any effect
- value should accompany transaction equal to a price per mint multiplied by the `numToMint`
- function can only be called while the sale is still open

##### `nestMint`

The `nestMint` function is used to mint child NFTs to be owned by the parent NFT and accepts three arguments:

- `to`: `address` type of argument specifying the address of the smart contract to which the parent NFT belongs to
- `numToMint`: `uint256` type of argument specifying the amount of tokens to be minted
- `destinationId`: `uint256` type of argument specifying the ID of the parent NFT to which to mint the child NFT

The constraints of `nestMint` are similar to the ones set out for `mint` function.

##### `addAssetToToken`

The `addAssetToToken` is used to add a new asset to the token and accepts three arguments:

- `tokenId`: `uint256` type of argument specifying the ID of the token we are adding asset to
- `assetId`: `uint64` type of argument specifying the ID of the asset we are adding to the token
- `overwrites`: `uint64` type of argument specifying the ID of the asset we are owerwriting with the desired asset

##### `addAssetEntry`

The `addAssetEntry` is used to add a new asset of the collection and accepts three arguments:

- `asset`: `string` type of argument specifying the `ExtendedAsset` structure. It consists of:
    - `id`: `uint64` type of argument specifying the ID of this asset
    - `equippableGroupId`: `uint64` type of argument specifying the ID of the group this asset belongs to. This ID
    can then be referenced in the `setValidParentRefId` in order to allow every asset with this equippable
    reference ID to be equipped into an NFT
    - `baseAddress`: `address` type of argument specifying the address of the Base smart contract
    - `metadataURI`: `string` type of argument specifying the URI of the asset
- `fixedPartIds`: `uint64[]` type of argument specifying the fixed parts IDs for this asset
- `slotPartIds`: `uint64[]` type of argument specifying the slot parts IDs for this asset

##### `setValidParentForEquippableGroup`

The `setValidParentForEquippableGroup` is used to declare which group of assets are equippable into the parent
address at the given slot and accepts three arguments:

- `equippableGroupId`: `uint64` type of argument specifying the group of assets that can be equipped
- `parentAddress`: `address` type of argument specifying the address into which the asset is equippable
- `partId`: `uint64` type of argument specifying the ID of the part it can be equipped to

#### `totalAssets`

The `totalAssets` is used to retrieve a total number of assets defined in the collection.

#### `tokenURI`

The `tokenURI` is used to retreive the metadata URI of the desired token and accepts one argument:

- `tokenId`: `uint256` type of argument representing the token ID of which we are retrieving the URI

#### `updateRoyaltyRecipient`

The `updateRoyaltyRecipient` function is used to update the royalty recipient and accepts one argument:

- `newRoyaltyRecipient`: `address` type of argument specifying the address of the new beneficiary recipient

### Deploy script

The deploy script for the simple `MergedEquippable` resides in the
[`deployEquippable.ts`](../../scripts/deployEquippable.ts).

The deploy script uses the `ethers`, `SimpleBase`, `SimpleEquippable`, `RMRKEquipRenderUtils` and `ContractTransaction`
imports. We will also define the `pricePerMint` constant, which will be used to set the minting price of the tokens.
The empty deploy script should look like this:

````typescript
import { ethers } from "hardhat";
import {
  SimpleBase,
  SimpleEquippable,
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
function. In it we will deploy two `SimpleEquippable` smart contracts, one `SimpleBase` smart contract and a
`RMRKEquipRenderUtils` smart contract. Once the smart contracts are deployed, we will output their addresses. The
function is defined below the `main` function definition:

````typescript
async function deployContracts(): Promise<
  [SimpleEquippable, SimpleEquippable, SimpleBase, RMRKEquipRenderUtils]
> {
  console.log("Deploying smart contracts");

  const [beneficiary] = await ethers.getSigners();
  const contractFactory = await ethers.getContractFactory("SimpleEquippable");
  const baseFactory = await ethers.getContractFactory("SimpleBase");
  const viewsFactory = await ethers.getContractFactory("RMRKEquipRenderUtils");

  const kanaria: SimpleEquippable = await contractFactory.deploy(
    "Kanaria",
    "KAN",
    1000,
    pricePerMint,
    "ipfs://collectionMeta",
    "ipfs://tokenMeta",
    await beneficiary.getAddress(),
    10
  );
  const gem: SimpleEquippable = await contractFactory.deploy(
    "Gem",
    "GM",
    3000,
    pricePerMint,
    "ipfs://collectionMeta",
    "ipfs://tokenMeta",
    await beneficiary.getAddress(),
    10
  );
  const base: SimpleBase = await baseFactory.deploy("KB", "svg");
  const views: RMRKEquipRenderUtils = await viewsFactory.deploy();

  await kanaria.deployed();
  await gem.deployed();
  await base.deployed();
  await views.deployed();
  console.log(
    `Sample contracts deployed to ${kanaria.address} (Kanaria), ${gem.address} (Gem) and ${base.address} (Base)`
  );

  return [kanaria, gem, base, views];
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
    "deploy-equippable": "hardhat run scripts/deployEquippable.ts"
  }
````

Using the script with `npm run deploy-equippable` should return the following output:

````shell
npm run deploy-equippable

> @rmrk-team/evm-contract-samples@0.1.0 deploy-equippable
> hardhat run scripts/deployEquippable.ts

Deploying smart contracts
Sample contracts deployed to 0x5FbDB2315678afecb367f032d93F642f64180aa3 (Kanaria), 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512 (Gem) and 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0 (Base)
````

### User journey

With the deploy script ready, we can examine how the journey of a user using merged equippable would look like.

The base of the user jourey script is the same as the deploy script, as we need to deploy the smart contract in order
to interact with it:

````typescript
import { ethers } from "hardhat";
import {
  SimpleBase,
  SimpleEquippable,
  RMRKEquipRenderUtils,
} from "../typechain-types";
import { ContractTransaction } from "ethers";

const pricePerMint = ethers.utils.parseEther("0.0001");

async function main() {
  const [kanaria, gem, base, views] = await deployContracts();
}

async function deployContracts(): Promise<
  [SimpleEquippable, SimpleEquippable, SimpleBase, RMRKEquipRenderUtils]
> {
  console.log("Deploying smart contracts");

  const [beneficiary] = await ethers.getSigners();
  const contractFactory = await ethers.getContractFactory("SimpleEquippable");
  const baseFactory = await ethers.getContractFactory("SimpleBase");
  const viewsFactory = await ethers.getContractFactory("RMRKEquipRenderUtils");

  const kanaria: SimpleEquippable = await contractFactory.deploy(
    "Kanaria",
    "KAN",
    1000,
    pricePerMint,
    "ipfs://collectionMeta",
    "ipfs://tokenMeta",
    await beneficiary.getAddress(),
    10
  );
  const gem: SimpleEquippable = await contractFactory.deploy(
    "Gem",
    "GM",
    3000,
    ,
    "ipfs://collectionMeta",
    "ipfs://tokenMeta",
    await beneficiary.getAddress(),
    10
  );
  const base: SimpleBase = await baseFactory.deploy("KB", "svg");
  const views: RMRKEquipRenderUtils = await viewsFactory.deploy();

  await kanaria.deployed();
  await gem.deployed();
  await base.deployed();
  console.log(
    `Sample contracts deployed to ${kanaria.address} (Kanaria), ${gem.address} (Gem) and ${base.address} (Base)`
  );

  return [kanaria, gem, base, views];
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
````

**NOTE: The scripts in these examples are being run in the Hardhat's emulated network. In order to use another, please
refer to (Hardhat's network documentation)[https://hardhat.org/hardhat-network/docs/overview#hardhat-network].**

Once the smart contracts are deployed, we can setup the Base. We will set it up have two fixed part options for
background, head, body and wings. Additionally we will add three slot options for gems. All of these will be added 
using the [`addPartList`](#addpartlist) method. The call together with encapsulating `setupBase` function should look
like this:

````typescript
async function setupBase(base: SimpleBase, gemAddress: string): Promise<void> {
  console.log("Setting up Base");
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

**NOTE: The `metadataURI` of a slot can be used to retrieve a fallback asset when no asset is equipped into it.**

Notice how the `z` value of the background is `0` and that of the head is `3`. Also note how the `itemType` value of
the `Slot` type of fixed items is `2` and that of equippable items is `1`. Additionally the `metadataURI` is usually
left blank for the equippables, but has to be set for the fixed items. The `equippable` values have to be set to the
gem smart contracts for the equippable items.

In order for the `setupBase` to be called, we have to add it to the `main` function:

````typescript
  await setupBase(base, gem.address);
````

With the Base set up, the tokens should now be minted. Both `Kanaria` and `Gem` tokens will be minted in the
`mintTokens`. To define how many tokens should be minted, `totalBirds` constant will be added below the `import`
statements:

````typescript
const totalBirds = 5;
````

The `mintToken` function should accept two arguments (`Kanaria` and `Gem`). We will prepare a batch of transactions to
mint the tokens and send them. Once the tokens are minted, we will output the total number of tokens minted. While the
`Kanaria` tokens will be minted to the `owner` address, the `Gem` tokens will be minted using the
[`nestMint`](#nestMint) method in order to be minted directly to the Kanaria tokens. We will mint three `Gem`
tokens to each `Kanaria`. Since all of the nested tokens need to be approved, we will also build a batch of transaction
to accept a single nest-minted `Gem` for each `Kanaria`:

````typescript
async function mintTokens(
  kanaria: SimpleEquippable,
  gem: SimpleEquippable
): Promise<void> {
  console.log("Minting tokens");
  const [owner] = await ethers.getSigners();

  // Mint some kanarias
  console.log("Minting Kanaria tokens");
  let tx = await kanaria.mint(owner.address, totalBirds, {
    value: pricePerMint.mul(totalBirds),
  });
  await tx.wait();
  console.log(`Minted ${totalBirds} kanarias`);

  // Mint 3 gems into each kanaria
  console.log("Nest-minting Gem tokens");
  let allTx: ContractTransaction[] = [];
  for (let i = 1; i <= totalBirds; i++) {
    let tx = await gem.nestMint(kanaria.address, 3, i, {
      value: pricePerMint.mul(3),
    });
    allTx.push(tx);
  }
  await Promise.all(allTx.map((tx) => tx.wait()));
  console.log(`Minted 3 gems into each kanaria`);

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
  await mintTokens(kanaria, gem);
````

Having minted both `Kanaria`s and `Gem`s, we can now add assets to them. We will add assets to the `Kanaria`
using the `addKanariaAssets` function. It accepts `Kanaria` and address of the `Base` smart contract. Assets will
be added using the [`addAssetEntry`](#addassetentry) method. We will add a default asset, which doesn't need a
`baseAddress` value. The composed asset needs to have the `baseAddress`. We also specify the fixed parts IDs for
background, head, body and wings. Additionally we allow the gems to be equipped in the slot parts IDs. With the
asset entires added, we can add them to a token and then accept them as well:

````typescript
async function addKanariaAssets(
  kanaria: SimpleEquippable,
  baseAddress: string
): Promise<void> {
  console.log("Adding Kanaria assets");
  const assetDefaultId = 1;
  const assetComposedId = 2;
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

Adding assets to `Gem`s is done in the `addGemAssets`. It accepts `Gem`, address of the `Kanaria` smart contract
and the address of the `Base` smart contract. We will add 4 assets for each gem; one full version and three that
match each slot. Reference IDs are specified for easier reference from the child's perspective. The assets will be
added one by one. Note how the full versions of gems don't have the `equippableGroupId`.

Having added the asset entries, we can now add the valid parent reference IDs using the
[`setValidParentForEquippableGroup`](#setvalidparentforequippablegroup). For example if we want to add a valid reference
for the left gem, we need to pass the value ofequippable reference ID of the left gem, parent smart contract address (in
our case this is `Kanaria` smart contract) and ID of the slot which was defined in `Base` (this is ID number 9 in the
`Base` for the left gem).

Last thing to do is to add assets to the tokens using [`addAssetToToken`](#addassettotoken). Asset of type
A will be added to the gems 1 and 2, and the type B of the asset is added to gem 3. All of these should be accepted
using `acceptAsset`:

````typescript
async function addGemAssets(
  gem: SimpleEquippable,
  kanariaAddress: string,
  baseAddress: string
): Promise<void> {
  console.log("Adding Gem assets");
  // We'll add 4 assets for each gem, a full version and 3 versions matching each slot.
  // We will have only 2 types of gems -> 4x2: 8 assets.
  // This is not composed by others, so fixed and slot parts are never used.
  const gemVersions = 4;

  // These refIds are used from the child's perspective, to group assets that can be equipped into a parent
  // With it, we avoid the need to do set it asset by asset
  const equippableRefIdLeftGem = 1;
  const equippableRefIdMidGem = 2;
  const equippableRefIdRightGem = 3;

  // We can do a for loop, but this makes it clearer.
  console.log("Adding asset entries");
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
    "Added 8 gem assets. 2 Types of gems with full, left, mid and right versions."
  );

  // 9, 10 and 11 are the slot part ids for the gems, defined on the base.
  // e.g. Any asset on gem, which sets its equippableRefId to equippableRefIdLeftGem
  //      will be considered a valid equip into any kanaria on slot 9 (left gem).
  console.log("Setting valid parent reference IDs");
  allTx = [
    await gem.setValidParentForEquippableGroup(equippableRefIdLeftGem, kanariaAddress, 9),
    await gem.setValidParentForEquippableGroup(equippableRefIdMidGem, kanariaAddress, 10),
    await gem.setValidParentForEquippableGroup(equippableRefIdRightGem, kanariaAddress, 11),
  ];
  await Promise.all(allTx.map((tx) => tx.wait()));

  // We add assets of type A to gem 1 and 2, and type Bto gem 3. Both are nested into the first kanaria
  // This means gems 1 and 2 will have the same asset, which is totally valid.
  console.log("Add assets to tokens");
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
  await addKanariaAssets(kanaria, base.address);
  await addGemAssets(gem, kanaria.address, base.address);
````

With `Kanaria`s and `Gem`s ready, we can equip the gems to Kanarias using the `equipGems` function. We will build a
batch of `equip` transactions and then send them one after the other:

````typescript
async function equipGems(kanaria: SimpleEquippable): Promise<void> {
  console.log("Equipping gems");
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
  console.log("Equipped 3 gems into first kanaria");
}
````

In order for the `equipGems` to be called, we have to add it to the `main` function:

````typescript
  await equipGems(kanaria);
````

Last thing to do is to compose the equippables with the `composeEquippables` function. It composes the whole NFT along
with the nested and equipped parts:

````typescript
async function composeEquippables(
  views: RMRKEquipRenderUtils,
  kanariaAddress: string
): Promise<void> {
  console.log("Composing equippables");
  const tokenId = 1;
  const assetId = 2;
  console.log(
    "Composed: ",
    await views.composeEquippables(kanariaAddress, tokenId, assetId)
  );
}
````

**NOTE: Using `RMRKEquipRenderUtils` is not required for Equippable to work, it just provides a dedicated utility for
easier viewing of the full composites.**

In order for the `composeEquippables` to be called, we have to add it to the `main` function:

````typescript
  await composeEquippables(views, kanaria.address);
````

There is another possibility for the user journey script to go. Instead of deploying the smart contracts, we can
retrieve the already deployed ones and use those in it. To do that, we can define the addresses of the smart contracts
below the `import` statements:

````typescript
const deployedKanariaAddress = "";
const deployedGemAddress = "";
const deployedBaseAddress = "";
const deployedViewsAddress = "";
````

**NOTE: The empty string should be replaced with the actual addresses if you intend to use this option.**

A function to retrieve the smart contracts is called `retrieveContracts` and it only loads the contract factories and
attaches them to the already deployed smart contracts:

````typescript
async function retrieveContracts(): Promise<
  [SimpleEquippable, SimpleEquippable, SimpleBase, RMRKEquipRenderUtils]
> {
  const contractFactory = await ethers.getContractFactory("SimpleEquippable");
  const baseFactory = await ethers.getContractFactory("SimpleBase");
  const viewsFactory = await ethers.getContractFactory("RMRKEquipRenderUtils");

  const kanaria: SimpleEquippable = contractFactory.attach(
    deployedKanariaAddress
  );
  const gem: SimpleEquippable = contractFactory.attach(deployedGemAddress);
  const base: SimpleBase = baseFactory.attach(deployedBaseAddress);
  const views: RMRKEquipRenderUtils = await viewsFactory.attach(
    deployedViewsAddress
  );

  return [kanaria, gem, base, views];
}
````

In order to use it, replace the call to the `deployContracts` at the beginning of the `main` function with the
`retrieveContracts`.

With the user journey script concluded, we can add a custom helper to the [`package.json`](../../package.json) to make
running it easier:

````json
    "user-journey-merged-equippable": "hardhat run scripts/mergedEquippableUserJourney.ts"
````

Running it using `npm run user-journey-merged-equippable` should return the following output:

````shell
npm run user-journey-merged-equippable

> @rmrk-team/evm-contract-samples@0.1.0 user-journey-merged-equippable
> hardhat run scripts/mergedEquippableUserJourney.ts

Sample contracts deployed to 0x5FbDB2315678afecb367f032d93F642f64180aa3, 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512 and 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
Setting up Base
Base is set
Minting tokens
Minting Kanaria tokens
Minted 5 kanarias
Nest-minting Gem tokens
Minted 3 gems into each kanaria
Accepting Gems
Accepted 1 gem for each kanaria
Accepted 1 gem for each kanaria
Accepted 1 gem for each kanaria
Adding Kanaria assets
Added 2 asset entries
Added assets to token 1
Assets accepted
Adding Gem assets
Adding asset entries
Added 8 gem assets. 2 Types of gems with full, left, mid and right versions.
Setting valid parent reference IDs
Add assets to tokens
Added 4 assets to each of 3 gems.
Accepted 4 assets to each of 3 gems.
Equipping gems
Equipped 3 gems into first kanaria
Composing equippables
Composed:  [
  [
    BigNumber { value: "2" },
    BigNumber { value: "0" },
    '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
    'ipfs://meta1.json',
    id: BigNumber { value: "2" },
    equippableGroupId: BigNumber { value: "0" },
    baseAddress: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
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
      '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
      '',
      partId: BigNumber { value: "9" },
      childAssetId: BigNumber { value: "2" },
      z: 4,
      childTokenId: BigNumber { value: "1" },
      childAddress: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
      metadataURI: ''
    ],
    [
      BigNumber { value: "10" },
      BigNumber { value: "3" },
      4,
      BigNumber { value: "2" },
      '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
      '',
      partId: BigNumber { value: "10" },
      childAssetId: BigNumber { value: "3" },
      z: 4,
      childTokenId: BigNumber { value: "2" },
      childAddress: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
      metadataURI: ''
    ],
    [
      BigNumber { value: "11" },
      BigNumber { value: "8" },
      4,
      BigNumber { value: "3" },
      '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
      '',
      partId: BigNumber { value: "11" },
      childAssetId: BigNumber { value: "8" },
      z: 4,
      childTokenId: BigNumber { value: "3" },
      childAddress: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
      metadataURI: ''
    ]
  ],
  asset: [
    BigNumber { value: "2" },
    BigNumber { value: "0" },
    '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
    'ipfs://meta1.json',
    id: BigNumber { value: "2" },
    equippableGroupId: BigNumber { value: "0" },
    baseAddress: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
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
      '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
      '',
      partId: BigNumber { value: "9" },
      childAssetId: BigNumber { value: "2" },
      z: 4,
      childTokenId: BigNumber { value: "1" },
      childAddress: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
      metadataURI: ''
    ],
    [
      BigNumber { value: "10" },
      BigNumber { value: "3" },
      4,
      BigNumber { value: "2" },
      '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
      '',
      partId: BigNumber { value: "10" },
      childAssetId: BigNumber { value: "3" },
      z: 4,
      childTokenId: BigNumber { value: "2" },
      childAddress: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
      metadataURI: ''
    ],
    [
      BigNumber { value: "11" },
      BigNumber { value: "8" },
      4,
      BigNumber { value: "3" },
      '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
      '',
      partId: BigNumber { value: "11" },
      childAssetId: BigNumber { value: "8" },
      z: 4,
      childTokenId: BigNumber { value: "3" },
      childAddress: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
      metadataURI: ''
    ]
  ]
]
````

This concludes our work on the simple Merged equippable RMRK lego composite and we can now move on to examining the
advanced implementation.

## Advanced MergedEquippable

The `Advanced MergedEquippable` implementation uses the [`AdvancedBase`](../AdvancedBase.sol) and [`AdvancedEquippable`]
./AdvancedEquippable.sol) and allows for more flexibility when implementing the Merged equippable RMRK lego composite.
It implements the minimum required implementation in order to be compatible with RMRK merged equippable, but leaves more
business logic implementation freedom to the developer.

### AdvancedBase

The [`AdvancedBase`](../AdvancedBase.sol) smart contract represents the minimum required implementation in order for the
smart contract to be compatible with the `Base` RMRK lego. It uses the
[`RMRKBaseStorage.sol`](https://github.com/rmrk-team/evm/blob/dev/contracts/RMRK/base/RMRKBaseStorage.sol) import to
gain access to the Base lego:

````solidity
import "@rmrk-team/evm-contracts/contracts/RMRK/base/RMRKBaseStorage.sol";
````

We only need `symbol` and `type_` of the base in order to properly initialize it after the `AdvancedBase` inherits it:

````solidity
contract AdvancedBase is RMRKBaseStorage {
    // NOTE: Additional custom arguments can be added to the constructor based on your needs.
    constructor(
        string memory symbol,
        string memory type_
    )
        RMRKBaseStorage(symbol, type_)
    {
        // Custom optional: constructor logic
    }
}
````

This is all that is required to get you started with implementing the Base RMRK lego.

<details>
<summary>The minimal <strong><i>AdvancedBase.sol</i></strong> should look like this:</summary>

````solidity
// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.16;

import "@rmrk-team/evm-contracts/contracts/RMRK/base/RMRKBaseStorage.sol";

contract AdvancedBase is RMRKBaseStorage {
    // NOTE: Additional custom arguments can be added to the constructor based on your needs.
    constructor(
        string memory symbol,
        string memory type_
    )
        RMRKBaseStorage(symbol, type_)
    {
        // Custom optional: constructor logic
    }
}
````

</details>

Using `RMRKBaseStorage` requires custom implementation of part management. Available internal functions to use when
writing it are:

- `_addPart(IntakeStruct memory intakeStruct)`
- `_addPartList(IntakeStruct[] memory intakeStructs)`

In addition to the part management functions, you should also implement the equippable management function with the
following internal ones available:

- `_addEquippableAddresses(uint64 partId, address[] memory equippableAddresses)`
- `_setEquippableAddresses( uint64 partId, address[] memory equippableAddresses)`
- `_setEquippableToAll(uint64 partId)`
- `_resetEquippableAddresses(uint64 partId)`

Any additional functions supporting your NFT use case and utility related to the Base NFT lego can also be added.
Remember to thoroughly test your smart contracts with extensive test suites and define strict access control rules for
the functions that you implement.

### AdvancedEquippable

The [`AdvancedEquippable`](./AdvancedEquippable.sol) smart contract represents the minimum required implementation in
order for the smart contract to be compatible with the `MergedEquippable` RMRK lego composite. It uses the
[`RMRKEquippable.sol`](https://github.com/rmrk-team/evm/blob/dev/contracts/RMRK/equippable/RMRKEquippable.sol) import to
gain access to the Merged equippable RMRK lego composite:

````solidity
import "@rmrk-team/evm-contracts/contracts/RMRK/equippable/RMRKEquippable.sol";
````

We only need `name` and `symbol` of the NFT collection in order to propely initialize it after the `AdvancedEquippable`
inherits it:

````solidity
contract AdvancedEquippable is RMRKEquippable {
    // NOTE: Additional custom arguments can be added to the constructor based on your needs.
    constructor(
        string memory name,
        string memory symbol
    )
        RMRKEquippable(name, symbol)
    {
        // Custom optional: constructor logic
    }
}
````

This is all that is required to get you started with implementing the Merged equippable RMRK lego composite.

<details>
<summary>The minimal <strong><i>AdvancedEquippable.sol</i></strong> should look like this:</summary>

````solidity
// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.16;

import "@rmrk-team/evm-contracts/contracts/RMRK/equippable/RMRKEquippable.sol";

contract AdvancedEquippable is RMRKEquippable {
    // NOTE: Additional custom arguments can be added to the constructor based on your needs.
    constructor(
        string memory name,
        string memory symbol
    )
        RMRKEquippable(name, symbol)
    {
        // Custom optional: constructor logic
    }
}
````

</details>

Using `RMRKEquippable` requires custom implementation of minting logic. Available internal functions to use when writing
it are:

- `_mint(address to, uint256 tokenId)`
- `_safeMint(address to, uint256 tokenId)`
- `_safeMint(address to, uint256 tokenId, bytes memory data)`
- `_nestMint(address to, uint256 tokenId, uint256 destinationId)`

The latter is used to mint a child NFT directly into the parent NFT, so implement it if you forsee it applies to your use case. Additionally burning and transfer functions can be implemented using:

- `_burn(uint256 tokenId)`
- `transferFrom(address from, address to, uint256 tokenId)`
- `nestTransfer(address from, address to, uint256 tokenId, uint256 destinationId)`

Asset and reference management functions should also be implemented using:

- `_addAssetEntry(ExtendedAsset calldata asset, uint64[] calldata fixedPartIds, uint64[] calldata slotPartIds)`
- `_addAssetToToken(uint256 tokenId, uint64 assetId, uint64 overwrites)`
- `_setValidParentForEquippableGroup(uint64 equippableGroupId, address parentAddress, uint64 slotPartId)`

Any additional functions supporting your NFT use case and utility can also be added. Remember to thoroughly test your
smart contracts with extensive test suites and define strict access control rules for the functions that you implement.

Happy equipping! 🛠