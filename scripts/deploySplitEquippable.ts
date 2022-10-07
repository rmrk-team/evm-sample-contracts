import { ethers } from "hardhat";
import {
  SimpleBase,
  SimpleExternalEquip,
  SimpleNestingExternalEquip,
  RMRKEquipRenderUtils,
} from "../typechain-types";
import { ContractTransaction } from "ethers";

const pricePerMint = ethers.utils.parseEther("0.0001");

async function main() {
  const [kanariaNesting, kanariaEquip, gemNesting, gemEquip, base, views] =
    await deployContracts();
}

async function deployContracts(): Promise<
  [
    SimpleNestingExternalEquip,
    SimpleExternalEquip,
    SimpleNestingExternalEquip,
    SimpleExternalEquip,
    SimpleBase,
    RMRKEquipRenderUtils
  ]
> {
  const equipFactory = await ethers.getContractFactory("SimpleExternalEquip");
  const nestingFactory = await ethers.getContractFactory(
    "SimpleNestingExternalEquip"
  );
  const baseFactory = await ethers.getContractFactory("SimpleBase");
  const viewsFactory = await ethers.getContractFactory("RMRKEquipRenderUtils");

  const kanariaNesting: SimpleNestingExternalEquip =
    await nestingFactory.deploy(
      "Kanaria",
      "KAN",
      1000,
      pricePerMint,
      ethers.constants.AddressZero
    );
  const gemNesting: SimpleNestingExternalEquip = await nestingFactory.deploy(
    "Gem",
    "GM",
    3000,
    pricePerMint,
    ethers.constants.AddressZero
  );

  const kanariaEquip: SimpleExternalEquip = await equipFactory.deploy(
    kanariaNesting.address
  );
  const gemEquip: SimpleExternalEquip = await equipFactory.deploy(
    gemNesting.address
  );
  const base: SimpleBase = await baseFactory.deploy("KB", "svg");
  const views: RMRKEquipRenderUtils = await viewsFactory.deploy();

  await kanariaNesting.deployed();
  await kanariaEquip.deployed();
  await gemNesting.deployed();
  await gemEquip.deployed();
  await base.deployed();
  await views.deployed();

  const allTx = [
    await kanariaNesting.setEquippableAddress(kanariaEquip.address),
    await gemNesting.setEquippableAddress(gemEquip.address),
  ];
  await Promise.all(allTx.map((tx) => tx.wait()));
  console.log(
    `Sample contracts deployed to ${kanariaNesting.address} (Kanaria Nesting) | ${kanariaEquip.address} (Kanaria Equip), ${gemNesting.address} (Gem Nesting) | ${gemEquip.address} (Gem Equip) and ${base.address} (Base)`
  );

  return [kanariaNesting, kanariaEquip, gemNesting, gemEquip, base, views];
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
