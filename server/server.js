const express = require("express");
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

const cors = require("cors");
const bodyParser = require("body-parser");
const authAdminRout = require("./auth/admin/adminAuthRouter/router.js");
const authuserRout = require("./auth/user/userAuthRouter/router.js");
const eventsRout = require("./router/eventsRouter.js");
const notificationRouter = require("./router/notificationsRouter.js");
const newsletterRouter = require("./router/newsletterRouter.js");
const storeRouter = require("./router/StoreRouter.js");
const offDaysRouter = require("./router/offDaysRouter.js");
const schedule = require("node-schedule");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    console.log(req.params.id, "req.params.id");
    cb(null, req.params.id + "." + file.originalname.split(".").pop());
  },
});
const jsonParser = bodyParser.json();
const firebaseConfig = require("./service/FirBaseService.js");
const { Expo } = require("expo-server-sdk");
const expo = new Expo();

const upload = multer({ storage });

const PORT = process.env.PORT || 3637;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/img", express.static(path.join(__dirname, "..", "uploads")));

app.use(
  cors({
    origin: "*",
  })
);
app.use((req, res, next) => {
  req.io = io;
  next();
});
app.get("/halim", (req, res) => {
  const startTime = new Date(Date.now() + 5000);
  const endTime = new Date(startTime.getTime() + 5000);
  const job = schedule.scheduleJob(
    { start: startTime, end: endTime, rule: "*/1 * * * * *" },
    function () {
      console.log("Time for tea!");
    }
  );
  res.send("hello");
});
app.use("/notifications", notificationRouter);
app.use("/newsletter", newsletterRouter);
app.use("/events", eventsRout);
app.use("/events/upload/:id", upload.single("img"), (req, res) => {
  res.send({ message: "image uploaded successfully" });
});
app.use("/store", storeRouter);
app.use("/offdays", offDaysRouter);

app.use("/auth/admin", authAdminRout);
app.use("/auth/user", authuserRout);

app.use("/static", express.static("public"));
app.get("/", (req, res) => {
  res.send("auto deploy test");
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

app.post("/registerPushToken", jsonParser, async (req, res) => {
  const { token, userId } = req.body;
  await firebaseConfig.saveToken(userId, token);
  res.status(200).send("Token saved");
});

app.post("/send", async (req, res) => {
  const { userId, data } = req.body;
  const token = await firebaseConfig.getToken(userId);
  // Check if token is valid
  if (!Expo.isExpoPushToken(token)) {
    console.log("Invalid token", token);
    return res.status(400).send("Invalid token");
  }
  const messages = [
    {
      to: token,
      sound: "default",
      title: "New Notification",
      body: "The event has been accepted",
      data: data || {},
    },
  ];

  try {
    const chunks = expo.chunkPushNotifications(messages);

    for (let chunk of chunks) {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      console.log(ticketChunk);
    }

    res.status(200).send("Notification sent");
  } catch (error) {
    console.error("Error sending push notification:", error);
    res.status(500).send("Error sending push notification");
  }
});

app.post("/deleteToken", jsonParser, async (req, res) => {
  const { userId } = req.body;
  await firebaseConfig.deleteToken(userId);
  res.status(200).send("Token deleted");
});

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
