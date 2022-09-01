// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.15;

import "@rmrk-team/evm-contracts/contracts/RMRK/RMRKEquippable.sol";

//Minimal public implementation of RMRKEquippable for testing.
contract AdvancedEquippable is RMRKEquippable {
    constructor(
        string memory name,
        string memory symbol
        // Custom optional: additional parameters
    )
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
    //  _nestMint(address to, uint256 tokenId, uint256 destinationId) 

    // Custom expected: external gated function to burn.
    // Available internal functions:
    //  _burn(uint256 tokenId)

    // Custom optional: utility functions to transfer and nest transfer from caller
    // Available public functions:
    //  transferFrom(address from, address to, uint256 tokenId)
    //  nestTransfer(address from, address to, uint256 tokenId, uint256 destinationId)

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
