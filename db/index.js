const mongoose = require("mongoose");
const conn =
  "mongodb+srv://Rajesh:rajesh@cluster0.i7zs5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
async function connectToDatabase() {
  await mongoose.connect(conn);
  console.log("connected to db successfully");
}
module.exports =connectToDatabase