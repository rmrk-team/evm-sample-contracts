// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

import "@rmrk-team/evm-contracts/contracts/implementations/RMRKNestableMultiAssetImpl.sol";

contract SimpleNestableMultiAsset is RMRKNestableMultiAssetImpl {
    constructor()
        RMRKNestableMultiAssetImpl(
            "SimpleNestableMultiAsset",
            "SNMR",
            1000,
            100_000_000,
            "ipfs://meta",
            "ipfs://tokenMeta",
            msg.sender,
            10
        )
    {}
}
