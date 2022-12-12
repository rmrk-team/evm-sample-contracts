import { ethers } from "hardhat";
import { SimpleMultiAsset } from "../typechain-types";

async function main() {
  const pricePerMint = ethers.utils.parseEther("0.0001");

  const contractFactory = await ethers.getContractFactory("SimpleMultiAsset");
  const token: SimpleMultiAsset = await contractFactory.deploy(
    {
      erc20TokenAddress: ethers.constants.AddressZero,
      tokenUriIsEnumerable: true,
      royaltyRecipient: ethers.constants.AddressZero,
      royaltyPercentageBps: 0,
      maxSupply: 1000,
      pricePerMint: pricePerMint 
    }
  );

  await token.deployed();
  console.log(`Sample contract deployed to ${token.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
