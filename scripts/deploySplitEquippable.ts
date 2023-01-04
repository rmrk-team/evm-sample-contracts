import { ethers } from "hardhat";
import {
  SimpleCatalog,
  SimpleExternalEquip,
  SimpleNestableExternalEquip,
  RMRKEquipRenderUtils,
} from "../typechain-types";
import { ContractTransaction } from "ethers";

const pricePerMint = ethers.utils.parseEther("0.0001");

async function main() {
  const [nestableKanaria, kanariaEquip, nestableGem, gemEquip, base, views] =
    await deployContracts();
}

async function deployContracts(): Promise<
  [
    SimpleNestableExternalEquip,
    SimpleExternalEquip,
    SimpleNestableExternalEquip,
    SimpleExternalEquip,
    SimpleCatalog,
    RMRKEquipRenderUtils
  ]
> {
  const [beneficiary] = await ethers.getSigners();
  const equipFactory = await ethers.getContractFactory("SimpleExternalEquip");
  const nestableFactory = await ethers.getContractFactory(
    "SimpleNestableExternalEquip"
  );
  const baseFactory = await ethers.getContractFactory("SimpleCatalog");
  const viewsFactory = await ethers.getContractFactory("RMRKEquipRenderUtils");

  const nestableKanaria: SimpleNestableExternalEquip =
    await nestableFactory.deploy(
      ethers.constants.AddressZero,
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
  const nestableGem: SimpleNestableExternalEquip = await nestableFactory.deploy(
    ethers.constants.AddressZero,
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

  const kanariaEquip: SimpleExternalEquip = await equipFactory.deploy(
    nestableKanaria.address
  );
  const gemEquip: SimpleExternalEquip = await equipFactory.deploy(
    nestableGem.address
  );
  const base: SimpleCatalog = await baseFactory.deploy("KB", "svg");
  const views: RMRKEquipRenderUtils = await viewsFactory.deploy();

  await nestableKanaria.deployed();
  await kanariaEquip.deployed();
  await nestableGem.deployed();
  await gemEquip.deployed();
  await base.deployed();
  await views.deployed();

  const allTx = [
    await nestableKanaria.setEquippableAddress(kanariaEquip.address),
    await nestableGem.setEquippableAddress(gemEquip.address),
  ];
  await Promise.all(allTx.map((tx) => tx.wait()));
  console.log(
    `Sample contracts deployed to ${nestableKanaria.address} (Kanaria Nestable) | ${kanariaEquip.address} (Kanaria Equip), ${nestableGem.address} (Gem Nestable) | ${gemEquip.address} (Gem Equip) and ${base.address} (Catalog)`
  );

  return [nestableKanaria, kanariaEquip, nestableGem, gemEquip, base, views];
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
