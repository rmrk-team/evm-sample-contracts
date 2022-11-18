import { ethers } from "hardhat";
import {
  SimpleBase,
  SimpleEquippable,
  RMRKEquipRenderUtils,
} from "../typechain-types";
import { ContractTransaction } from "ethers";

const pricePerMint = ethers.utils.parseEther("0.0001");

async function main() {
  const [kanaria, gem, base, views] = await deployContracts();
}

async function deployContracts(): Promise<
  [SimpleEquippable, SimpleEquippable, SimpleBase, RMRKEquipRenderUtils]
> {
  console.log("Deploying smart contracts");

  const [beneficiary] = await ethers.getSigners();
  const contractFactory = await ethers.getContractFactory("SimpleEquippable");
  const baseFactory = await ethers.getContractFactory("SimpleBase");
  const viewsFactory = await ethers.getContractFactory("RMRKEquipRenderUtils");

  const kanaria: SimpleEquippable = await contractFactory.deploy(
    "Kanaria",
    "KAN",
    1000,
    pricePerMint,
    "ipfs://collectionMeta",
    "ipfs://tokenMeta",
    await beneficiary.getAddress(),
    10
  );
  const gem: SimpleEquippable = await contractFactory.deploy(
    "Gem",
    "GM",
    3000,
    pricePerMint,
    "ipfs://collectionMeta",
    "ipfs://tokenMeta",
    await beneficiary.getAddress(),
    10
  );
  const base: SimpleBase = await baseFactory.deploy("KB", "svg");
  const views: RMRKEquipRenderUtils = await viewsFactory.deploy();

  await kanaria.deployed();
  await gem.deployed();
  await base.deployed();
  await views.deployed();
  console.log(
    `Sample contracts deployed to ${kanaria.address} (Kanaria), ${gem.address} (Gem) and ${base.address} (Base)`
  );

  return [kanaria, gem, base, views];
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
