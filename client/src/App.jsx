import { ScrollControls, Sky } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Modal } from "antd";
import { useAtom } from "jotai";
import { useState } from "react";
import { Experience } from "./components/Experience";
import Navbar from "./components/Navbar";
import { SocketManager, socket, mapAtom } from "./components/SocketManager";
import { UI, shopModeAtom } from "./components/UI";
import StoreWalls from "./components/walls/Storewalls";
import StoreWalls2 from "./components/walls/Storewalls2";
import StoreWalls3 from "./components/walls/Storewalls3";
import StoreWalls4 from "./components/walls/Storewalls4";
import { ethers, parseEther } from "ethers";
import abi from "./abi/NFTGallery.json"; // Make sure to import the ABI
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [shopMode] = useAtom(shopModeAtom);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [id, setId] = useState("");
  const [price, setPrice] = useState("");
  const [likes, setLikes] = useState(0);

  const [map] = useAtom(mapAtom);

  const showModal = (id, price, likes) => {
    setId(id);
    console.log(id);
    setPrice(price);
    setLikes(likes);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const [account, setAccount] = useState(null);
  const [state, setState] = useState({
    provider: null,
    signer: null,
    contract: null,
    address: null,
  });
  const [bid, setBid] = useState(null);

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Metamask is not installed");
        return;
      }

      // Listen for changes in the account or chain
      ethereum.on("chainChanged", () => {
        window.location.reload();
      });

      ethereum.on("accountsChanged", () => {
        window.location.reload();
      });

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length === 0) {
        console.log("No account found");
        return;
      }

      const contractAddress = "0x49397BF80Eebf92fa0c1C8DeE417cDDBB1d006c7"; // Replace with your contract address
      const contractABI = abi.abi;

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setAccount(address); // Set the connected account
      socket.emit("characterAvatarUpdate", null, address);
      localStorage.setItem("address", address);
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      localStorage.setItem("contract", JSON.stringify(contract));
      setState({ provider, signer, contract, address });
    } catch (error) {
      console.error("Error connecting to Metamask:", error);
    }
  };

  const handleBuy = async (id, price) => {
    try {
      // Ensure that state.contract is available
      if (!state.contract) {
        console.error("Contract not initialized");
        return;
      }

      // Parse the price from Ether to Wei
      const tx = await state.contract.buyArt(id, {
        value: ethers.parseEther(String(price)), // Ensure price is a string like "0.1"
      });

      // Wait for the transaction to be confirmed
      await tx.wait();

      toast.success("Bought Successfully!!");
      console.log("Bought Successfully!!");
      let tempItem = map.items;

      tempItem = tempItem.filter(
        (item) => !(item.name === "frame" && item.id === id)
      );
      socket.emit("itemsUpdate", tempItem);
    } catch (error) {
      console.error("Error buying art:", error);
    }
  };
  const handleBid = async (id, bid) => {
    try {
      const tx = await state.contract.placeBid(id, {
        value: ethers.parseEther(String(bid)),
      });
      await tx.wait();
      toast.success("Bid Successfully!!");
    } catch (error) {
      console.log(error);
    }
  };
  const handleToggle = async (id) => {
    try {
      const tx = await state.contract.toggleAuction(id);
      await tx.wait();
      let tempItem = map.items;
      tempItem.map((item) => {
        if (item.name === "frame" && item.id === id) {
          console.log(item)
          item.auctionActive = !item.auctionActive;
          console.log(item)
        }
      });
      socket.emit("itemsUpdate", tempItem);
      console.log("Auction Toggled");
      toast.success("Auction Toggled");
    } catch (error) {}
  };
  const [bidders, setBidders] = useState([]);
  const [isBiddersModalVisible, setIsBiddersModalVisible] = useState(false); // Control the visibility of bidders modal

  const handleGetBidders = async (id) => {
    try {
      const fetchedBidders = await state.contract.getBidders(id);
      // await fetchedBidders.wait();
      setBidders(fetchedBidders);
      setIsBiddersModalVisible(true);

      console.log("Bidders fetched");
    } catch (error) {
      console.log(error);
    }
  };
  const [maxBid, setMaxBid] = useState(null); // To store the maximum bid
  const [isMaxBidModalVisible, setIsMaxBidModalVisible] = useState(false); // Control the visibility of max bid modal
  const handleGetMaxBid = async (id) => {
    try {
      const fetchedMaxBid = await state.contract.getMaxBid(id);
      
      // Convert the fetched value from Wei to Ether for display
      const maxBidInEther = ethers.formatEther(fetchedMaxBid);
      
      // After fetching, store the max bid and open the modal
      setMaxBid(maxBidInEther);
      setIsMaxBidModalVisible(true);
      
      console.log("Max bid fetched:", maxBidInEther);
    } catch (error) {
      console.error("Error fetching max bid:", error);
    }
  };
  const handleLike = async (id) => {
    try {
      const tx = await state.contract.likeArt(id);
      await tx.wait();
      let tempItem = map.items;
      tempItem.map((item) => {
        if (item.name === "frame" && item.id === id) {
          console.log(item)
          item.likes = item.likes + 1;
          setLikes(item.likes);
        }
      });
      socket.emit("itemsUpdate", tempItem);
      toast.success("Art liked successfully!");
      console.log("Art liked successfully!");

      // Optionally, fetch the updated number of likes
    } catch (error) {
      console.error("Error liking art:", error);
    }
  };

  return (
    <>
      <ToastContainer />
      <Navbar connectWallet={connectWallet} account={account} state={state} />
      <Modal
        title="Frame Modal"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p className="text-lg font-semibold">Art ID: {id}</p>

        {/* Buy Button */}
        <button
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
          onClick={() => handleBuy(id, price)}
        >
          Buy
        </button>

        {/* Bid Section */}
        <div className="mt-4">
          <input
            type="text"
            className="border border-gray-300 rounded px-4 py-2 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your bid"
            onChange={(e) => setBid(e.target.value)}
          />
          <button
            className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-700 transition duration-300 w-full"
            onClick={() => handleBid(id, bid)}
          >
            Bid
          </button>
        </div>

        {/* Toggle Auction Button */}
        {map?.items.find(item => 
  item.name === "frame" && 
  item.by === localStorage.getItem("address") && 
  item.id === id
) && (
  <button
    className="bg-yellow-500 text-white font-bold py-2 px-4 rounded hover:bg-yellow-600 transition duration-300 mt-4 w-full"
    onClick={() => handleToggle(id)}
  >
    Toggle Auction
  </button>
)}

        {/* <button
          className="bg-yellow-500 text-white font-bold py-2 px-4 rounded hover:bg-yellow-600 transition duration-300 mt-4 w-full"
          onClick={() => handleToggle(id)}
        >
          Toggle Auction
        </button> */}

        {/* View Bidders Button */}
        <button
          className="bg-purple-500 text-white font-bold py-2 px-4 rounded hover:bg-purple-700 transition duration-300 mt-4 w-full"
          onClick={() => handleGetBidders(id)}
        >
          View Bidders
        </button>

        {/* View Max Bid Button */}
        <button
          className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-700 transition duration-300 mt-4 w-full"
          onClick={() => handleGetMaxBid(id)}
        >
          {maxBid ? `Max Bid: ${maxBid} ETH` : "View Max Bid"}
        </button>
        <div className="mt-4 flex items-center space-x-2">
          <button
            className="flex items-center bg-pink-500 text-white font-bold py-2 px-4 rounded hover:bg-pink-700 transition duration-300"
            onClick={() => handleLike(id)}
          >
            {/* Heart SVG */}
            <svg
              className="w-6 h-6 fill-current text-white mr-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            {/* Number of likes */}
            <span>{likes}</span>
          </button>
        </div>

        {/* Bidders Modal */}
        <Modal
          title="Bidders List"
          open={isBiddersModalVisible}
          onOk={() => setIsBiddersModalVisible(false)}
          onCancel={() => setIsBiddersModalVisible(false)}
        >
          <div className="text-lg font-semibold">
            <p>Art ID: {id}</p>
            <p className="mt-4">List of Bidders:</p>
            <ul className="list-disc ml-4 mt-2">
              {bidders.length > 0 ? (
                bidders.map((bidder, index) => (
                  <li key={index} className="mt-2">
                    {bidder}
                  </li>
                ))
              ) : (
                <p>No bidders found</p>
              )}
            </ul>
          </div>
        </Modal>
      </Modal>

      <Modal
        title="Bidders List"
        open={isBiddersModalVisible}
        onOk={() => setIsBiddersModalVisible(false)}
        onCancel={() => setIsBiddersModalVisible(false)}
      >
        <div className="text-lg font-semibold">
          <p>Art ID: {id}</p>
          <p className="mt-4">List of Bidders:</p>
          <ul className="list-disc ml-4 mt-2">
            {bidders.length > 0 ? (
              bidders.map((bidder, index) => (
                <li key={index} className="mt-2">
                  {bidder}
                </li>
              ))
            ) : (
              <p>No bidders found</p>
            )}
          </ul>
        </div>
      </Modal>

      <SocketManager />
      <Canvas shadows camera={{ position: [8, 8, 8], fov: 50 }}>
        <Sky/>
        <StoreWalls />
        <StoreWalls2 />
        <StoreWalls3 />
        <StoreWalls4 />
        <color attach="background" args={["#ececec"]} />
        <ScrollControls pages={shopMode ? 4 : 0}>
          <Experience
            onFrameClick={showModal}
            account={account}
            contractState={state}
          />
        </ScrollControls>
      </Canvas>
      <UI state={state} account={account} />
    </>
  );
}

export default App;
