// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.16;

import "@rmrk-team/evm-contracts/contracts/RMRK/equippable/RMRKEquippable.sol";

contract AdvancedEquippable is RMRKEquippable {
    // NOTE: Additional custom arguments can be added to the constructor based on your needs.
    constructor(string memory name, string memory symbol)
        RMRKEquippable(name, symbol)
    {
        // Custom optional: constructor logic
    }

    // Custom expected: external, optionally gated, functions to mint.
    // Available internal functions:
    //  _mint(address to, uint256 tokenId)
    //  _safeMint(address to, uint256 tokenId)
    //  _safeMint(address to, uint256 tokenId, bytes memory data)

    // Custom expected: external, optionally gated, functions to nest mint.
    // Available internal functions:
    //  _nestMint(address to, uint256 tokenId, uint256 destinationId, bytes memory data)

    // Custom expected: external gated function to burn.
    // Available internal functions:
    //  _burn(uint256 tokenId, uint256 maxChildrenBurns)

    // Custom optional: utility functions to transfer and nest transfer from caller
    // Available public functions:
    //  transferFrom(address from, address to, uint256 tokenId)
    //  nestTransferFrom(address from, address to, uint256 tokenId, uint256 destinationId, bytes memory data)

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
