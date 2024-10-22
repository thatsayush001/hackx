import pathfinding from "pathfinding";
import { Server } from "socket.io";
import { ethers } from "ethers";
import { JsonRpcProvider } from "ethers";
import abi from "../client/src/abi/NFTGallery.json" assert { type: "json" }; // Ensure this path is correct

const io = new Server({
  cors: {
    origin: "http://localhost:5173",
  },
});

const privateKey =
  "529038177e54eb14bb591eaf0e7517112d7f4189f372f4a15a7d0229236adf7f";
const alchemyProvider = new JsonRpcProvider(
  "https://polygon-amoy.g.alchemy.com/v2/OlHr_15i85AUNY6JNMQ2isTduKxgWGFy"
);
const contractAddress = "0x49397BF80Eebf92fa0c1C8DeE417cDDBB1d006c7";

const signer = new ethers.Wallet(privateKey, alchemyProvider);
// console.log(abi.abi)
const contract = new ethers.Contract(contractAddress, abi.abi, signer);

// Check if the contract instance is created successfully
// if (contract) {
//   console.log("Contract instance:", contract);
// } else {
//   console.error("Failed to create contract instance");
// }
const fetchAllPosts = async () => {
  const posts = await contract.getAllPosts();
  posts.map(async (post, i) => {
    const imgResponse = await fetch(post[1]);
    const imgData = await imgResponse.json();
    const obj = {
      ...items.frame,
      gridPosition: [Number(post[8]), Number(post[9])],
      by : post[2],
      likes : Number(post[7]),
      rotation : Number(post[10]),
      link: imgData.img,
      title : imgData.title,
      price : imgData.price,
      auctionActive : post[5],
      sold : post[6],
      maxBidder : post[4],
      currentBid : Number(post[3]),
      id: Number(post[0])
    };
    console.log(obj);
    map.items.push(obj);
  });
};
// fetchAllPosts()

io.listen(8080);

const characters = [];

