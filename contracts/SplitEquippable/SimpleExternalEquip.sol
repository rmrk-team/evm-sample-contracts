// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

import "@rmrk-team/evm-contracts/contracts/implementations/RMRKExternalEquipImpl.sol";

contract SimpleExternalEquip is RMRKExternalEquipImpl {
    constructor(
        address nestingAddress
    ) RMRKExternalEquipImpl(nestingAddress) {}
}