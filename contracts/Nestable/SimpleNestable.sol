// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

import "@rmrk-team/evm-contracts/contracts/implementations/RMRKNestableImpl.sol";

contract SimpleNestable is RMRKNestableImpl {
    // NOTE: Additional custom arguments can be added to the constructor based on your needs.
    constructor(
        string memory name,
        string memory symbol,
        uint256 maxSupply,
        uint256 pricePerMint,
        string memory collectionMetadata,
        string memory tokenURI,
        address royaltyRecipient,
        uint256 royaltyPercentageBps
    )
        RMRKNestableImpl(
            name,
            symbol,
            maxSupply,
            pricePerMint,
            collectionMetadata,
            tokenURI,
            royaltyRecipient,
            royaltyPercentageBps
        )
    {}
}
