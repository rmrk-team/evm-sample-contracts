// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.16;

import "@rmrk-team/evm-contracts/contracts/RMRK/catalog/RMRKCatalog.sol";

contract AdvancedCatalog is RMRKCatalog {
    // NOTE: Additional custom arguments can be added to the constructor based on your needs.
    constructor(string memory symbol, string memory type_)
        RMRKCatalog(symbol, type_)
    {
        // Custom optional: constructor logic
    }

    // Custom expected: external gated functions to add parts.
    // Available internal functions:
    //  _addPart(IntakeStruct memory intakeStruct)
    //  _addPartList(IntakeStruct[] memory intakeStructs)

    // Custom expected: external gated functions to manage equippable addresses
    // Available internal functions:
    //  _addEquippableAddresses(uint64 partId, address[] memory equippableAddresses)
    //  _setEquippableAddresses( uint64 partId, address[] memory equippableAddresses)
    //  _setEquippableToAll(uint64 partId)
    //  _resetEquippableAddresses(uint64 partId)
}
