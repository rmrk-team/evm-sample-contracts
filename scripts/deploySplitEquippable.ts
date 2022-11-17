import { ethers } from "hardhat";
import {
  SimpleBase,
  SimpleExternalEquip,
  SimpleNestableExternalEquip,
  RMRKEquipRenderUtils,
} from "../typechain-types";
import { ContractTransaction } from "ethers";

const pricePerMint = ethers.utils.parseEther("0.0001");

async function main() {
  const [kanariaNestable, kanariaEquip, gemNestable, gemEquip, base, views] =
    await deployContracts();
}

async function deployContracts(): Promise<
  [
    SimpleNestableExternalEquip,
    SimpleExternalEquip,
    SimpleNestableExternalEquip,
    SimpleExternalEquip,
    SimpleBase,
    RMRKEquipRenderUtils
  ]
> {
  const [beneficiary] = await ethers.getSigners();
  const equipFactory = await ethers.getContractFactory("SimpleExternalEquip");
  const nestableFactory = await ethers.getContractFactory(
    "SimpleNestableExternalEquip"
  );
  const baseFactory = await ethers.getContractFactory("SimpleBase");
  const viewsFactory = await ethers.getContractFactory("RMRKEquipRenderUtils");

  const kanariaNestable: SimpleNestableExternalEquip =
    await nestableFactory.deploy(
      "Kanaria",
      "KAN",
      1000,
      pricePerMint,
      ethers.constants.AddressZero,
      "ipfs://collectionMeta",
      "ipfs://tokenMeta",
      await beneficiary.getAddress(),
      10
    );
  const gemNestable: SimpleNestableExternalEquip = await nestableFactory.deploy(
    "Gem",
    "GM",
    3000,
    pricePerMint,
    ethers.constants.AddressZero,
    "ipfs://collectionMeta",
    "ipfs://tokenMeta",
    await beneficiary.getAddress(),
    10
  );

  const kanariaEquip: SimpleExternalEquip = await equipFactory.deploy(
    kanariaNestable.address
  );
  const gemEquip: SimpleExternalEquip = await equipFactory.deploy(
    gemNestable.address
  );
  const base: SimpleBase = await baseFactory.deploy("KB", "svg");
  const views: RMRKEquipRenderUtils = await viewsFactory.deploy();

  await kanariaNestable.deployed();
  await kanariaEquip.deployed();
  await gemNestable.deployed();
  await gemEquip.deployed();
  await base.deployed();
  await views.deployed();

  const allTx = [
    await kanariaNestable.setEquippableAddress(kanariaEquip.address),
    await gemNestable.setEquippableAddress(gemEquip.address),
  ];
  await Promise.all(allTx.map((tx) => tx.wait()));
  console.log(
    `Sample contracts deployed to ${kanariaNestable.address} (Kanaria Nestable) | ${kanariaEquip.address} (Kanaria Equip), ${gemNestable.address} (Gem Nestable) | ${gemEquip.address} (Gem Equip) and ${base.address} (Base)`
  );

  return [kanariaNestable, kanariaEquip, gemNestable, gemEquip, base, views];
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
