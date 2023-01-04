// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

import "@rmrk-team/evm-contracts/contracts/implementations/nativeTokenPay/RMRKNestableExternalEquipImpl.sol";

contract SimpleNestableExternalEquip is RMRKNestableExternalEquipImpl {
    // NOTE: Additional custom arguments can be added to the constructor based on your needs.
    constructor(
        address equippableAddress,
        string memory name,
        string memory symbol,
        string memory collectionMetadata,
        string memory tokenURI,
        InitData memory data
    )
        RMRKNestableExternalEquipImpl(
            equippableAddress,
            name,
            symbol,
            collectionMetadata,
            tokenURI,
            data
        )
    {}
}