const items = {
  portraitWall: {
    name: "portraitWall",
    size: [1, 14],
  },
  portraitWall2: {
    name: "portraitWall",
    size: [1, 14],
  },
  frame: {
    name: "frame",
    size: [1, 4],
  },
  washer: {
    name: "washer",
    size: [2, 2],
    drag: false,
  },
  toiletSquare: {
    name: "toiletSquare",
    size: [2, 2],
  },
  trashcan: {
    name: "trashcan",
    size: [1, 1],
  },
  bathroomCabinetDrawer: {
    name: "bathroomCabinetDrawer",
    size: [2, 2],
  },
  bathtub: {
    name: "bathtub",
    size: [4, 2],
  },
  bathroomMirror: {
    name: "bathroomMirror",
    size: [2, 1],
    wall: true,
  },
  bathroomCabinet: {
    name: "bathroomCabinet",
    size: [2, 1],
    wall: true,
  },
  bathroomSink: {
    name: "bathroomSink",
    size: [2, 2],
  },
  showerRound: {
    name: "showerRound",
    size: [2, 2],
  },
  tableCoffee: {
    name: "tableCoffee",
    size: [4, 2],
  },
  loungeSofaCorner: {
    name: "loungeSofaCorner",
    size: [5, 5],
  },
  bear: {
    name: "bear",
    size: [2, 1],
    wall: true,
  },
  loungeSofaOttoman: {
    name: "loungeSofaOttoman",
    size: [2, 2],
  },
  tableCoffeeGlassSquare: {
    name: "tableCoffeeGlassSquare",
    size: [2, 2],
  },
  loungeDesignSofaCorner: {
    name: "loungeDesignSofaCorner",
    size: [5, 5],
  },
  loungeDesignSofa: {
    name: "loungeDesignSofa",
    size: [5, 2],
  },
  loungeSofa: {
    name: "loungeSofa",
    size: [5, 2],
  },
  bookcaseOpenLow: {
    name: "bookcaseOpenLow",
    size: [2, 1],
  },
  kitchenBar: {
    name: "kitchenBar",
    size: [2, 1],
  },
  bookcaseClosedWide: {
    name: "bookcaseClosedWide",
    size: [3, 1],
  },
  bedSingle: {
    name: "bedSingle",
    size: [3, 5],
  },
  bench: {
    name: "bench",
    size: [2, 1],
  },
  bedDouble: {
    name: "bedDouble",
    size: [5, 5],
  },
  benchCushionLow: {
    name: "benchCushionLow",
    size: [2, 1],
  },
  loungeChair: {
    name: "loungeChair",
    size: [2, 2],
  },
  cabinetBedDrawer: {
    name: "cabinetBedDrawer",
    size: [1, 1],
  },
  cabinetBedDrawerTable: {
    name: "cabinetBedDrawerTable",
    size: [1, 1],
  },
  table: {
    name: "table",
    size: [4, 2],
  },
  tableCrossCloth: {
    name: "tableCrossCloth",
    size: [4, 2],
  },
  plant: {
    name: "plant",
    size: [1, 1],
  },
  plantSmall: {
    name: "plantSmall",
    size: [1, 1],
  },
  rugRounded: {
    name: "rugRounded",
    size: [6, 4],
    walkable: true,
  },
  rugRound: {
    name: "rugRound",
    size: [4, 4],
    walkable: true,
  },
  rugSquare: {
    name: "rugSquare",
    size: [4, 4],
    walkable: true,
  },
  rugRectangle: {
    name: "rugRectangle",
    size: [8, 4],
    walkable: true,
  },
  televisionVintage: {
    name: "televisionVintage",
    size: [4, 2],
  },
  televisionModern: {
    name: "televisionModern",
    size: [4, 2],
  },
  kitchenCabinetCornerRound: {
    name: "kitchenCabinetCornerRound",
    size: [2, 2],
  },
  kitchenCabinetCornerInner: {
    name: "kitchenCabinetCornerInner",
    size: [2, 2],
  },
  kitchenCabinet: {
    name: "kitchenCabinet",
    size: [2, 2],
  },
  kitchenBlender: {
    name: "kitchenBlender",
    size: [1, 1],
  },
  dryer: {
    name: "dryer",
    size: [2, 2],
  },
  chairCushion: {
    name: "chairCushion",
    size: [1, 1],
  },
  chair: {
    name: "chair",
    size: [1, 1],
  },
  deskComputer: {
    name: "deskComputer",
    size: [3, 2],
  },
  desk: {
    name: "desk",
    size: [3, 2],
  },
  chairModernCushion: {
    name: "chairModernCushion",
    size: [1, 1],
  },
  chairModernFrameCushion: {
    name: "chairModernFrameCushion",
    size: [1, 1],
  },
  kitchenMicrowave: {
    name: "kitchenMicrowave",
    size: [1, 1],
  },
  coatRackStanding: {
    name: "coatRackStanding",
    size: [1, 1],
  },
  kitchenSink: {
    name: "kitchenSink",
    size: [2, 2],
  },
  lampRoundFloor: {
    name: "lampRoundFloor",
    size: [1, 1],
  },
  lampRoundTable: {
    name: "lampRoundTable",
    size: [1, 1],
  },
  lampSquareFloor: {
    name: "lampSquareFloor",
    size: [1, 1],
  },
  lampSquareTable: {
    name: "lampSquareTable",
    size: [1, 1],
  },
  toaster: {
    name: "toaster",
    size: [1, 1],
  },
  kitchenStove: {
    name: "kitchenStove",
    size: [2, 2],
  },
  laptop: {
    name: "laptop",
    size: [1, 1],
  },
  radio: {
    name: "radio",
    size: [1, 1],
  },
  speaker: {
    name: "speaker",
    size: [1, 1],
  },
  speakerSmall: {
    name: "speakerSmall",
    size: [1, 1],
  },
  stoolBar: {
    name: "stoolBar",
    size: [1, 1],
  },
  stoolBarSquare: {
    name: "stoolBarSquare",
    size: [1, 1],
  },
};

const map = {
  size: [15, 15],
  gridDivision: 2,
  items: [
    {
      ...items.portraitWall,
      gridPosition: [10, 8],
    },
    {
      ...items.portraitWall2,
      gridPosition: [20, 8],
    },
    // {
    //   ...items.showerRound,
    //   gridPosition: [0, 0],
    // },
    // {
    //   ...items.toiletSquare,
    //   gridPosition: [0, 3],
    //   rotation: 1,
    // },
    // {
    //   ...items.washer,
    //   gridPosition: [5, 0],
    // },
    // {
    //   ...items.bathroomSink,
    //   gridPosition: [7, 0],
    // },
    // {
    //   ...items.trashcan,
    //   gridPosition: [0, 5],
    //   rotation: 1,
    // },
    // {
    //   ...items.bathroomCabinetDrawer,
    //   gridPosition: [3, 0],
    // },
    // {
    //   ...items.bathtub,
    //   gridPosition: [4, 4],
    // },
    // {
    //   ...items.bathtub,
    //   gridPosition: [0, 8],
    //   rotation: 3,
    // },
    // {
    //   ...items.bathroomCabinet,
    //   gridPosition: [3, 0],
    // },
    // {
    //   ...items.bathroomMirror,
    //   gridPosition: [0, 8],
    //   rotation: 1,
    // },
    // {
    //   ...items.bathroomMirror,
    //   gridPosition: [, 10],
    //   rotation: 1,
    // },
    // {
    //   ...items.tableCoffee,
    //   gridPosition: [10, 8],
    // },
    // {
    //   ...items.rugRectangle,
    //   gridPosition: [8, 7],
    // },
    // {
    //   ...items.loungeSofaCorner,
    //   gridPosition: [6, 10],
    // },
    // {
    //   ...items.bear,
    //   gridPosition: [0, 3],
    //   rotation: 1,
    // },
    // {
    //   ...items.plant,
    //   gridPosition: [11, 13],
    // },
    // {
    //   ...items.cabinetBedDrawerTable,
    //   gridPosition: [13, 19],
    // },
    // {
    //   ...items.cabinetBedDrawer,
    //   gridPosition: [19, 19],
    // },
    // {
    //   ...items.bedDouble,
    //   gridPosition: [14, 15],
    // },
    // {
    //   ...items.bookcaseClosedWide,
    //   gridPosition: [12, 0],
    //   rotation: 2,
    // },
    // {
    //   ...items.speaker,
    //   gridPosition: [11, 0],
    // },
    // {
    //   ...items.speakerSmall,
    //   gridPosition: [15, 0],
    // },
    // {
    //   ...items.loungeChair,
    //   gridPosition: [10, 4],
    // },
    // {
    //   ...items.loungeSofaOttoman,
    //   gridPosition: [14, 4],
    // },
    // {
    //   ...items.loungeDesignSofa,
    //   gridPosition: [18, 0],
    //   rotation: 1,
    // },
    // {
    //   ...items.kitchenCabinetCornerRound,
    //   gridPosition: [2, 18],
    //   rotation: 2,
    // },
    // {
    //   ...items.kitchenCabinetCornerInner,
    //   gridPosition: [0, 18],
    //   rotation: 2,
    // },
    // {
    //   ...items.kitchenStove,
    //   gridPosition: [0, 16],
    //   rotation: 1,
    // },
    // {
    //   ...items.dryer,
    //   gridPosition: [0, 14],
    //   rotation: 1,
    // },
    // {
    //   ...items.lampRoundFloor,
    //   gridPosition: [0, 12],
    // },
  ],
};

