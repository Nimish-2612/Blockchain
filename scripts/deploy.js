const hre = require("hardhat");

async function main() {
  const RealEstateToken = await hre.ethers.getContractFactory("RealEstateToken");
  console.log("Deploying RealEstateToken...");
  const realEstateToken = await RealEstateToken.deploy();
  await realEstateToken.deployed();
  console.log("RealEstateToken deployed to:", realEstateToken.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
