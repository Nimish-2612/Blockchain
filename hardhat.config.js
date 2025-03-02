require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.17",
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    // For deployment to testnets/mainnet, add configurations here:
    // ropsten: {
    //   url: "https://ropsten.infura.io/v3/YOUR_INFURA_PROJECT_ID",
    //   accounts: ["YOUR_PRIVATE_KEY"]
    // }
  }
};
