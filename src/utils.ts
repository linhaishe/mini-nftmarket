export const getNfts = async (address: any) => {
  try {
    const baseURL =
      'https://eth-sepolia.g.alchemy.com/v2/ywgT-Uea3J3QNFoOeZ5rjAdKyG1Yze5z';
    const url = `${baseURL}/getNFTs/?owner=${address}`;

    const requestOptions = {
      method: 'get',
      redirect: 'follow',
    };

    const response = await fetch(url, requestOptions);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('error', error);
  }
};
