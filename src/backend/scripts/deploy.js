async function main() {
  const [deployer] = await ethers.getSigners();

  console.log('Deploying contracts with the account:', deployer.address);
  console.log('Account balance:', (await deployer.getBalance()).toString());

  // Get the ContractFactories and Signers here.
  const erc20Token = await ethers.getContractFactory('cUSDT');
  //   const Marketplace = await ethers.getContractFactory('Marketplace');
  // deploy contracts
  //   const marketplace = await Marketplace.deploy(1);

  const _erc20Token = await erc20Token.deploy();
  console.log('_erc20Token address', _erc20Token);

  // Save copies of each contracts abi and address to the frontend.
  //   saveFrontendFiles(marketplace, 'Marketplace');
  saveFrontendFiles(_erc20Token, 'cUSDT');
}

function saveFrontendFiles(contract, name) {
  const fs = require('fs');
  const contractsDir = __dirname + '/../contractsData';

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + `/${name}-address.json`,
    JSON.stringify({ address: contract.address }, undefined, 2)
  );

  const contractArtifact = artifacts.readArtifactSync(name);

  fs.writeFileSync(
    contractsDir + `/${name}.json`,
    JSON.stringify(contractArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
