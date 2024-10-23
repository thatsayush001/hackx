import React, { useState } from 'react';

const Navbar = ({connectWallet,state,account}) => {
 
  // Function to connect to Metamask

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            Meta Gallery
          </span>
        </a>
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
      </div>
    </nav>
  );
};

export default Navbar;
