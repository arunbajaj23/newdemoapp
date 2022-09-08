var express = require("express");
var path = require("path");

var usersRouter = require("./routes/users.controller");
var eventRouter = require("./routes/event.controller");

const middleware = require("./joiModelValidation/middleware");

var app = express();

var cors = require("cors");
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public/DemoApp")));
app.use("/event", middleware.requireVerifiedUserAuthentication, eventRouter);
app.use("/users", usersRouter);

app.get("/*",(req,res)=>{
    res.sendFile(path.join(__dirname + "/public/DemoApp/index.html"));
})
const db = require("./models");


db.sequelize.sync().then(()=>{
  var port = process.env.PORT || 3000;

  var server = app.listen(port, function () {
    console.log("Server running at port" + port + "/");
  });
});


