// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.15;

import "@rmrk-team/evm-contracts/contracts/RMRK/RMRKMultiResource.sol";

contract AdvancedMultiResource is RMRKMultiResource {
    constructor(
        string memory name,
        string memory symbol
        // Custom optional: additional parameters
    )
        RMRKMultiResource(name, symbol)
    {
        // Custom optional: constructor logic
    }

    // Custom expected: external, optionally gated, functions to mint.
    // Available internal functions:
    //  _mint(address to, uint256 tokenId)
    //  _safeMint(address to, uint256 tokenId)
    //  _safeMint(address to, uint256 tokenId, bytes memory data) 

    // Custom expected: external gated function to burn.
    // Available internal functions:
    //  _burn(uint256 tokenId)

    // Custom expected: external, optionally gated, function to add resources.
    // Available internal functions:
    //  _addResourceEntry(uint64 id, string memory metadataURI)

    // Custom expected: external, optionally gated, function to add resources to tokens.
    // Available internal functions:
    //  _addResourceToToken(uint256 tokenId, uint64 resourceId, uint64 overwrites)

    // Custom optional: utility functions to transfer from caller
    // Available public functions:
    //  transferFrom(address from, address to, uint256 tokenId)
}
