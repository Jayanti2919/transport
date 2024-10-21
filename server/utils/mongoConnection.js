const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const mongo_connection_uri = process.env.MONGO_URI;

const connect = async () => {
  mongoose.connect(mongo_connection_uri, {}).catch((err)=>{console.log(err)});
  console.log("Connected to MongoDB");
};

module.exports = connect;