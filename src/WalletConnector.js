import React, { useState } from 'react';
import { ethers } from 'ethers';
import './wallet_connector.css'; // Add Ethereum-themed styles

const WalletConnector = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setWalletAddress(address);

        const balance = await provider.getBalance(address);
        setBalance(ethers.formatEther(balance));

        const txs = await provider.getTransactionCount(address);
        const transactions = [];
        for (let i = 0; i < Math.min(txs, 10); i++) {
          const tx = await provider.getTransaction(address, i);
          transactions.push(tx);
        }
        setTransactions(transactions);
        setError(null);
      } catch (error) {
        setError("Error connecting to wallet: " + error.message);
      }
    } else {
      setError("MetaMask not installed");
    }
  };

  const disconnectWallet = () => {
    // Reset state to disconnect wallet
    setWalletAddress("");
    setBalance(null);
    setTransactions([]);
    setError(null);
  };

  return (
    <div className="wallet-connector">
      {!walletAddress ? (
        <h1 className="title">Connect Your Ethereum Wallet</h1>
      ) : (
        <h1 className="title">Ethereum</h1>
      )}
      
      
      {!walletAddress ? (
        <button onClick={connectWallet} className="wallet-button">
          Connect Wallet
        </button>
      ) : (
        <button onClick={disconnectWallet} className="wallet-button disconnect">
          Disconnect Wallet
        </button>
      )}

      {error && <p className="error">{error}</p>}

      {walletAddress && (
        <div className="wallet-info">
          <div className="wallet-details">
            <p><strong>Wallet Address:</strong> {walletAddress}</p>
            <p><strong>Balance:</strong> {balance} ETH</p>
          </div>

          <div className="transactions-section">
            <h3>Last 10 Transactions:</h3>
            {transactions.length > 0 ? (
              <ul className="transactions">
                {transactions.map((tx, i) => (
                  <li key={i}>
                    <p><strong>Tx Hash:</strong> {tx.hash}</p>
                    <p><strong>Block Number:</strong> {tx.blockNumber}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No recent transactions found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletConnector;
