import WalletBalance from './WalletBalance';
import { useEffect, useState } from 'react';

import { ethers } from 'ethers';
import FiredGuys from '../artifacts/contracts/MyNFT.sol/FiredGuys.json';
import FellasToken from '../artifacts/contracts/FellasToken.sol/FellasToken.json';

const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

const provider = new ethers.providers.Web3Provider(window.ethereum);

// get the signer
const signer = provider.getSigner();

// get the smart contract (MyNFT Contract)
// const contract = new ethers.Contract(contractAddress, FiredGuys.abi, signer);
// get the smart contract (FellasToken Contract)
const contract = new ethers.Contract(contractAddress, FellasToken.abi, signer);

// Verify metamask is connected to a valid address
const isMetamaskConnected = (window.ethereum.selectedAddress) ? true : false;


function Home() {

  const [totalMinted, setTotalMinted] = useState(0);
  const [contracBalance, setContractBalance] = useState(0);

  useEffect(() => {
    getCount();
    getContractBalance();
  }, []);

  const getCount = async () => {
    if (!isMetamaskConnected) {
      return;
    }

    const count = await contract.count();
    console.log('Token count = ' + parseInt(count));
    setTotalMinted(parseInt(count));
  };

  const getContractBalance = async () => {
    if (!isMetamaskConnected) {
      return;
    }

    setContractBalance(ethers.utils.formatEther(await contract.getBalance()));
  };

  const withdrawBalance = async () => {
    try {
        const result = await contract.withdraw();
        await result.wait();
    } catch (error) {
        console.log(error)
        alert(error);
    }

    getContractBalance();
  };

  return (
    <div>
      <WalletBalance />

      <div className="row">
        <div className="col-sm">
                
            <h1>Fellas Token NFT Collection</h1>
          <ul>
            <li>Free Mint only VIP</li>
            <li>Whitelist (first 20) at ETH 0.0001</li>
            <li>Mint at ETH 0.0005</li>
          </ul>
        </div>
        <div className="col-sm">
          <div className="card">
              <div className="card-body">
                <h5 className="card-title">Contract Balance: {contracBalance} Ether</h5>
                <button className="btn btn-success" onClick={() => withdrawBalance()}>Withdraw</button>
              </div>
            </div>
          </div>
      </div>

      
      <div className="container">
        <div className="row">
          {Array(totalMinted + 2)
            .fill(0)
            .map((_, i) => (
              i != 0 &&
              <div key={i} className="col-sm">
                <NFTImage tokenId={i} getCount={getCount} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

function NFTImage({ tokenId, getCount }) {
  const [offer, setOffer] = useState('0.0005');
  const handleOfferChange = (e) => setOffer(e.target.value);

  const contentId = import.meta.env.VITE_CONTENT_ID;
  const metadataURI = `ipfs://${contentId}/${tokenId}.json`;
  const imageURI = `https://gateway.pinata.cloud/ipfs/${contentId}/${tokenId}.svg`;

  const [isMinted, setIsMinted] = useState(false);
  useEffect(() => {
    getMintedStatus();
  }, [isMinted]);

  const getMintedStatus = async () => {
    if (!isMetamaskConnected) {
      return;
    }

    const result = await contract.isContentOwned(metadataURI);
    // console.log('TokenID = ' + tokenId + ', IsContentOwned = ' + result);
    setIsMinted(result);
  };

  const mintToken = async () => {
    // Contract becomes owner
    // const connection = contract.connect(signer);
    // const addr = connection.address;

    try {
        // User Address
        const userAddress = await signer.getAddress();

        const result = await contract.mintSingleFellas(userAddress, metadataURI, {
          value: ethers.utils.parseEther(offer),
        });
        await result.wait();
    } catch (error) {
        console.log(error.code)
        alert(error.code);
    }

    getMintedStatus();
    getCount();
  };

  const whitelistMint = async () => {

    try {
        // User Address
        const userAddress = await signer.getAddress();

        const result = await contract.whitelistMint(userAddress, metadataURI, {
         
          value: ethers.utils.parseEther(offer),
        });
        await result.wait();
    } catch (error) {
        console.log(error.code)
        alert('Whitelist Minting is over');
    }

    getMintedStatus();
    getCount();
  };

  const freeMint = async () => {
    try {
        // User Address
        const userAddress = await signer.getAddress();
        const result = await contract.freeMint(userAddress, metadataURI, {
          value: ethers.utils.parseEther(offer),
        });
        await result.wait();
    } catch (error) {
        console.log(error.code)
        alert(error.code);
    }

    getMintedStatus();
    getCount();
  };

  async function getURI() {
    const uri = await contract.tokenURI(tokenId);
    alert(uri);
  }
  return (
    <div className="card" style={{ width: '18rem', margin: 10 }}>
      <img className="card-img-top" src={isMinted ? imageURI : 'img/placeholder.png'}></img>
      <div className="card-body">
        <h5 className="card-title">ID #{tokenId}</h5>
        
        {!isMinted ? (  
          <div className="row">
            <div>
            ETH: 
            <input
              type="number"
              // defaultValue={offer}
              value={offer}
              onChange={handleOfferChange}
            />
            </div>
            <p></p>
            <div className="col-sm">
              <button className="btn btn-primary" onClick={freeMint}>
              Free Mint
            </button>
            </div>
            <div className="col-sm">
            <button className="btn btn-primary" onClick={whitelistMint}>
              Whitelist
            </button>
            </div>
            <div className="col-sm">
            <button className="btn btn-primary" onClick={mintToken}>
              Mint
            </button>
            </div>
          </div>
          
        ) : (
          <button className="btn btn-secondary" onClick={getURI}>
            Taken! Show URI
          </button>
        )}
      </div>
    </div>
  );
}

export default Home;
