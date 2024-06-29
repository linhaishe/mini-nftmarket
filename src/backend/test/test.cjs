/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('NFTMarket', () => {
  let nft721;
  let signers;

  before(async () => {
    // Deploy the NFTMarket contract
    const NFT721 = await ethers.getContractFactory('NFTM');
    signers = await ethers.getSigners();
    const currentSignersAddress = await signers[0].getAddress();
    nft721 = await NFT721.deploy(currentSignersAddress);
  });

  describe('Deployment', function () {
    it('Should track name and symbol of the nft collection', async function () {
      // This test expects the owner variable stored in the contract to be equal
      // to our Signer's owner.
      const nftName = "lin's erc21";
      const nftSymbol = 'SadMonkey';
      expect(await nft721.name()).to.equal(nftName);
      expect(await nft721.symbol()).to.equal(nftSymbol);
    });

    // it('Should track feeAccount and feePercent of the marketplace', async function () {
    //   expect(await marketplace.feeAccount()).to.equal(deployer.address);
    //   expect(await marketplace.feePercent()).to.equal(feePercent);
    // });
  });
});
