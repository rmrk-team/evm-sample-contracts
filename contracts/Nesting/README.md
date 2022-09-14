# Nesting

The concept of nested NFTs refers to NFTs being able to own other NFTs.

At its core, the principle is simple: the owner of an NFT does not have to be an externally owned account or a smart
contract, it can also be a specific NFT.

The process of sending an NFT into another is functionally identical to sending it to another user. The process of
sending an NFT out of another NFT involves issuing a transaction from the address which owns the parent.

Some NFTs can be configured with special conditions for parent-child relationships. For example:

- some parent NFTs will allow the owner of a child NFT to withdraw that child at any time (e.g. virtual land containing
an avatar)
- some parent NFTs will be prohibited from executing certain interactions on a child (e.g. the owner of a house in which
someone else's avatar is a guest should not be able to BURN the guest... probably)
- some parent NFTs will have special withdrawal conditions, like a music NFT that accepts music stems. The stems can be
removed by their owners until a certain number of co-composers upvote a stem enough, or until the owner of the parent
music track seals and "publishes" it

## Abstract

In this tutorial we will examine the Nesting RMRK block using two examples:

- [SimpleNesting](./SimpleNesting.sol) is a minimal implementation of the Nesting RMRK block.
- [AdvancedNesting](./AdvancedNesting.sol) is a more customizable implementation of the Nesting RMRK block.

Let's first examine the simple, minimal, implementation and move on to the advanced one.

## SimpleNesting

The `SimpleNesting` example uses the
[`RMRKNestingImpl`](https://github.com/rmrk-team/evm/blob/dev/contracts/implementations/RMRKNestingImpl.sol). It is used
by importing it using the `import` statement below the `pragma` definition:

````solidity
import "@rmrk-team/evm-contracts/contracts/implementations/RMRKNestingImpl.sol";
````

Once the `RMRKNestingImpl.sol` is imported into our file, we can set the inheritace of our smart contract:

````solidity
contract SimpleNesting is RMRKNestingImpl {
    
}
````

The `RMRKNestingImpl` implements all of the required functionality of the Nested RMRK lego. It implements minting of parent NFTs as well as child NFTs. Transferring and burning the NFTs is also implemented.

**WARNING: The `RMRKNestingImpl` has no access control implemented. If you intend to use it, make sure to define your
own.**

The `constructor` to initialize the `RMRKNestingImpl` accepts the following arguments:

- `name_`: `string` argument that should represent the name of the NFT collection
- `symbol_`: `string` argument that should represent the symbol of the NFT collection
- `maxSupply_`: `uint256` argument that defines the maximum number of NFTs to be minted. This limits the total
cummulative number of both parent and child NFTs
- `pricePerMint_`: `uint256` argument that defines the price per the NFT mint. It is expressed in `wei` or minimum
denomination of the native currency of the EVM to which the smart contract is deployed to

In order to properly initiate the inherited smart contract, our smart contract needs to accept the arguments, mentioned above, in the `constructor` and pass them to `RMRKNestingImpl`:

````solidity
    constructor(
        string memory name,
        string memory symbol,
        uint256 maxSupply,
        uint256 pricePerMint
    ) RMRKNestingImpl(name, symbol, maxSupply, pricePerMint) {}
````

<details>
<summary>The <strong><i>SimpleNesting.sol</i></strong> should look like this:</summary>

````solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

import "@rmrk-team/evm-contracts/contracts/implementations/RMRKNestingImpl.sol";

contract SimpleNesting is RMRKNestingImpl {
    constructor(
        string memory name,
        string memory symbol,
        uint256 maxSupply,
        uint256 pricePerMint
    ) RMRKNestingImpl(name, symbol, maxSupply, pricePerMint) {}
}
````

</details>

### RMRKNestingImpl

Let's take a moment to examine the core of this implementation, the `RMRKNestingImpl`.

It uses the `OwnableLock`, `RMRKMintingUtils` and `RMRKNesting` smart contracts from `RMRK` stack as well as 
OpenZeppelin's `String` utility. To dive deeper into their operaion, plesase refer to their respective documentation.

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

#### `mintNesting`

The `mintNesting` function is used to mint child NFTs to be owned by the parent NFT and accepts three arguments:

- `to`: `address` type of argument specifying the address of the smart contract to which the parent NFT belongs to
- `numToMint`: `uint256` type of argument specifying the amount of tokens to be minted
- `destinationId`: `uint256` type of argument specifying the ID of the parent NFT to which to mint the child NFT

The constraints of `mintNesting` are similar to the ones set out for `mint` function.

#### `burn`

Can only be called by a direct owner or a parent NFT's smart contract or a caller that was given the allowance and is
used to burn the NFT.

#### `transfer`

Can only be called by a direct owner or a parent NFT's smart contract or a caller that was given the allowance and is
used to transfer the NFT to the specified address.

#### `nestTransfer`

Can only be called by a direct owner or a parent NFT's smart contract or a caller that was given the allowance and is
used to transfer the NFT to another NFT residing in a specified contract. This will nest the given NFT into the
specified one.

### Deploy script

The deploy script for the `SimpleNesting` smart contract resides in the
[`deployNesting.ts`](../../scripts/deployNesting.ts).

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
  const pricePerMint = ethers.utils.parseEther("0.0001");
  const totalTokens = 5;
  const [owner] = await ethers.getSigners();
````

Now that the constants are ready, we can deploy the smart contracts and log the addresses of the contracts to the
console:

````typescript
  const contractFactory = await ethers.getContractFactory("SimpleNesting");
  const parent: SimpleNesting = await contractFactory.deploy(
    "Kanaria",
    "KAN",
    1000,
    pricePerMint
  );
  const child: SimpleNesting = await contractFactory.deploy(
    "Chunky",
    "CHN",
    1000,
    pricePerMint
  );

  await parent.deployed();
  await child.deployed();
  console.log(
    `Sample contracts deployed to ${parent.address} and ${child.address}`
  );
````

A custom script added to [`package.json`](../../package.json) allows us to easily run the script:

````json
  "scripts": {
    "deploy-nesting": "hardhat run scripts/deployNesting.ts"
  }
````

Using the script with `npm run deploy-nesting` should return the following output:

````shell
npm run deploy-nesting

> @rmrk-team/evm-contract-samples@0.1.0 deploy-nesting
> hardhat run scripts/deployNesting.ts

Compiled 47 Solidity files successfully
Sample contracts deployed to 0x5FbDB2315678afecb367f032d93F642f64180aa3 and 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
````

### User journey

With the deploy script ready, we can examine how the journey of a user using nesting would look like using these two
smart contracts.

The base of it is the same as the deploy script, as we need to deploy the smart contracts in order to interact with
them:

````typescript
import { ethers } from "hardhat";
import { SimpleNesting } from "../typechain-types";
import { ContractTransaction } from "ethers";

async function main() {
  const pricePerMint = ethers.utils.parseEther("0.0001");
  const totalTokens = 5;
  const [owner] = await ethers.getSigners();

  const contractFactory = await ethers.getContractFactory("SimpleNesting");
  const parent: SimpleNesting = await contractFactory.deploy(
    "Kanaria",
    "KAN",
    1000,
    pricePerMint
  );
  const child: SimpleNesting = await contractFactory.deploy(
    "Chunky",
    "CHN",
    1000,
    pricePerMint
  );

  await parent.deployed();
  await child.deployed();
  console.log(
    `Sample contracts deployed to ${parent.address} and ${child.address}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
````

First thing that needs to be done after the smart contracts are deployed is to mint the NFTs. Minting the parent NFT is
a straightforward process. We will use the `totalTokens` constant in order to specify how many of the parent tokens to
mint:

````typescript
  console.log("Minting parent NFTs");
  let tx = await parent.mint(owner.address, totalTokens, {
    value: pricePerMint.mul(totalTokens),
  });
  await tx.wait();
  console.log("Minted totalTokens tokens");
  let totalSupply = await parent.totalSupply();
  console.log("Total parent tokens: %s", totalSupply);
````

Minting child NFTs that should be nested is a different process. We will mint 2 nested NFTs for each parent NFT. If we
examine the `mintNesting` call that is being prepared, we can see that the first argument is the parent smart contract
address, the second one is the amount of child NFTs to be nested to the given token and third is the ID of the parent
token to which to nest the child. In this script, we will build a set of transactions to mint the nested tokens and then
send them once they are all ready:

````typescript
  console.log("Minting child NFTs");
  let allTx: ContractTransaction[] = [];
  for (let i = 1; i <= totalTokens; i++) {
    let tx = await child.mintNesting(parent.address, 2, i, {
      value: pricePerMint.mul(2),
    });
    allTx.push(tx);
  }
  console.log("Added 2 chunkies per kanaria");
  console.log("Awaiting for all tx to finish...");
  await Promise.all(allTx.map((tx) => tx.wait()));

  totalSupply = await child.totalSupply();
  console.log("Total child tokens: %s", totalSupply);
````

Once the child NFTs are minted, we can examine the difference between `ownerOf` and `rmrkOwnerOf` functions. The former should return the address of the root owner (which should be the `owner`'s address in our case) and the latter should return the array of values related to intended parent. The array is structured like this:

````json
[
  address of the owner,
  token ID of the parent NFT,
  isNft boolean value
]
````

In our case, the address of the owner should equal the parent token's smart contract, the ID should equal the parent
NFT's ID and the boolean value of `isNft` should be set to `true`. If we would be calling the `rmrkOwnerOf` one the
parent NFT, the owner should be the same as the one returned from the `ownerOf`, ID should equal 0 and the `isNft` value
should be set to `false`. The section covering these calls shoudl look like this:

````typescript
  console.log("Inspecting child NFT with the ID of 1");
  let parentId = await child.ownerOf(1);
  let rmrkParent = await child.rmrkOwnerOf(1);
  console.log("Chunky's id 1 owner  is ", parentId);
  console.log("Chunky's id 1 rmrk owner is ", rmrkParent);
  console.log("Parent address: ", parent.address);
````

For the nesting process to be completed, the `acceptChild` method should be caled on the parent NFT:

````typescript
  console.log("Accepthing the fist child NFT for the parent NFT with ID 1");
  tx = await parent.acceptChild(1, 0);
  await tx.wait();
````

The section of the script above accepted the child NFT with the nesting ID of `0` for the parent NFT with the ID of `1`
in the parent NFT's smart contract.

**NOTE: When accepting the nested NFTs, the ID of the pending NFT represents its ID in a FIFO like stack. So having 2
NFTs in the pending stack, and accepting the one with the ID of 0 will move the next one to this spot. Accepting the
second NFT from the stack, after the first one was already accepted, should then be done by accepting the pending NFT
with ID of 0. So two identical calls in succession should accept both pending NFTs.**

The parent NFT with ID 1 now has one accepted and one pending child NFTs. We can examine both using the `childrenOf` and `pendingChildren` methods:

````typescript
  console.log("Exaimning accepted and pending children of parent NFT with ID 1");
  console.log("Children: ", await parent.childrenOf(1));
  console.log("Pending: ", await parent.pendingChildrenOf(1));
````

Both of these methods return the array of tokens contained in the list, be it for child NFTs or for pending NFTs. The array contains two values:

- `contractAddress` is the address of the child NFT's smart contract
- `tokenId` is the ID of the child NFT in its smart contract

Once the NFT is nested, it can also be unnested. When doing so, the owner of the token should be specified, as they will be the ones owning the token from that point on (or until they nest or sell it). We will remove the nested NFT with nesting ID of 0 from the parent NFT with ID 1:

````typescript
  console.log("Removing the nested NFT from the parent token with the ID of 1");
  tx = await parent.unnestChild(1, 0, owner.address);
  await tx.wait();
````

**NOTE: Unnesting the child NFT is done in the similar manner as accepting a pending child NFT. Once the nested NFT at
ID 0 has been unnested the following NFT's IDs are reduced by 1.**

Finally, let's observe the child NFT that we just unnested. We will use the `ownerOf` and `rmrkOwnerOf` methods to
observe it:

````typescript
  parentId = await child.ownerOf(1);
  rmrkParent = await child.rmrkOwnerOf(1);
  console.log("Chunky's id 1 parent is ", parentId);
  console.log("Chunky's id 1 rmrk owner is ", rmrkParent);
````

The `rmrkOwnerOf` should return the address of the `owner` and the ID should be `0` as well as `isNft` should be
`false`.

With the user journey script concluded, we can add a custom helper to the [`package.json`](../../package.json) to make
running it easier:

````json
    "user-journey-nesting": "hardhat run scripts/nestingUserJourney.ts"
````

Running it using `npm run user-journey-nesting` should return the following output:

````shell
npm run user-journey-nesting

> @rmrk-team/evm-contract-samples@0.1.0 user-journey-nesting
> hardhat run scripts/nestingUserJourney.ts

Sample contracts deployed to 0x5FbDB2315678afecb367f032d93F642f64180aa3 and 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
Minting parent NFTs
Minted totalTokens tokens
Total parent tokens: 5
Minting child NFTs
Added 2 chunkies per kanaria
Awaiting for all tx to finish...
Total child tokens: 10
Inspecting child NFT with the ID of 1
Chunky's id 1 owner  is  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Chunky's id 1 rmrk owner is  [
  '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  BigNumber { value: "1" },
  true
]
Parent address:  0x5FbDB2315678afecb367f032d93F642f64180aa3
Accepthing the fist child NFT for the parent NFT with ID 1
Exaimning accepted and pending children of parent NFT with ID 1
Children:  [
  [
    BigNumber { value: "1" },
    '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
    tokenId: BigNumber { value: "1" },
    contractAddress: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
  ]
]
Pending:  [
  [
    BigNumber { value: "2" },
    '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
    tokenId: BigNumber { value: "2" },
    contractAddress: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
  ]
]
Removing the nested NFT from the parent token with the ID of 1
Chunky's id 1 parent is  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Chunky's id 1 rmrk owner is  [
  '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  BigNumber { value: "0" },
  false
]
````

This concludes our work on the [`SimpleNesting.sol`](./SimpleNesting.sol). We can now move on to examining the
[`AdvancedNesting.sol`](./AdvancedNesting.sol).