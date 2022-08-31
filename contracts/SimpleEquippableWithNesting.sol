// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

import "@rmrk-team/evm-contracts/contracts/implementations/RMRKEquippableWithNestingImpl.sol";

contract SimpleEquippableWithNesting is RMRKEquippableWithNestingImpl {
    constructor(
        address nestingAddress
    ) RMRKEquippableWithNestingImpl(nestingAddress) {}
}