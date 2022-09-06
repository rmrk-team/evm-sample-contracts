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