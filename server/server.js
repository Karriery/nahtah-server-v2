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
const notificationRouter = require("./router/notificationsRouter");
const newsletterRouter = require("./router/newsletterRouter");
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

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
