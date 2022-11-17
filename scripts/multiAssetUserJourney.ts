import { ethers } from "hardhat";
import { SimpleMultiAsset } from "../typechain-types";
import { ContractTransaction } from "ethers";

async function main() {
  const pricePerMint = ethers.utils.parseEther("0.0001");
  const totalTokens = 5;
  const [owner] = await ethers.getSigners();

  const contractFactory = await ethers.getContractFactory(
    "SimpleMultiAsset"
  );
  const token: SimpleMultiAsset = await contractFactory.deploy(
    1000,
    pricePerMint
  );

  await token.deployed();
  console.log(`Sample contract deployed to ${token.address}`);

  // Mint tokens 1 to totalTokens
  console.log("Minting tokens");
  let tx = await token.mint(owner.address, totalTokens, {
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

  const assetIds = await token.getAllAssets();
  console.log("All assets: %s", assetIds);

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

  console.log("Accepting token assets");
  allTx = [];
  for (let i = 1; i <= totalTokens; i++) {
    // Accept pending asset for each token (on index 0)
    let tx = await token.acceptAsset(i, 0);
    allTx.push(tx);
    console.log(`Accepted first pending asset for token ${i}.`);
  }
  console.log("Awaiting for all tx to finish...");
  await Promise.all(allTx.map((tx) => tx.wait()));

  // Few sample queries:
  console.log("Getting URIs");
  const uriToken1 = await token.tokenURI(1);
  const uriFinalToken = await token.tokenURI(totalTokens);

  console.log("Token 1 URI: ", uriToken1);
  console.log("Token totalTokens URI: ", uriFinalToken);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
