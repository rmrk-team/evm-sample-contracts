import { ethers } from "hardhat";
import { SimpleNestableMultiAsset } from "../typechain-types";
import { ContractTransaction } from "ethers";

async function main() {
  const pricePerMint = ethers.utils.parseEther("0.0000000001");
  const totalTokens = 5;
  const [ owner, tokenOwner] = await ethers.getSigners();

  const contractFactory = await ethers.getContractFactory(
    "SimpleNestableMultiAsset"
  );
  const token: SimpleNestableMultiAsset = await contractFactory.deploy(
    {
      erc20TokenAddress: ethers.constants.AddressZero,
      tokenUriIsEnumerable: true,
      royaltyRecipient: await owner.getAddress(),
      royaltyPercentageBps: 10,
      maxSupply: 1000,
      pricePerMint: pricePerMint
    }
  );

  await token.deployed();
  console.log(`Sample contract deployed to ${token.address}`);

  // Mint tokens 1 to totalTokens
  console.log("Minting NFTs");
  let tx = await token.mint(tokenOwner.address, totalTokens, {
    value: pricePerMint.mul(totalTokens),
  });
  await tx.wait();
  console.log(`Minted ${totalTokens} tokens`);
  const totalSupply = await token.totalSupply();
  console.log("Total tokens: %s", totalSupply);

  // Add entries and add to tokens
  console.log("Adding assets");
  let allTx: ContractTransaction[] = [];
  for (let i = 1; i <= totalTokens; i++) {
    let tx = await token.addAssetEntry(`ipfs://metadata/${i}.json`);
    allTx.push(tx);
  }
  console.log(`Added ${totalTokens} assets`);

  console.log("Awaiting for all tx to finish...");
  await Promise.all(allTx.map((tx) => tx.wait()));

  console.log("Adding assets to tokens");
  allTx = [];
  for (let i = 1; i <= totalTokens; i++) {
    // We give each token a asset id with the same number. This is just a coincidence, not a restriction.
    let tx = await token.addAssetToToken(i, i, 0);
    allTx.push(tx);
    console.log(`Added asset ${i} to token ${i}.`);
  }
  console.log("Awaiting for all tx to finish...");
  await Promise.all(allTx.map((tx) => tx.wait()));

  console.log("Accepting assets to tokens");
  allTx = [];
  for (let i = 1; i <= totalTokens; i++) {
    // Accept pending asset for each token (on index 0)
    let tx = await token.connect(tokenOwner).acceptAsset(i, 0, i);
    allTx.push(tx);
    console.log(`Accepted first pending asset for token ${i}.`);
  }
  console.log("Awaiting for all tx to finish...");
  await Promise.all(allTx.map((tx) => tx.wait()));

  // Few sample queries:
  console.log("Getting URIs");
  const uriToken1 = await token.tokenURI(1);
  const uriToken5 = await token.tokenURI(totalTokens);

  console.log("Token 1 URI: ", uriToken1);
  console.log("Token totalTokens URI: ", uriToken5);

  // Transfer token 5 into token 1
  console.log("Nesting token with ID 5 into token with ID 1");
  await token.connect(tokenOwner).nestTransferFrom(tokenOwner.address, token.address, 5, 1, "0x");
  const parentId = await token.ownerOf(5);
  const rmrkParent = await token.directOwnerOf(5);
  console.log("Token's id 5 owner  is ", parentId);
  console.log("Token's id 5 rmrk owner is ", rmrkParent);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
