// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import "@rmrk-team/evm-contracts/contracts/implementations/nativeTokenPay/RMRKEquippableImpl.sol";
// We import it just so it's included on typechain. We'll need it to compose NFTs
import "@rmrk-team/evm-contracts/contracts/RMRK/utils/RMRKEquipRenderUtils.sol";

contract SimpleEquippable is RMRKEquippableImpl {
    // NOTE: Additional custom arguments can be added to the constructor based on your needs.
    constructor(
        string memory name,
        string memory symbol,
        string memory collectionMetadata,
        string memory tokenURI,
        InitData memory data
    )
        RMRKEquippableImpl(
            name,
            symbol,
            collectionMetadata,
            tokenURI,
            data
        )
    {}
}
