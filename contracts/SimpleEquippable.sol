// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

import "@rmrk-team/evm-contracts/contracts/implementations/RMRKEquippableImpl.sol";
// We import it just so it's included on typechain. We'll need it to compose NFTs
import "@rmrk-team/evm-contracts/contracts/RMRK/utils/RMRKEquipRenderUtils.sol";

contract SimpleEquippable is RMRKEquippableImpl {
    constructor(
        string memory name,
        string memory symbol,
        uint256 maxSupply,
        uint256 pricePerMint
    ) RMRKEquippableImpl(name, symbol, maxSupply, pricePerMint) {}
}