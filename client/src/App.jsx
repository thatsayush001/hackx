import { ScrollControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Modal } from "antd";
import { useAtom } from "jotai";
import { useState } from "react";
import { Experience } from "./components/Experience";
import Navbar from "./components/Navbar";
import { SocketManager } from "./components/SocketManager";
import { UI, shopModeAtom } from "./components/UI";
import StoreWalls from "./components/walls/Storewalls";
import StoreWalls2 from "./components/walls/Storewalls2";
import StoreWalls3 from "./components/walls/Storewalls3";
import StoreWalls4 from "./components/walls/Storewalls4";
import { ethers } from 'ethers';
import abi from './abi/NFTGallery.json'; // Make sure to import the ABI

function App() {
  const [shopMode] = useAtom(shopModeAtom);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [link, setLink] = useState("");

  const showModal = (link) => {
    setLink(link);
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
    provider:null,
    signer:null,
    contract:null,
    address:null
  });

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

      const contractAddress = '0x49397BF80Eebf92fa0c1C8DeE417cDDBB1d006c7'; // Replace with your contract address
      const contractABI = abi.abi;

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setAccount(address); // Set the connected account

      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      localStorage.setItem("contract", JSON.stringify(contract));
      setState({ provider, signer, contract, address });
    } catch (error) {
      console.error('Error connecting to Metamask:', error);
    }
  };
  return (
    <>
    <Navbar connectWallet={connectWallet} account={account} state={state}/>
    <Modal
        title="Frame Modal"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>{link}</p>
      </Modal>
      <SocketManager />
      <Canvas shadows camera={{ position: [8, 8, 8], fov: 50 }}>
      <StoreWalls/>
      <StoreWalls2/>
      <StoreWalls3/>
      <StoreWalls4/>
        <color attach="background" args={["#ececec"]} />
        <ScrollControls pages={shopMode ? 4 : 0}>
          <Experience onFrameClick={showModal} />
        </ScrollControls>
      </Canvas>
      <UI state={state} account={account}/>
    </>
  );
}

export default App;
