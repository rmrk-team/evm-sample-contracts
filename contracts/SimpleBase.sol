// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

import "@rmrk-team/evm-contracts/contracts/implementations/RMRKBaseStorageImpl.sol";

contract SimpleBase is RMRKBaseStorageImpl {
    constructor(
        string symbol,
        string type_
    ) RMRKBaseStorageImpl(symbol, type_) {}
}