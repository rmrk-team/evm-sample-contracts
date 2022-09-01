// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.15;

import "@rmrk-team/evm-contracts/contracts/RMRK/RMRKEquippableWithNesting.sol";

/* import "hardhat/console.sol"; */

//Minimal public implementation of RMRKEquippableWithNesting for testing.
contract AdvancedEquippableWithNesting is RMRKEquippableWithNesting {
    constructor(
        address nestingAddress
        // Custom optional: additional parameters
    )
        RMRKEquippableWithNesting(nestingAddress)
    {
        // Custom optional: constructor logic
    }

    // Custom optional: external gated function to set nestingAddress
    // Available internal functions:
    //  _setNestingAddress(address nestingAddress)

    // Custom expected: external, optionally gated, function to add resources.
    // Available internal functions:
    //  _addResourceEntry(ExtendedResource calldata resource, uint64[] calldata fixedPartIds, uint64[] calldata slotPartIds)

    // Custom expected: external, optionally gated, function to add resources to tokens.
    // Available internal functions:
    //  _addResourceToToken(uint256 tokenId, uint64 resourceId, uint64 overwrites)

    // Custom expected: external, optionally gated, function to add set valid parent reference Id.
    // Available internal functions:
    //  _setValidParentRefId(uint64 refId, address parentAddress, uint64 partId)
}
