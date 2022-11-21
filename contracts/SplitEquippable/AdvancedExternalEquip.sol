// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.16;

import "@rmrk-team/evm-contracts/contracts/RMRK/equippable/RMRKExternalEquip.sol";

/* import "hardhat/console.sol"; */

contract AdvancedExternalEquip is RMRKExternalEquip {
    constructor(address nestableAddress) RMRKExternalEquip(nestableAddress) {
        // Custom optional: constructor logic
    }

    // Custom optional: external gated function to set nestableAddress
    // Available internal functions:
    //  _setNestableAddress(address nestableAddress)

    // Custom expected: external, optionally gated, function to add assets.
    // Available internal functions:
    //  _addAssetEntry(ExtendedAsset calldata asset, uint64[] calldata fixedPartIds, uint64[] calldata slotPartIds)

    // Custom expected: external, optionally gated, function to add assets to tokens.
    // Available internal functions:
    //  _addAssetToToken(uint256 tokenId, uint64 assetId, uint64 overwrites)

    // Custom expected: external, optionally gated, function to add set valid parent reference Id.
    // Available internal functions:
    //  _setValidParentForEquippableGroup(uint64 equippableGroupId, address parentAddress, uint64 slotPartId)
}
