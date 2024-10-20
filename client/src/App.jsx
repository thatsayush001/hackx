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

  return (
    <>
    <Navbar/>
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
      <UI />
    </>
  );
}

export default App;
