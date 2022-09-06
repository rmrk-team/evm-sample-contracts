// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

import "@rmrk-team/evm-contracts/contracts/implementations/RMRKNestingMultiResourceImpl.sol";

contract SimpleNestingMultiResource is RMRKNestingMultiResourceImpl {
    constructor(
    ) RMRKNestingMultiResourceImpl("SimpleNestingMultiResource", "SNMR", 1000, 100_000_000) {}
}