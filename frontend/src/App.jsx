import { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "./abi/ArtGallery.json";
import axios from 'axios';
import Modal from "./components/Modal";

export default function Home() {
  const [account, setAccount] = useState(null);
  const [state, setState] = useState({
    provider: null,
    signer: null,
    contract: null,
    address: null,
  });
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState('');
  const [creator, setCreator] = useState('');
  const [uri, setUri] = useState('');
  const [price, setPrice] = useState('');
  const [artType, setArtType] = useState('0');
  const [artPieces, setArtPieces] = useState([]);
  const [bidAmount, setBidAmount] = useState(''); // State for bid amount
  const [modalOpen, setModalOpen] = useState(false);
  const [bidders, setBidders] = useState([]);

  const connectWallet = async () => {
    if (window.ethereum) {
      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
      window.ethereum.on("accountsChanged", () => {
        window.location.reload();
      });

      const contractAddress = "0xe89a60eD235Dab51Cbefa057780Ef52230a74C89";
      const contractABI = abi.abi;

      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        const address = await signer.getAddress();

        setAccount(address);
        setState({ provider, signer, contract, address });
        setLoading(false);
      } catch (error) {
        console.error("Error connecting to Metamask:", error);
      }
    } else {
      console.log("Metamask is not installed");
    }
  };

  const handleImageChange = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    const res = await axios({
      method: "post",
      url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
      data: formData,
      headers: {
        pinata_api_key: `5e8db1b4171d22da6412`,
        pinata_secret_api_key: `929a0eb2665eb253867cbc7220cc61ab5d33a417ea8a834a4ce09a86f6db8a79`,
        "Content-Type": "multipart/form-data",
      },
    });
    const resData = await res.data;
    setUri(`https://ipfs.io/ipfs/${resData.IpfsHash}`);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const tx = await state.contract.uploadArt(
        title,
        creator,
        uri,
        ethers.parseEther(price),
        artType,
      );
      await tx.wait();
      console.log("Art uploaded successfully!");
      fetchArtPieces(); // Fetch updated art pieces after upload
    } catch (error) {
      console.error("Error uploading art:", error);
    }
  };

  const fetchArtPieces = async () => {
    if (state.contract) {
      try {
        const allArt = await state.contract.getAllPosts();
        setArtPieces(allArt);
      } catch (error) {
        console.error("Error fetching art pieces:", error);
      }
    }
  };

  const likeArt = async (id) => {
    if (state.contract) {
      try {
        const tx = await state.contract.likeArt(id);
        await tx.wait();
        console.log("Art liked successfully!");

        // Update the likes directly
        setArtPieces(prevArtPieces =>
          prevArtPieces.map(art =>
            art.id === id ? { ...art, likes: art.likes + 1 } : art
          )
        );
      } catch (error) {
        console.error("Error liking art:", error);
      }
    }
  };

  const toggleAuction = async (id) => {
    if (state.contract) {
      try {
        const tx = await state.contract.toggleAuction(id);
        await tx.wait();
        console.log("Auction toggled successfully!");
        fetchArtPieces(); // Fetch updated art pieces after toggling
      } catch (error) {
        console.error("Error toggling auction:", error);
      }
    }
  };

  const endAuction = async (id) => {
    if (state.contract) {
      try {
        const tx = await state.contract.endAuction(id);
        await tx.wait();
        console.log("Auction ended successfully!");
        fetchArtPieces(); // Fetch updated art pieces after ending
      } catch (error) {
        console.error("Error ending auction:", error);
      }
    }
  };

  const placeBid = async (id) => {
    if (state.contract) {
      try {
        const tx = await state.contract.placeBid(id, {
          value: ethers.parseEther(bidAmount) // Parse the bid amount to Ether
        });
        await tx.wait();
        console.log("Bid placed successfully!");
        fetchArtPieces(); // Fetch updated art pieces after placing a bid
      } catch (error) {
        console.error("Error placing bid:", error);
      }
    }
  };

  const fetchBidders = async (id) => {
    if (state.contract) {
      try {
        const biddersList = await state.contract.getBidders(id);
        setBidders(biddersList);
        setModalOpen(true);
      } catch (error) {
        console.error("Error fetching bidders:", error);
      }
    }
  };

  const buyArt = async (id, price) => {
    if (state.contract) {
      try {
        const tx = await state.contract.buyArt(id, {
          value: ethers.parseEther(price), // Convert price to Wei
        });
        await tx.wait();
        console.log("Art purchased successfully!");
        fetchArtPieces(); // Refresh the art pieces list after purchase
      } catch (error) {
        console.error("Error purchasing art:", error);
      }
    }
  };

  useEffect(() => {
    fetchArtPieces();
  }, [state.contract]);

  return (
    <div>
      <button onClick={connectWallet}>
        {account ? `Wallet Connected: ${account}` : "Create/Connect Wallet"}
      </button>
      <p>{account && `Connected to: ${account}`}</p>

      {account && (
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              Title:
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Creator:
              <input
                type="text"
                value={creator}
                onChange={(e) => setCreator(e.target.value)}
                required
              />
            </label>
          </div>
          <div>
            <label>
              URI:
              <input
                type="file"
                onChange={handleImageChange}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Price (in Ether):
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                min="0"
              />
            </label>
          </div>
          <div>
            <label>
              Art Type:
              <select value={artType} onChange={(e) => setArtType(e.target.value)}>
                <option value="0">Painting</option>
                <option value="1">3D Model</option>
              </select>
            </label>
          </div>
          <button type="submit">Upload Art</button>
        </form>
      )}

      <h2>Art Pieces</h2>
      <div className="art-container">
        {artPieces.map((art, index) => (
          <div className="art-card" key={index}>
            <img src={art.uri} alt={art.title} style={{ width: '200px', height: '200px' }} />
            <h3>{art.title}</h3>
            <p>Creator: {art.creator}</p>
            <p>Price: {ethers.formatEther(art.price)} ETH</p>
            <p>Art Type: {art.artType === '0' ? 'Painting' : '3D Model'}</p>
            <p>Likes: {art.likes}</p>
            <p>Max Bid: {ethers.formatEther(art.maxBid)} ETH</p>
            <p>{art.auctionActive ? "Auction Active" : "Not for Auction"}</p>
            
            {/* Auction buttons and bid input */}
            <button onClick={() => toggleAuction(art.id)}>
              {art.auctionActive ? "End Auction" : "Start Auction"}
            </button>

            {art.auctionActive && (
              <>
                <input
                  type="text"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder="Place Bid"
                  required
                />
                <button onClick={() => placeBid(art.id)}>Bid</button>
              </>
            )}

            <button onClick={() => likeArt(art.id)}>Like</button>
            <button onClick={() => fetchBidders(art.id)}>View Bidders</button> {/* Button to view bidders */}
        
              <button onClick={() => buyArt(art.id, ethers.formatEther(art.price))}>
                Buy
              </button>
            

          </div>
        ))}
              <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} bidders={bidders} />

      </div>

      <style jsx>{`
        .art-container {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
        }
        .art-card {
          border: 1px solid #ccc;
          border-radius: 8px;
          padding: 10px;
          width: 220px;
          text-align: center;
        }
        .art-card img {
          border-radius: 8px;
          margin-bottom: 10px;
        }
      `}</style>
    </div>
  );
}
