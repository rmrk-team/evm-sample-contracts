import { ethers } from "hardhat";
import {
  SimpleCatalog,
  SimpleEquippable,
  RMRKEquipRenderUtils,
} from "../typechain-types";
import { ContractTransaction } from "ethers";

const pricePerMint = ethers.utils.parseEther("0.0001");
const totalBirds = 5;
const deployedKanariaAddress = "";
const deployedGemAddress = "";
const deployedCatalogAddress = "";
const deployedViewsAddress = "";

async function main() {
  const [kanaria, gem, base, views] = await deployContracts();
  // const [kanaria, gem, base, views] = await retrieveContracts();

  // Notice that most of these steps will happen at different points in time
  // Here we do all in one go to demonstrate how to use it.
  await setupCatalog(base, gem.address);
  await mintTokens(kanaria, gem);
  await addKanariaAssets(kanaria, base.address);
  await addGemAssets(gem, kanaria.address, base.address);
  await equipGems(kanaria);
  await composeEquippables(views, kanaria.address);
}

async function retrieveContracts(): Promise<
  [SimpleEquippable, SimpleEquippable, SimpleCatalog, RMRKEquipRenderUtils]
> {
  const contractFactory = await ethers.getContractFactory("SimpleEquippable");
  const catalogFactory = await ethers.getContractFactory("SimpleCatalog");
  const viewsFactory = await ethers.getContractFactory("RMRKEquipRenderUtils");

  const kanaria: SimpleEquippable = contractFactory.attach(
    deployedKanariaAddress
  );
  const gem: SimpleEquippable = contractFactory.attach(deployedGemAddress);
  const base: SimpleCatalog = catalogFactory.attach(deployedCatalogAddress);
  const views: RMRKEquipRenderUtils = await viewsFactory.attach(
    deployedViewsAddress
  );

  return [kanaria, gem, base, views];
}

async function deployContracts(): Promise<
  [SimpleEquippable, SimpleEquippable, SimpleCatalog, RMRKEquipRenderUtils]
> {
  const [beneficiary] = await ethers.getSigners();
  const contractFactory = await ethers.getContractFactory("SimpleEquippable");
  const catalogFactory = await ethers.getContractFactory("SimpleCatalog");
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
  const base: SimpleCatalog = await catalogFactory.deploy("KB", "svg");
  const views: RMRKEquipRenderUtils = await viewsFactory.deploy();

  await kanaria.deployed();
  await gem.deployed();
  await base.deployed();
  await views.deployed();
  console.log(
    `Sample contracts deployed to ${kanaria.address}, ${gem.address} and ${base.address}`
  );

  return [kanaria, gem, base, views];
}

