// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

import "@rmrk-team/evm-contracts/contracts/implementations/RMRKExternalEquipImpl.sol";

contract SimpleExternalEquip is RMRKExternalEquipImpl {
    // NOTE: Additional custom arguments can be added to the constructor based on your needs.
    constructor(address nestableAddress)
        RMRKExternalEquipImpl(nestableAddress)
    {}
}
