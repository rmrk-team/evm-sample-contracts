// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

import "@rmrk-team/evm-contracts/contracts/implementations/nativeTokenPay/RMRKMultiAssetImpl.sol";

contract SimpleMultiAsset is RMRKMultiAssetImpl {
    // NOTE: Additional custom arguments can be added to the constructor based on your needs.
    constructor(InitData memory data)
        RMRKMultiAssetImpl(
            "SimpleMultiAsset",
            "SMA",
            "ipfs://meta",
            "ipfs://tokenMeta",
            data
        )
    {}
}
