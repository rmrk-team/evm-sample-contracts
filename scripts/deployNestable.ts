import { ethers } from "hardhat";
import { SimpleNestable } from "../typechain-types";
import { ContractTransaction } from "ethers";

async function main() {
  const pricePerMint = ethers.utils.parseEther("0.0001");
  const totalTokens = 5;
  const [owner] = await ethers.getSigners();

  const contractFactory = await ethers.getContractFactory("SimpleNestable");
  const parent: SimpleNestable = await contractFactory.deploy(
    "Kanaria",
    "KAN",
    1000,
    pricePerMint,
    "ipfs://collectionMeta",
    "ipfs://tokenMeta",
    await owner.getAddress(),
    10
  );
  const child: SimpleNestable = await contractFactory.deploy(
    "Chunky",
    "CHN",
    1000,
    pricePerMint,
    "ipfs://collectionMeta",
    "ipfs://tokenMeta",
    await owner.getAddress(),
    10
  );

  await parent.deployed();
  await child.deployed();
  console.log(
    `Sample contracts deployed to ${parent.address} and ${child.address}`
  );
}

// main2();
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
