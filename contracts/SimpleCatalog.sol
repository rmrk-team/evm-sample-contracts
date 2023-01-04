// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

import "@rmrk-team/evm-contracts/contracts/implementations/RMRKCatalogImpl.sol";

contract SimpleCatalog is RMRKCatalogImpl {
    // NOTE: Additional custom arguments can be added to the constructor based on your needs.
    constructor(string memory symbol, string memory type_)
        RMRKCatalogImpl(symbol, type_)
    {}
}
