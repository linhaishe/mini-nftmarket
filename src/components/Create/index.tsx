import React, { useState } from 'react';
import { Buffer } from 'buffer';

import './index.scss';

const projectId = '2d95181e46f045bcad8abcd7f8307bc9';
const projectSecret = 's1q58PZyuFCaPdQCxvwS7cUNAwO2wXahrchunT/+KfYIho/cK1v+lw';
const GATE_WAY = 'https://amber-defeated-vulture-251.mypinata.cloud';
const PINATA_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI4NzAyMmJjZC02OTA3LTRkZWUtOTE1Yi1hNjI3M2Q0ZDBlYmMiLCJlbWFpbCI6Inh1c3VtdUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiMTVhOGZkMmE4MTFlOThkYzRlMjgiLCJzY29wZWRLZXlTZWNyZXQiOiI2ODJmMzZiY2I0YzRjNTU2M2JiODIyYmU2ZTAxZGNlMjJhNWQyZDY4NzdiNjM1YWIxNWUwNmZlOWE4ZjJhM2YzIiwiaWF0IjoxNzE5NDk0NDQzfQ.VzIdn5-QTSwBsc0VkEd3VA8Xz8pwwMci6gzz20wlc2M';
const auth =
  'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const Create = ({ nft, setIsLoading }: any) => {
  const [image, setImage] = useState('');
  const [price, setPrice] = useState<any>();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

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

  const mintNFT = async () => {
    try {
      if (!price || !name || !description) {
        alert('不能为空');
        return;
      }

      setIsLoading(true);

      const options = {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${PINATA_JWT}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // pinataContent: { image, price, name, description },
          pinataContent: {
            price,
            name,
            description,
            createTime: new Date().getTime(),
          },
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
      setName('');
      setDescription('');
      setPrice('');
      setImage('');
    } catch (error) {
      console.log('error', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='create-form-wrap'>
      <div className='create-form-input-wrap'>
        {/* <input type='file' name='file' onChange={uploadToIPFS} /> */}
        {/* <img
          src='https://cdn-icons-png.flaticon.com/512/12068/12068350.png'
          className='create-nft-img'
        /> */}
        <input
          onChange={(e) => setName(e.target.value)}
          type='text'
          placeholder='Name'
          value={name}
        />
        <input
          type='text'
          onChange={(e) => setDescription(e.target.value)}
          placeholder='Description'
          value={description}
        />
        <input
          onChange={(e) => setPrice(e.target.value)}
          type='number'
          placeholder='Price in erc20 token'
          value={price}
        />
        <div className='nft-action-btn' onClick={mintNFT}>
          Create NFT
        </div>
      </div>
    </div>
  );
};

export default Create;
