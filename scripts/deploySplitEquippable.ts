import { ethers } from "hardhat";
import {
  SimpleBase,
  SimpleExternalEquip,
  SimpleNestingExternalEquip,
  RMRKEquipRenderUtils,
} from "../typechain-types";
import { ContractTransaction } from "ethers";

const pricePerMint = ethers.utils.parseEther("0.0001");
const totalBirds = 5;

async function main() {
  const [kanariaNesting, kanariaEquip, gemNesting, gemEquip, base, views] =
    await deployContracts();

  // Notice that most of these steps will happen at different points in time
  // Here we do all in one go to demonstrate how to use it.
  await setupBase(base, gemEquip.address);
  await mintTokens(kanariaNesting, gemNesting);
  await addKanariaResources(kanariaEquip, base.address);
  await addGemResources(gemEquip, kanariaEquip.address, base.address);
  await equipGems(kanariaEquip);
  await composeEquippables(views, kanariaEquip.address);
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

  const allTx = [
    await kanariaNesting.setEquippableAddress(kanariaEquip.address),
    await gemNesting.setEquippableAddress(gemEquip.address),
  ];
  await Promise.all(allTx.map((tx) => tx.wait()));
  console.log(
    `Sample contracts deployed to ${kanariaNesting.address} | ${kanariaEquip.address}, ${gemNesting.address} | ${gemEquip.address} and ${base.address}`
  );

  return [kanariaNesting, kanariaEquip, gemNesting, gemEquip, base, views];
}

async function setupBase(base: SimpleBase, gemAddress: string): Promise<void> {
  // Setup base with 2 fixed part options for background, head, body and wings.
  // Also 3 slot options for gems
  const tx = await base.addPartList([
    {
      // Background option 1
      partId: 1,
      part: {
        itemType: 2, // Fixed
        z: 0,
        equippable: [],
        metadataURI: "ipfs://backgrounds/1.svg",
      },
    },
    {
      // Background option 2
      partId: 2,
      part: {
        itemType: 2, // Fixed
        z: 0,
        equippable: [],
        metadataURI: "ipfs://backgrounds/2.svg",
      },
    },
    {
      // Head option 1
      partId: 3,
      part: {
        itemType: 2, // Fixed
        z: 3,
        equippable: [],
        metadataURI: "ipfs://heads/1.svg",
      },
    },
    {
      // Head option 2
      partId: 4,
      part: {
        itemType: 2, // Fixed
        z: 3,
        equippable: [],
        metadataURI: "ipfs://heads/2.svg",
      },
    },
    {
      // Body option 1
      partId: 5,
      part: {
        itemType: 2, // Fixed
        z: 2,
        equippable: [],
        metadataURI: "ipfs://body/1.svg",
      },
    },
    {
      // Body option 2
      partId: 6,
      part: {
        itemType: 2, // Fixed
        z: 2,
        equippable: [],
        metadataURI: "ipfs://body/2.svg",
      },
    },
    {
      // Wings option 1
      partId: 7,
      part: {
        itemType: 2, // Fixed
        z: 1,
        equippable: [],
        metadataURI: "ipfs://wings/1.svg",
      },
    },
    {
      // Wings option 2
      partId: 8,
      part: {
        itemType: 2, // Fixed
        z: 1,
        equippable: [],
        metadataURI: "ipfs://wings/2.svg",
      },
    },
    {
      // Gems slot 1
      partId: 9,
      part: {
        itemType: 1, // Slot
        z: 4,
        equippable: [gemAddress], // Only gems tokens can be equipped here
        metadataURI: "",
      },
    },
    {
      // Gems slot 2
      partId: 10,
      part: {
        itemType: 1, // Slot
        z: 4,
        equippable: [gemAddress], // Only gems tokens can be equipped here
        metadataURI: "",
      },
    },
    {
      // Gems slot 3
      partId: 11,
      part: {
        itemType: 1, // Slot
        z: 4,
        equippable: [gemAddress], // Only gems tokens can be equipped here
        metadataURI: "",
      },
    },
  ]);
  await tx.wait();
  console.log("Base is set");
}

