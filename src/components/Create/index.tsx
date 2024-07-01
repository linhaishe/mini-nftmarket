import { useEffect, useState } from 'react';
import { ethers, BigNumber } from 'ethers';
import { Row, Form, Button } from 'react-bootstrap';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import { Buffer } from 'buffer';
// import 'dotenv/config';
import { useAccount } from 'wagmi';
// import { GATE_WAY, PINATA_JWT } from '../../test';
import { fetchNFTForAddress, getNfts, queryWalletNFTs } from '../../api';
import './index.scss';

const projectId = '2d95181e46f045bcad8abcd7f8307bc9';
const projectSecret = 's1q58PZyuFCaPdQCxvwS7cUNAwO2wXahrchunT/+KfYIho/cK1v+lw';
const GATE_WAY = 'https://amber-defeated-vulture-251.mypinata.cloud';
const PINATA_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI4NzAyMmJjZC02OTA3LTRkZWUtOTE1Yi1hNjI3M2Q0ZDBlYmMiLCJlbWFpbCI6Inh1c3VtdUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiMTVhOGZkMmE4MTFlOThkYzRlMjgiLCJzY29wZWRLZXlTZWNyZXQiOiI2ODJmMzZiY2I0YzRjNTU2M2JiODIyYmU2ZTAxZGNlMjJhNWQyZDY4NzdiNjM1YWIxNWUwNmZlOWE4ZjJhM2YzIiwiaWF0IjoxNzE5NDk0NDQzfQ.VzIdn5-QTSwBsc0VkEd3VA8Xz8pwwMci6gzz20wlc2M';
const auth =
  'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');
const client = ipfsHttpClient({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  apiPath: '/api/v0',
  headers: {
    authorization: auth,
  },
});

