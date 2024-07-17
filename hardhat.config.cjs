/* eslint-disable no-undef */
/** @type import('hardhat/config').HardhatUserConfig */
require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.4',
  local: {
    url: 'http://localhost:8545',
  },
  paths: {
    artifacts: './src/backend/artifacts',
    sources: './src/backend/contracts',
    cache: './src/backend/cache',
    tests: './src/backend/test',
  },
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: [process.env.SEPOLIA_PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY,
    },
  },
};
