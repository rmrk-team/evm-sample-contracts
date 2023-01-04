// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

import "@rmrk-team/evm-contracts/contracts/implementations/nativeTokenPay/RMRKNestableMultiAssetImpl.sol";

contract SimpleNestableMultiAsset is RMRKNestableMultiAssetImpl {
    // NOTE: Additional custom arguments can be added to the constructor based on your needs.
    constructor(InitData memory data)
        RMRKNestableMultiAssetImpl(
            "SimpleNestableMultiAsset",
            "SNMA",
            "ipfs://meta",
            "ipfs://tokenMeta",
            data
        )
    {}
}
