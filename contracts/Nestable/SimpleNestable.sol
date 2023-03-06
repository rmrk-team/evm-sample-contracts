// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import "@rmrk-team/evm-contracts/contracts/implementations/nativeTokenPay/RMRKNestableImpl.sol";

contract SimpleNestable is RMRKNestableImpl {
    // NOTE: Additional custom arguments can be added to the constructor based on your needs.
    constructor(
        string memory name,
        string memory symbol,
        string memory collectionMetadata,
        string memory tokenURI,
        InitData memory data
    )
        RMRKNestableImpl(
            name,
            symbol,
            collectionMetadata,
            tokenURI,
            data
        )
    {}
}