async function setupCatalog(base: SimpleCatalog, gemAddress: string): Promise<void> {
  console.log("Setting up Catalog");
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
        metadataURI: "ipfs://backgrounds/1.json",
      },
    },
    {
      // Background option 2
      partId: 2,
      part: {
        itemType: 2, // Fixed
        z: 0,
        equippable: [],
        metadataURI: "ipfs://backgrounds/2.json",
      },
    },
    {
      // Head option 1
      partId: 3,
      part: {
        itemType: 2, // Fixed
        z: 3,
        equippable: [],
        metadataURI: "ipfs://heads/1.json",
      },
    },
    {
      // Head option 2
      partId: 4,
      part: {
        itemType: 2, // Fixed
        z: 3,
        equippable: [],
        metadataURI: "ipfs://heads/2.json",
      },
    },
    {
      // Body option 1
      partId: 5,
      part: {
        itemType: 2, // Fixed
        z: 2,
        equippable: [],
        metadataURI: "ipfs://body/1.json",
      },
    },
    {
      // Body option 2
      partId: 6,
      part: {
        itemType: 2, // Fixed
        z: 2,
        equippable: [],
        metadataURI: "ipfs://body/2.json",
      },
    },
    {
      // Wings option 1
      partId: 7,
      part: {
        itemType: 2, // Fixed
        z: 1,
        equippable: [],
        metadataURI: "ipfs://wings/1.json",
      },
    },
    {
      // Wings option 2
      partId: 8,
      part: {
        itemType: 2, // Fixed
        z: 1,
        equippable: [],
        metadataURI: "ipfs://wings/2.json",
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
  console.log("Catalog is set");
}

async function mintTokens(
  kanaria: SimpleEquippable,
  gem: SimpleEquippable
): Promise<void> {
  console.log("Minting tokens");
  const [ , tokenOwner] = await ethers.getSigners();

  // Mint some kanarias
  console.log("Minting Kanaria tokens");
  let tx = await kanaria.mint(tokenOwner.address, totalBirds, {
    value: pricePerMint.mul(totalBirds),
  });
  await tx.wait();
  console.log(`Minted ${totalBirds} kanarias`);

  // Mint 3 gems into each kanaria
  console.log("Nest-minting Gem tokens");
  let allTx: ContractTransaction[] = [];
  for (let i = 1; i <= totalBirds; i++) {
    let tx = await gem.nestMint(kanaria.address, 3, i, {
      value: pricePerMint.mul(3),
    });
    allTx.push(tx);
  }
  await Promise.all(allTx.map((tx) => tx.wait()));
  console.log(`Minted 3 gems into each kanaria`);

  // Accept 3 gems for each kanaria
  console.log("Accepting Gems");
  for (let tokenId = 1; tokenId <= totalBirds; tokenId++) {
    allTx = [
      await kanaria.connect(tokenOwner).acceptChild(tokenId, 2, gem.address, 3 * tokenId),
      await kanaria.connect(tokenOwner).acceptChild(tokenId, 1, gem.address, 3 * tokenId - 1),
      await kanaria.connect(tokenOwner).acceptChild(tokenId, 0, gem.address, 3 * tokenId - 2),
    ];
  }
  await Promise.all(allTx.map((tx) => tx.wait()));
  console.log(`Accepted gems for each kanaria`);
}

async function addKanariaAssets(
  kanaria: SimpleEquippable,
  catalogAddress: string
): Promise<void> {
  console.log("Adding Kanaria assets");
  const [ , tokenOwner] = await ethers.getSigners();
  const assetDefaultId = 1;
  const assetComposedId = 2;
  let allTx: ContractTransaction[] = [];
  let tx = await kanaria.addEquippableAssetEntry(
    0, // Only used for assets meant to equip into others
    ethers.constants.AddressZero, // base is not needed here
    "ipfs://default.png",
    []
  );
  allTx.push(tx);

  tx = await kanaria.addEquippableAssetEntry(
    0, // Only used for assets meant to equip into others
    catalogAddress, // Since we're using parts, we must define the base
    "ipfs://meta1.json",
    [1, 3, 5, 7, 9, 10, 11] // We're using first background, head, body and wings and state that this can receive the 3 slot parts for gems
  );
  allTx.push(tx);
  // Wait for both assets to be added
  await Promise.all(allTx.map((tx) => tx.wait()));
  console.log("Added 2 asset entries");

  // Add assets to token
  const tokenId = 1;
  allTx = [
    await kanaria.addAssetToToken(tokenId, assetDefaultId, 0),
    await kanaria.addAssetToToken(tokenId, assetComposedId, 0),
  ];
  await Promise.all(allTx.map((tx) => tx.wait()));
  console.log("Added assets to token 1");

  // Accept both assets:
  tx = await kanaria.connect(tokenOwner).acceptAsset(tokenId, 0, assetDefaultId);
  await tx.wait();
  tx = await kanaria.connect(tokenOwner).acceptAsset(tokenId, 0, assetComposedId);
  await tx.wait();
  console.log("Assets accepted");
}

async function addGemAssets(
  gem: SimpleEquippable,
  kanariaAddress: string,
  catalogAddress: string
): Promise<void> {
  console.log("Adding Gem assets");
  const [ , tokenOwner] = await ethers.getSigners();
  // We'll add 4 assets for each gem, a full version and 3 versions matching each slot.
  // We will have only 2 types of gems -> 4x2: 8 assets.
  // This is not composed by others, so fixed and slot parts are never used.
  const gemVersions = 4;

  // These refIds are used from the child's perspective, to group assets that can be equipped into a parent
  // With it, we avoid the need to do set it asset by asset
  const equippableRefIdLeftGem = 1;
  const equippableRefIdMidGem = 2;
  const equippableRefIdRightGem = 3;

  // We can do a for loop, but this makes it clearer.
  console.log("Adding asset entries");
  let allTx = [
    await gem.addEquippableAssetEntry(
      // Full version for first type of gem, no need of refId or base
      0,
      catalogAddress,
      `ipfs://gems/typeA/full.json`,
      []
    ),
    await gem.addEquippableAssetEntry(
      // Equipped into left slot for first type of gem
      equippableRefIdLeftGem,
      catalogAddress,
      `ipfs://gems/typeA/left.json`,
      []
    ),
    await gem.addEquippableAssetEntry(
      // Equipped into mid slot for first type of gem
      equippableRefIdMidGem,
      catalogAddress,
      `ipfs://gems/typeA/mid.json`,
      []
    ),
    await gem.addEquippableAssetEntry(
      // Equipped into left slot for first type of gem
      equippableRefIdRightGem,
      catalogAddress,
      `ipfs://gems/typeA/right.json`,
      []
    ),
    await gem.addEquippableAssetEntry(
      // Full version for second type of gem, no need of refId or base
      0,
      ethers.constants.AddressZero,
      `ipfs://gems/typeB/full.json`,
      []
    ),
    await gem.addEquippableAssetEntry(
      // Equipped into left slot for second type of gem
      equippableRefIdLeftGem,
      catalogAddress,
      `ipfs://gems/typeB/left.json`,
      []
    ),
    await gem.addEquippableAssetEntry(
      // Equipped into mid slot for second type of gem
      equippableRefIdMidGem,
      catalogAddress,
      `ipfs://gems/typeB/mid.json`,
      []
    ),
    await gem.addEquippableAssetEntry(
      // Equipped into right slot for second type of gem
      equippableRefIdRightGem,
      catalogAddress,
      `ipfs://gems/typeB/right.json`,
      []
    ),
  ];

  await Promise.all(allTx.map((tx) => tx.wait()));
  console.log(
    "Added 8 gem assets. 2 Types of gems with full, left, mid and right versions."
  );

  // 9, 10 and 11 are the slot part ids for the gems, defined on the base.
  // e.g. Any asset on gem, which sets its equippableGroupId to equippableRefIdLeftGem
  //      will be considered a valid equip into any kanaria on slot 9 (left gem).
  console.log("Setting valid parent reference IDs");
  allTx = [
    await gem.setValidParentForEquippableGroup(
      equippableRefIdLeftGem,
      kanariaAddress,
      9
    ),
    await gem.setValidParentForEquippableGroup(
      equippableRefIdMidGem,
      kanariaAddress,
      10
    ),
    await gem.setValidParentForEquippableGroup(
      equippableRefIdRightGem,
      kanariaAddress,
      11
    ),
  ];
  await Promise.all(allTx.map((tx) => tx.wait()));

  // We add assets of type A to gem 1 and 2, and type Bto gem 3. Both are nested into the first kanaria
  // This means gems 1 and 2 will have the same asset, which is totally valid.
  console.log("Add assets to tokens");
  allTx = [
    await gem.addAssetToToken(1, 1, 0),
    await gem.addAssetToToken(1, 2, 0),
    await gem.addAssetToToken(1, 3, 0),
    await gem.addAssetToToken(1, 4, 0),
    await gem.addAssetToToken(2, 1, 0),
    await gem.addAssetToToken(2, 2, 0),
    await gem.addAssetToToken(2, 3, 0),
    await gem.addAssetToToken(2, 4, 0),
    await gem.addAssetToToken(3, 5, 0),
    await gem.addAssetToToken(3, 6, 0),
    await gem.addAssetToToken(3, 7, 0),
    await gem.addAssetToToken(3, 8, 0),
  ];
  await Promise.all(allTx.map((tx) => tx.wait()));
  console.log("Added 4 assets to each of 3 gems.");

  // We accept each asset for all gems
  allTx = [
    await gem.connect(tokenOwner).acceptAsset(1, 3, 4),
    await gem.connect(tokenOwner).acceptAsset(1, 2, 3),
    await gem.connect(tokenOwner).acceptAsset(1, 1, 2),
    await gem.connect(tokenOwner).acceptAsset(1, 0, 1),
    await gem.connect(tokenOwner).acceptAsset(2, 3, 4),
    await gem.connect(tokenOwner).acceptAsset(2, 2, 3),
    await gem.connect(tokenOwner).acceptAsset(2, 1, 2),
    await gem.connect(tokenOwner).acceptAsset(2, 0, 1),
    await gem.connect(tokenOwner).acceptAsset(3, 3, 8),
    await gem.connect(tokenOwner).acceptAsset(3, 2, 7),
    await gem.connect(tokenOwner).acceptAsset(3, 1, 6),
    await gem.connect(tokenOwner).acceptAsset(3, 0, 5),
  ];
  await Promise.all(allTx.map((tx) => tx.wait()));
  console.log("Accepted 4 assets to each of 3 gems.");
}

async function equipGems(kanaria: SimpleEquippable): Promise<void> {
  console.log("Equipping gems");
  const [ , tokenOwner] = await ethers.getSigners();
  const allTx = [
    await kanaria.connect(tokenOwner).equip({
      tokenId: 1, // Kanaria 1
      childIndex: 2, // Gem 1 is on position 2
      assetId: 2, // Asset for the kanaria which is composable
      slotPartId: 9, // left gem slot
      childAssetId: 2, // Asset id for child meant for the left gem
    }),
    await kanaria.connect(tokenOwner).equip({
      tokenId: 1, // Kanaria 1
      childIndex: 1, // Gem 2 is on position 1
      assetId: 2, // Asset for the kanaria which is composable
      slotPartId: 10, // mid gem slot
      childAssetId: 3, // Asset id for child meant for the mid gem
    }),
    await kanaria.connect(tokenOwner).equip({
      tokenId: 1, // Kanaria 1
      childIndex: 0, // Gem 3 is on position 0
      assetId: 2, // Asset for the kanaria which is composable
      slotPartId: 11, // right gem slot
      childAssetId: 8, // Asset id for child meant for the right gem
    }),
  ];
  await Promise.all(allTx.map((tx) => tx.wait()));
  console.log("Equipped 3 gems into first kanaria");
}

async function composeEquippables(
  views: RMRKEquipRenderUtils,
  kanariaAddress: string
): Promise<void> {
  console.log("Composing equippables");
  const tokenId = 1;
  const assetId = 2;
  console.log(
    "Composed: ",
    await views.composeEquippables(kanariaAddress, tokenId, assetId)
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
