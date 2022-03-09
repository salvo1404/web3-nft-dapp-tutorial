import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

function WalletBalance() {

    const [balance, setBalance] = useState();
    
    useEffect(() => {
      getBalance();
    }, []);

    const getBalance = async () => {
        if(!window.ethereum.selectedAddress) {
          return;
        }

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(window.ethereum.selectedAddress);
        setBalance(ethers.utils.formatEther(balance));
    };
  
    const connectMyWallet = async () => {
      const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
    };

    return (
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Your Balance: {balance}</h5>
          <button className="btn btn-success" onClick={() => connectMyWallet()}>Connect my wallet</button>
        </div>
      </div>
    );
  };
  
  export default WalletBalance;