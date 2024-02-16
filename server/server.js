const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const authAdminRout = require("./auth/admin/adminAuthRouter/router.js");
const authuserRout = require("./auth/user/userAuthRouter/router.js");
const eventsRout = require("./router/eventsRouter.js");
const schedule = require('node-schedule');

const PORT = process.env.PORT || 3637;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "*",
  })
);


app.get("/halim" , (req , res)=>{
  const startTime = new Date(Date.now() + 5000);
  const endTime = new Date(startTime.getTime() + 5000);
  const job = schedule.scheduleJob({ start: startTime, end: endTime, rule: '*/1 * * * * *' }, function(){
    console.log('Time for tea!');
  });
res.send("hello")
})

app.use("/events", eventsRout);

app.use("/auth/admin", authAdminRout);
app.use("/auth/user", authuserRout);

app.use("/static", express.static("public"));
app.get("/", (req, res) => {
  res.send("auto deploy test");
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
