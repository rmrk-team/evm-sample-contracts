// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

import "@rmrk-team/evm-contracts/contracts/implementations/RMRKMultiAssetImpl.sol";

contract SimpleMultiAsset is RMRKMultiAssetImpl {
    constructor(uint256 maxSupply, uint256 pricePerMint)
        RMRKMultiAssetImpl(
            "SimpleMultiAsset",
            "SMR",
            maxSupply,
            pricePerMint,
            "ipfs://meta",
            "ipfs://tokenMeta",
            msg.sender,
            10
        )
    {}
}
