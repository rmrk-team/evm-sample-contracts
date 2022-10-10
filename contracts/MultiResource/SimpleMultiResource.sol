// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

import "@rmrk-team/evm-contracts/contracts/implementations/RMRKMultiResourceImpl.sol";

contract SimpleMultiResource is RMRKMultiResourceImpl {
    constructor(
        uint256 maxSupply,
        uint256 pricePerMint
    ) RMRKMultiResourceImpl("SimpleMultiResource", "SMR", maxSupply, pricePerMint, "ipfs://meta") {}
}