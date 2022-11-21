// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

import "@rmrk-team/evm-contracts/contracts/implementations/RMRKBaseStorageImpl.sol";

contract SimpleBase is RMRKBaseStorageImpl {
    // NOTE: Additional custom arguments can be added to the constructor based on your needs.
    constructor(string memory symbol, string memory type_)
        RMRKBaseStorageImpl(symbol, type_)
    {}
}