const grid = new pathfinding.Grid(
  map.size[0] * map.gridDivision,
  map.size[1] * map.gridDivision
);

const finder = new pathfinding.AStarFinder({
  allowDiagonal: true,
  dontCrossCorners: true,
});

const findPath = (start, end) => {
  const gridClone = grid.clone();
  const path = finder.findPath(start[0], start[1], end[0], end[1], gridClone);
  return path;
};

const updateGrid = () => {
  // RESET
  for (let x = 0; x < map.size[0] * map.gridDivision; x++) {
    for (let y = 0; y < map.size[1] * map.gridDivision; y++) {
      grid.setWalkableAt(x, y, true);
    }
  }

  map.items.forEach((item) => {
    if (item.walkable || item.wall) {
      return;
    }
    const width =
      item.rotation === 1 || item.rotation === 3 ? item.size[1] : item.size[0];
    const height =
      item.rotation === 1 || item.rotation === 3 ? item.size[0] : item.size[1];
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        grid.setWalkableAt(
          item.gridPosition[0] + x,
          item.gridPosition[1] + y,
          false
        );
      }
    }
  });
};

updateGrid();

const generateRandomPosition = () => {
  for (let i = 0; i < 100; i++) {
    const x = Math.floor(Math.random() * map.size[0] * map.gridDivision);
    const y = Math.floor(Math.random() * map.size[1] * map.gridDivision);
    if (grid.isWalkableAt(x, y)) {
      return [x, y];
    }
  }
};

const generateRandomHexColor = () => {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
};

io.on("connection", (socket) => {
  console.log("user connected");
  fetchAllPosts();

  characters.push({
    id: socket.id,
    position: generateRandomPosition(),
    hairColor: generateRandomHexColor(),
    topColor: generateRandomHexColor(),
    bottomColor: generateRandomHexColor(),
    avatarUrl: "https://models.readyplayer.me/64f0265b1db75f90dcfd9e2c.glb",
    address: "",
  });

  socket.emit("hello", {
    map,
    characters,
    id: socket.id,
    items,
  });

  io.emit("characters", characters);

  socket.on("characterAvatarUpdate", (avatarUrl, address) => {
    const character = characters.find(
      (character) => character.id === socket.id
    );
    if (address != null) {
      character.address = address;
    }
    if (avatarUrl != null) {
      character.avatarUrl =
        avatarUrl.split("?")[0] + "?" + new Date().getTime();
    }
    io.emit("characters", characters);
  });

  socket.on("move", (from, to) => {
    const character = characters.find(
      (character) => character.id === socket.id
    );
    const path = findPath(from, to);
    if (!path) {
      return;
    }
    character.position = from;
    character.path = path;
    io.emit("playerMove", character);
  });

  socket.on("dance", () => {
    io.emit("playerDance", {
      id: socket.id,
    });
  });

  socket.on("itemsUpdate", (items) => {
    map.items = items;
    characters.forEach((character) => {
      character.path = [];
      character.position = generateRandomPosition();
    });
    updateGrid();
    io.emit("mapUpdate", {
      map,
      characters,
    });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");

    characters.splice(
      characters.findIndex((character) => character.id === socket.id),
      1
    );
    io.emit("characters", characters);
  });
});
