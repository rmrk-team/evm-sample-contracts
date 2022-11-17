// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

import "@rmrk-team/evm-contracts/contracts/implementations/RMRKNestableExternalEquipImpl.sol";

contract SimpleNestableExternalEquip is RMRKNestableExternalEquipImpl {
    constructor(
        string memory name,
        string memory symbol,
        uint256 maxSupply,
        uint256 pricePerMint,
        address equippableAddress,
        string memory collectionMetadata,
        string memory tokenURI,
        address royaltyRecipient,
        uint256 royaltyPercentageBps
    )
        RMRKNestableExternalEquipImpl(
            name,
            symbol,
            maxSupply,
            pricePerMint,
            equippableAddress,
            collectionMetadata,
            tokenURI,
            royaltyRecipient,
            royaltyPercentageBps
        )
    {}
}
