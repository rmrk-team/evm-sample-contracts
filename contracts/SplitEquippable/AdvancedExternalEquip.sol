// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.18;

import "@rmrk-team/evm-contracts/contracts/RMRK/equippable/RMRKExternalEquip.sol";

/* import "hardhat/console.sol"; */

contract AdvancedExternalEquip is RMRKExternalEquip {
    // NOTE: Additional custom arguments can be added to the constructor based on your needs.
    constructor(address nestableAddress) RMRKExternalEquip(nestableAddress) {
        // Custom optional: constructor logic
    }

    // Custom optional: external gated function to set nestableAddress
    // Available internal functions:
    //  _setNestableAddress(address nestableAddress)

    // Custom expected: external, optionally gated, function to add assets.
    // Available internal functions:
    //  _addAssetEntry(uint64 id, uint64 equippableGroupId, address catalogAddress, string memory metadataURI, uint64[] calldata partIds)

    // Custom expected: external, optionally gated, function to add assets to tokens.
    // Available internal functions:
    //  _addAssetToToken(uint256 tokenId, uint64 assetId, uint64 replacesAssetWithId)

    // Custom expected: external, optionally gated, function to add set valid parent reference Id.
    // Available internal functions:
    //  _setValidParentForEquippableGroup(uint64 equippableGroupId, address parentAddress, uint64 slotPartId)
}
