// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

import "@rmrk-team/evm-contracts/contracts/implementations/RMRKNestingWithEquippableImpl.sol";

contract SimpleNestingWithEquippable is RMRKNestingWithEquippableImpl {
    constructor(
        string memory name,
        string memory symbol,
        uint256 maxSupply,
        uint256 pricePerMint,
        address equippableAddress
    ) RMRKNestingWithEquippableImpl(name, symbol, maxSupply, pricePerMint, equippableAddress) {}
}