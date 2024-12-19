const { Server } = require("socket.io");

const io = new Server(5000, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
  },
});
let activeItems = [];
let orderHistory = [];
let accountManagerActiveItems = [];
let accountManagerOrderHistory = [];

io.on("connection", (socket) => {
  console.log("connected");

  socket.on("activeItems", (data) => {
    const status = activeItems.find((item) => item?.id === data?.id);
    if (status) {
      activeItems = activeItems.map((item) => {
        if (item?.id === data?.id) return data;
        else return item;
      });

      return;
    } else {
      activeItems.unshift(data);
    }
  });

  io.emit("activedItems", activeItems);

  socket.on("orderHistory", (data) => {
    orderHistory.push(data);
    activeItems = activeItems.filter((item) => item?.id !== data?.id);
  });

  io.emit("orderHistory", orderHistory);

  socket.on("disconnect", () => {
    console.log("left");
  });
});
