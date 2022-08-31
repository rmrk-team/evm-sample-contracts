import { ethers } from "hardhat";

async function main() {
  const pricePerMint = ethers.utils.parseEther("1");
  const contractFactory = await ethers.getContractFactory("SimpleNesting");
  const token = await contractFactory.deploy("MyToken", "MT", 1000, pricePerMint);

  await token.deployed();
  console.log(`Sample contract deployed to ${token.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});