const Create = ({ marketplace, nft, erc20Contract }: any) => {
  const { address } = useAccount();
  const [image, setImage] = useState('');
  const [price, setPrice] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tokenId, setTokenId] = useState(null);
  const [listingPrice, setListingPrice] = useState('0');

  const getOwnerOf = async () => {
    if (!nft) {
      return;
    }
    console.log('balanceOf address', address);

    const transaction = await nft?.balanceOf(address);

    console.log('test', transaction);
  };

  const getNfts = async (address22: any) => {
    const baseURL =
      'https://eth-sepolia.g.alchemy.com/v2/ywgT-Uea3J3QNFoOeZ5rjAdKyG1Yze5z';
    const url = `${baseURL}/getNFTs/?owner=${address22}`;

    const requestOptions = {
      method: 'get',
      redirect: 'follow',
    };

    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((data) => console.log(111, data))
      .catch((error) => console.log('error', error));
  };

  const getContractNfts = async (address11: any) => {
    const baseURL =
      'https://eth-sepolia.g.alchemy.com/nft/v2/ywgT-Uea3J3QNFoOeZ5rjAdKyG1Yze5z/getNFTsForCollection';
    const url = `${baseURL}?contractAddress=${address11}`;

    const requestOptions = {
      method: 'get',
      redirect: 'follow',
    };

    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((response) => JSON.stringify(response, null, 2))
      .then((result) => console.log(222, JSON.parse(result)))
      .catch((error) => console.log('error', error));
  };

  useEffect(() => {
    console.log('address', address, marketplace.address);
    // queryWalletNFTs(address);
    // fetchNFTForAddress(address);
    // getOwnerOf();
    getNfts(marketplace.address);
    getContractNfts(marketplace.address);
  }, []);

  const uploadToIPFS = async (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    if (typeof file !== 'undefined') {
      try {
        const formData = new FormData();
        formData.append('file', file);
        const metadata = JSON.stringify({
          name: 'Filename test',
        });
        formData.append('pinataMetadata', metadata);

        const options = JSON.stringify({
          cidVersion: 0,
        });
        formData.append('pinataOptions', options);

        const res = await fetch(
          'https://api.pinata.cloud/pinning/pinFileToIPFS',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${PINATA_JWT}`,
              'Access-Control-Allow-Origin': '*',
            },
            body: formData,
          }
        );
        const resData = await res.json();
        setImage(`${GATE_WAY}/ipfs/${resData?.IpfsHash}`);
      } catch (error) {
        console.log('ipfs image upload error: ', error);
      }
    }
  };

  const createNFT = async () => {
    if (!price || !name || !description) return;
    try {
      const options = {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${PINATA_JWT}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pinataContent: { image, price, name, description },
          pinataMetadata: { name: 'crate token' },
        }),
      };
      const res = await fetch(
        'https://api.pinata.cloud/pinning/pinJSONToIPFS',
        options
      );
      const resData = await res.json();
      // mintThenList(resData);
    } catch (error) {
      console.log('ipfs uri upload error: ', error);
    }
  };

  const mintNFT = async () => {
    try {
      const options = {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${PINATA_JWT}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // pinataContent: { image, price, name, description },
          pinataContent: { price, name, description },
          pinataMetadata: { name: 'crate token' },
        }),
      };
      const res = await fetch(
        'https://api.pinata.cloud/pinning/pinJSONToIPFS',
        options
      );
      const resData = await res.json();
      const uri = `${GATE_WAY}/ipfs/${resData?.IpfsHash}`;
      // mint nft
      const transaction = await nft.safeMint(uri);
      const res9 = await transaction.wait();
      console.log('123', res9);
    } catch (error) {
      console.log('error', error);
    }
  };

  const listingNFT = async () => {
    try {
      console.log('tokenId', tokenId);
      console.log('listingPrice', listingPrice);

      const isApprovalForAll = await nft.isApprovedForAll(
        address,
        marketplace.address
      );

      if (!isApprovalForAll) {
        // set approval for all to market through nft contract
        const approvalTransaction = await nft.setApprovalForAll(
          marketplace.address,
          true
        );
        const approvalRes = await approvalTransaction.wait();
        console.log('approvalRes', approvalRes);
      }

      const isEnoughAllowance = await erc20Contract.allowance(
        address,
        marketplace.address
      );
      console.log(
        'isEnoughAllowance',
        isEnoughAllowance._hex,
        BigNumber.from(isEnoughAllowance._hex).toString()
      );

      if (isEnoughAllowance < listingPrice) {
        const approve = await erc20Contract.approve(
          marketplace.address,
          listingPrice
        );

        const approveRsp = await approve.wait();
        console.log('approveRsp', approveRsp);
      }

      // 检查市场里是否已经有这个NFT
      const { exists } = await marketplace.getMarketItemById(1);
      console.log('isExist', exists);

      if (!exists) {
        const addItemToMarket = await marketplace.addItemToMarket(
          tokenId,
          listingPrice
        );
        const addItemToMarketRes = await addItemToMarket.wait();
        console.log('addItemToMarketRes', addItemToMarketRes);
      }

      const createSale = await marketplace.createSale(1, true, 5);
      const createSaleRes = await createSale.wait();
      console.log('createSaleRes', createSaleRes);
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className='container-fluid mt-5'>
      <div className='row'>
        <main
          role='main'
          className='col-lg-12 mx-auto'
          style={{ maxWidth: '1000px' }}
        >
          <div className='content mx-auto'>
            <Row className='g-4'>
              {/* <Form.Control
                type='file'
                required
                name='file'
                onChange={uploadToIPFS}
              /> */}
              <Form.Control
                onChange={(e) => setName(e.target.value)}
                size='lg'
                required
                type='text'
                placeholder='Name'
              />
              <Form.Control
                onChange={(e) => setDescription(e.target.value)}
                size='lg'
                required
                as='textarea'
                placeholder='Description'
              />
              <Form.Control
                onChange={(e) => setPrice(e.target.value)}
                size='lg'
                required
                type='number'
                placeholder='Price in ETH'
              />
              <div className='d-grid px-0'>
                <Button onClick={mintNFT} variant='primary' size='lg'>
                  mint NFT!
                </Button>
              </div>
            </Row>
          </div>
        </main>
      </div>

      <div className='row'>
        <main
          role='main'
          className='col-lg-12 mx-auto'
          style={{ maxWidth: '1000px' }}
        >
          <div className='content mx-auto'>
            <Row className='g-4'>
              {/* <Form.Control
                type='file'
                required
                name='file'
                onChange={uploadToIPFS}
              /> */}
              <Form.Control
                onChange={(e) => setTokenId(e.target.value)}
                size='lg'
                required
                type='text'
                placeholder='tokenId'
              />
              <Form.Control
                onChange={(e) => setListingPrice(e.target.value)}
                size='lg'
                required
                type='number'
                placeholder='Price in erc20 token'
              />
              <div className='d-grid px-0'>
                <Button onClick={listingNFT} variant='primary' size='lg'>
                  Listing NFT!
                </Button>
              </div>
            </Row>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Create;
