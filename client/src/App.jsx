import { ScrollControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useAtom } from "jotai";
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
  return (
    <>
    <Navbar/>
      <SocketManager />
      <Canvas shadows camera={{ position: [0,5,0], fov: 50 }}>
      <StoreWalls/>
      <StoreWalls2/>
      <StoreWalls3/>
      <StoreWalls4/>
        <color attach="background" args={["#ececec"]} />
        <ScrollControls pages={shopMode ? 4 : 0}>
          <Experience />
        </ScrollControls>
      </Canvas>
      <UI />
    </>
  );
}

export default App;
