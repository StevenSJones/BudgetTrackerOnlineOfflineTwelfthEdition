//require our npm packages
const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");
//set our port to 3000
const PORT = 3000;
//creating the express app
const app = express();
//using the morgan logger middleware
app.use(logger("dev"));
//using compression middleware
app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//middlware serving up our static files
app.use(express.static("public"));
//connecting to mongoose
mongoose.connect("mongodb://localhost/budget", {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true 
});

// routes
app.use(require("./routes/api.js"));
//set our port to listen
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});