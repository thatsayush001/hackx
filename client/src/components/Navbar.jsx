import React, { useState } from 'react';
import { ethers } from 'ethers';
import abi from '../abi/ArtGallery.json'; // Make sure to import the ABI

const Navbar = () => {
  const [account, setAccount] = useState(null);
  const [state, setState] = useState({
    provider:null,
    signer:null,
    contract:null,
    address:null
  });

  // Function to connect to Metamask
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log('Metamask is not installed');
        return;
      }

      // Listen for changes in the account or chain
      ethereum.on('chainChanged', () => {
        window.location.reload();
      });

      ethereum.on('accountsChanged', () => {
        window.location.reload();
      });

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

      if (accounts.length === 0) {
        console.log('No account found');
        return;
      }

      const contractAddress = '0xe89a60eD235Dab51Cbefa057780Ef52230a74C89'; // Replace with your contract address
      const contractABI = abi.abi;

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      localStorage.setItem("id",address);
      setAccount(address); // Set the connected account

      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      localStorage.setItem("contract", JSON.stringify(contract));
      setState({ provider, signer, contract, address });
    } catch (error) {
      console.error('Error connecting to Metamask:', error);
    }
  };

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            Meta-Gallery
          </span>
        </a>
        <button
          data-collapse-toggle="navbar-default"
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-default"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div className="hidden w-full md:block md:w-auto" id="navbar-default">
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            {/* Add Connect Wallet Button */}
            <li>
              {account ? (
                <span className="text-white bg-green-500 rounded-md px-3 py-2">
                  {`Connected: ${account.substring(0, 6)}...${account.substring(account.length - 4)}`}
                </span>
              ) : (
                <button
                  onClick={connectWallet}
                  className="text-white bg-blue-500 hover:bg-blue-700 rounded-md px-3 py-2"
                >
                  Connect Wallet
                </button>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