async function mintTokens(
  kanaria: SimpleNestingExternalEquip,
  gem: SimpleNestingExternalEquip
): Promise<void> {
  const [owner] = await ethers.getSigners();

  // Mint some kanarias
  let tx = await kanaria.mint(owner.address, totalBirds, {
    value: pricePerMint.mul(totalBirds),
  });
  await tx.wait();
  console.log(`Minted ${totalBirds} kanarias`);

  // Mint 3 gems into each kanariaNesting
  let allTx: ContractTransaction[] = [];
  for (let i = 1; i <= totalBirds; i++) {
    let tx = await gem.mintNesting(kanaria.address, 3, i, {
      value: pricePerMint.mul(3),
    });
    allTx.push(tx);
  }
  await Promise.all(allTx.map((tx) => tx.wait()));
  console.log(`Minted 3 gems into each kanariaNesting`);

  // Accept 3 gems for each kanariaNesting
  for (let i = 0; i < 3; i++) {
    allTx = [];
    for (let tokenId = 1; tokenId <= totalBirds; tokenId++) {
      let tx = await kanaria.acceptChild(tokenId, 0);
      allTx.push(tx);
    }
    await Promise.all(allTx.map((tx) => tx.wait()));
    console.log(`Accepted 1 gemNesting for each kanariaNesting`);
  }
}

async function addKanariaResources(
  kanaria: SimpleExternalEquip,
  baseAddress: string
): Promise<void> {
  const resourceDefaultId = 1;
  const resourceComposedId = 2;
  let allTx: ContractTransaction[] = [];
  let tx = await kanaria.addResourceEntry(
    {
      id: resourceDefaultId,
      equippableRefId: 0, // Only used for resources meant to equip into others
      baseAddress: ethers.constants.AddressZero, // base is not needed here
      metadataURI: "ipfs://default.png",
    },
    [],
    []
  );
  allTx.push(tx);

  tx = await kanaria.addResourceEntry(
    {
      id: resourceComposedId,
      equippableRefId: 0, // Only used for resources meant to equip into others
      baseAddress: baseAddress, // Since we're using parts, we must define the base
      metadataURI: "ipfs://meta1.json",
    },
    [1, 3, 5, 7], // We're using first background, head, body and wings
    [9, 10, 11] // We state that this can receive the 3 slot parts for gems
  );
  allTx.push(tx);
  // Wait for both resources to be added
  await Promise.all(allTx.map((tx) => tx.wait()));
  console.log("Added 2 resource entries");

  // Add resources to token
  const tokenId = 1;
  allTx = [
    await kanaria.addResourceToToken(tokenId, resourceDefaultId, 0),
    await kanaria.addResourceToToken(tokenId, resourceComposedId, 0),
  ];
  await Promise.all(allTx.map((tx) => tx.wait()));
  console.log("Added resources to token 1");

  // Accept both resources:
  tx = await kanaria.acceptResource(tokenId, 0);
  await tx.wait();
  tx = await kanaria.acceptResource(tokenId, 0);
  await tx.wait();
  console.log("Resources accepted");
}

