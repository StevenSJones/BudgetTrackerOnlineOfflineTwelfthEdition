//require our npm packages
const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");
//set our port to 3000
// const PORT = 3000;
//set the port of the server allowing heroku
const PORT = process.env.PORT || 8080;
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

// const uri = "mongodb://localhost/budget";

const uri = "mongodb+srv://Steven:Password1@cluster0.s4hbt.mongodb.net/budget?retryWrites=true&w=majority";
//connecting to mongoose
mongoose.connect(uri, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true 
}).then(() => {
  console.log("Connected!")
})
.catch(err => console.log(err))

// routes
app.use(require("./routes/api.js"));
//set our port to listen
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});