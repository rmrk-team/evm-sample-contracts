import { ethers } from "hardhat";
import { SimpleNestingMultiResource } from "../../typechain-types";
import { ContractTransaction } from "ethers";

async function main() {
  const pricePerMint = ethers.utils.parseEther("0.0000000001");
  const totalTokens = 5;
  const [owner] = await ethers.getSigners();

  const contractFactory = await ethers.getContractFactory(
    "SimpleNestingMultiResource"
  );
  const token: SimpleNestingMultiResource = await contractFactory.deploy();

  await token.deployed();
  console.log(`Sample contract deployed to ${token.address}`);

  // Mint tokens 1 to totalTokens
  let tx = await token.mint(owner.address, totalTokens, {
    value: pricePerMint.mul(totalTokens),
  });
  await tx.wait();
  console.log(`Minted ${totalTokens} tokens`);
  const totalSupply = await token.totalSupply();
  console.log("Total tokens: %s", totalSupply);

  // Add entries and add to tokens
  let allTx: ContractTransaction[] = [];
  for (let i = 1; i <= totalTokens; i++) {
    let tx = await token.addResourceEntry(`ipfs://metadata/${i}.json`);
    allTx.push(tx);
  }
  console.log(`Added ${totalTokens} resources`);

  console.log("Awaiting for all tx to finish...");
  await Promise.all(allTx.map((tx) => tx.wait()));

  const resourceIds = await token.getAllResources();
  console.log("All resources: %s", resourceIds);

  allTx = [];
  for (let i = 1; i <= totalTokens; i++) {
    // We give each token a resource id with the same number. This is just a coincidence, not a restriction.
    let tx = await token.addResourceToToken(i, i, 0);
    allTx.push(tx);
    console.log(`Added resource ${i} to token ${i}.`);
  }
  console.log("Awaiting for all tx to finish...");
  await Promise.all(allTx.map((tx) => tx.wait()));

  allTx = [];
  for (let i = 1; i <= totalTokens; i++) {
    // Accept pending resource for each token (on index 0)
    let tx = await token.acceptResource(i, 0);
    allTx.push(tx);
    console.log(`Accepted first pending resource for token ${i}.`);
  }
  console.log("Awaiting for all tx to finish...");
  await Promise.all(allTx.map((tx) => tx.wait()));

  // Few sample queries:
  const uriToken1 = await token.tokenURI(1);
  const uriToken5 = await token.tokenURI(totalTokens);

  console.log("Token 1 URI: ", uriToken1);
  console.log("Token totalTokens URI: ", uriToken5);

  // Transfer token 5 into token 1
  await token.nestTransfer(token.address, 5, 1);
  const parentId = await token.ownerOf(5);
  const rmrkParent = await token.rmrkOwnerOf(5);
  console.log("Token's id 5 owner  is ", parentId);
  console.log("Token's id 5 rmrk owner is ", rmrkParent);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
