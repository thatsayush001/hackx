import React, { useState } from 'react';

const Navbar = ({connectWallet,state,account}) => {
 
  // Function to connect to Metamask

  return (
    <nav className="bg-gray-900 border-b border-gray-700 shadow-sm">
    <div className="max-w-screen-xl mx-auto p-4 flex items-center justify-between">
      {/* Logo and Title */}
      <a href="/" className="flex items-center space-x-3">
        <span className="self-center text-2xl font-bold text-white">
          Meta Gallery
        </span>
      </a>
  
      {/* Wallet Connect Section */}
      <div className="flex items-center">
        {account ? (
          <div className="flex items-center space-x-3">
            {/* Connected Account Display */}
            <span className="text-white bg-gray-700 px-4 py-2 rounded-md text-sm font-medium">
              {`Connected: ${account.substring(0, 6)}...${account.substring(account.length - 4)}`}
            </span>
          </div>
        ) : (
          <button
            onClick={connectWallet}
            className="text-gray-900 bg-gray-100 hover:bg-gray-200 transition-colors duration-300 px-4 py-2 rounded-md text-sm font-medium"
          >
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  </nav>
  

  );
};

export default Navbar;