async function addGemResources(
  gem: SimpleExternalEquip,
  kanariaAddress: string,
  baseAddress: string
): Promise<void> {
  // We'll add 4 resources for each gemNesting, a full version and 3 versions matching each slot.
  // We will have only 2 types of gems -> 4x2: 8 resources.
  // This is not composed by others, so fixed and slot parts are never used.
  const gemVersions = 4;

  // These refIds are used from the child's perspective, to group resources that can be equipped into a parent
  // With it, we avoid the need to do set it resource by resource
  const equippableRefIdLeftGem = 1;
  const equippableRefIdMidGem = 2;
  const equippableRefIdRightGem = 3;

  // We can do a for loop, but this makes it clearer.
  let allTx = [
    await gem.addResourceEntry(
      // Full version for first type of gemNesting, no need of refId or base
      {
        id: 1,
        equippableRefId: 0,
        baseAddress: baseAddress,
        metadataURI: `ipfs://gems/typeA/full.svg`,
      },
      [],
      []
    ),
    await gem.addResourceEntry(
      // Equipped into left slot for first type of gemNesting
      {
        id: 2,
        equippableRefId: equippableRefIdLeftGem,
        baseAddress: baseAddress,
        metadataURI: `ipfs://gems/typeA/left.svg`,
      },
      [],
      []
    ),
    await gem.addResourceEntry(
      // Equipped into mid slot for first type of gemNesting
      {
        id: 3,
        equippableRefId: equippableRefIdMidGem,
        baseAddress: baseAddress,
        metadataURI: `ipfs://gems/typeA/mid.svg`,
      },
      [],
      []
    ),
    await gem.addResourceEntry(
      // Equipped into left slot for first type of gemNesting
      {
        id: 4,
        equippableRefId: equippableRefIdRightGem,
        baseAddress: baseAddress,
        metadataURI: `ipfs://gems/typeA/right.svg`,
      },
      [],
      []
    ),
    await gem.addResourceEntry(
      // Full version for second type of gemNesting, no need of refId or base
      {
        id: 5,
        equippableRefId: 0,
        baseAddress: ethers.constants.AddressZero,
        metadataURI: `ipfs://gems/typeB/full.svg`,
      },
      [],
      []
    ),
    await gem.addResourceEntry(
      // Equipped into left slot for second type of gemNesting
      {
        id: 6,
        equippableRefId: equippableRefIdLeftGem,
        baseAddress: baseAddress,
        metadataURI: `ipfs://gems/typeB/left.svg`,
      },
      [],
      []
    ),
    await gem.addResourceEntry(
      // Equipped into mid slot for second type of gemNesting
      {
        id: 7,
        equippableRefId: equippableRefIdMidGem,
        baseAddress: baseAddress,
        metadataURI: `ipfs://gems/typeB/mid.svg`,
      },
      [],
      []
    ),
    await gem.addResourceEntry(
      // Equipped into right slot for second type of gemNesting
      {
        id: 8,
        equippableRefId: equippableRefIdRightGem,
        baseAddress: baseAddress,
        metadataURI: `ipfs://gems/typeB/right.svg`,
      },
      [],
      []
    ),
  ];

  await Promise.all(allTx.map((tx) => tx.wait()));
  console.log(
    "Added 8 gemNesting resources. 2 Types of gems with full, left, mid and right versions."
  );

  // 9, 10 and 11 are the slot part ids for the gems, defined on the base.
  // e.g. Any resource on gemNesting, which sets its equippableRefId to equippableRefIdLeftGem
  //      will be considered a valid equip into any kanariaNesting on slot 9 (left gemNesting).
  allTx = [
    await gem.setValidParentRefId(equippableRefIdLeftGem, kanariaAddress, 9),
    await gem.setValidParentRefId(equippableRefIdMidGem, kanariaAddress, 10),
    await gem.setValidParentRefId(equippableRefIdRightGem, kanariaAddress, 11),
  ];
  await Promise.all(allTx.map((tx) => tx.wait()));

  // We add resources of type A to gemNesting 1 and 2, and type Bto gemNesting 3. Both are nested into the first kanariaNesting
  // This means gems 1 and 2 will have the same resource, which is totally valid.
  allTx = [
    await gem.addResourceToToken(1, 1, 0),
    await gem.addResourceToToken(1, 2, 0),
    await gem.addResourceToToken(1, 3, 0),
    await gem.addResourceToToken(1, 4, 0),
    await gem.addResourceToToken(2, 1, 0),
    await gem.addResourceToToken(2, 2, 0),
    await gem.addResourceToToken(2, 3, 0),
    await gem.addResourceToToken(2, 4, 0),
    await gem.addResourceToToken(3, 5, 0),
    await gem.addResourceToToken(3, 6, 0),
    await gem.addResourceToToken(3, 7, 0),
    await gem.addResourceToToken(3, 8, 0),
  ];
  await Promise.all(allTx.map((tx) => tx.wait()));
  console.log("Added 4 resources to each of 3 gems.");

  // We accept each resource for both gems
  for (let i = 0; i < gemVersions; i++) {
    allTx = [
      await gem.acceptResource(1, 0),
      await gem.acceptResource(2, 0),
      await gem.acceptResource(3, 0),
    ];
    await Promise.all(allTx.map((tx) => tx.wait()));
  }
  console.log("Accepted 4 resources to each of 3 gems.");
}

async function equipGems(kanariaEquip: SimpleExternalEquip): Promise<void> {
  const allTx = [
    await kanariaEquip.equip({
      tokenId: 1, // Kanaria 1
      childIndex: 0, // Gem 1 is on position 0
      resourceId: 2, // Resource for the kanariaNesting which is composable
      slotPartId: 9, // left gemNesting slot
      childResourceId: 2, // Resource id for child meant for the left gemNesting
    }),
    await kanariaEquip.equip({
      tokenId: 1, // Kanaria 1
      childIndex: 2, // Gem 2 is on position 2 (positions are shifted when accepting children)
      resourceId: 2, // Resource for the kanariaNesting which is composable
      slotPartId: 10, // mid gemNesting slot
      childResourceId: 3, // Resource id for child meant for the mid gemNesting
    }),
    await kanariaEquip.equip({
      tokenId: 1, // Kanaria 1
      childIndex: 1, // Gem 3 is on position 1
      resourceId: 2, // Resource for the kanariaNesting which is composable
      slotPartId: 11, // right gemNesting slot
      childResourceId: 8, // Resource id for child meant for the right gemNesting
    }),
  ];
  await Promise.all(allTx.map((tx) => tx.wait()));
  console.log("Equipped 3 gems into first kanariaNesting");
}

async function composeEquippables(
  views: RMRKEquipRenderUtils,
  kanariaAddress: string
): Promise<void> {
  const tokenId = 1;
  const resourceId = 2;
  console.log(
    "Composed: ",
    await views.composeEquippables(kanariaAddress, tokenId, resourceId)
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
