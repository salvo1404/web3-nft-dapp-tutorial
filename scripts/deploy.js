const hre = require("hardhat");

async function main() {

  // We get the contract to deploy
  const FellasToken = await hre.ethers.getContractFactory("FellasToken");
  const fellasToken = await FellasToken.deploy();

  await fellasToken.deployed();

  console.log("FellasToken NFT deployed to:", fellasToken.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
