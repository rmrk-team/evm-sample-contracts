// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

import "@rmrk-team/evm-contracts/contracts/implementations/RMRKEquippableImpl.sol";

contract SimpleEquippable is RMRKEquippableImpl {
    constructor(
        string memory name,
        string memory symbol,
        uint256 maxSupply,
        uint256 pricePerMint
    ) RMRKEquippableImpl(name, symbol, maxSupply, pricePerMint) {}
}