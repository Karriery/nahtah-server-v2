const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const authAdminRout = require("./auth/admin/adminAuthRouter/router.js");
const eventsRout = require("./router/eventsRouter.js");

const PORT = process.env.PORT || 3636;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
  })
);

app.use("/events", eventsRout);

app.use("/auth/admin", authAdminRout);
app.use("/static", express.static("public"));

app.get("/", (req, res) => {
  res.send("auto deploy test");
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
