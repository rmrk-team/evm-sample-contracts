import { ethers } from "hardhat";
import {
  SimpleCatalog,
  SimpleEquippable,
  RMRKEquipRenderUtils,
} from "../typechain-types";
import { ContractTransaction } from "ethers";

const pricePerMint = ethers.utils.parseEther("0.0001");

async function main() {
  const [kanaria, gem, base, views] = await deployContracts();
}

async function deployContracts(): Promise<
  [SimpleEquippable, SimpleEquippable, SimpleCatalog, RMRKEquipRenderUtils]
> {
  console.log("Deploying smart contracts");

  const [beneficiary] = await ethers.getSigners();
  const contractFactory = await ethers.getContractFactory("SimpleEquippable");
  const baseFactory = await ethers.getContractFactory("SimpleCatalog");
  const viewsFactory = await ethers.getContractFactory("RMRKEquipRenderUtils");

  const kanaria: SimpleEquippable = await contractFactory.deploy(
    "Kanaria",
    "KAN",
    "ipfs://collectionMeta",
    "ipfs://tokenMeta",
    {
      erc20TokenAddress: ethers.constants.AddressZero,
      tokenUriIsEnumerable: true,
      royaltyRecipient: await beneficiary.getAddress(),
      royaltyPercentageBps: 10,
      maxSupply: 1000,
      pricePerMint: pricePerMint
    }
  );
  const gem: SimpleEquippable = await contractFactory.deploy(
    "Gem",
    "GM",
    "ipfs://collectionMeta",
    "ipfs://tokenMeta",
    {
      erc20TokenAddress: ethers.constants.AddressZero,
      tokenUriIsEnumerable: true,
      royaltyRecipient: await beneficiary.getAddress(),
      royaltyPercentageBps: 10,
      maxSupply: 3000,
      pricePerMint: pricePerMint
    }
  );
  const base: SimpleCatalog = await baseFactory.deploy("KB", "svg");
  const views: RMRKEquipRenderUtils = await viewsFactory.deploy();

  await kanaria.deployed();
  await gem.deployed();
  await base.deployed();
  await views.deployed();
  console.log(
    `Sample contracts deployed to ${kanaria.address} (Kanaria), ${gem.address} (Gem) and ${base.address} (Catalog)`
  );

  return [kanaria, gem, base, views];
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
