const express = require("express");
const app = express();
const connectToDatabase = require("./db/index.js");
const Book = require("./model/bookModel.js");

//Alternative
//const app = require('express')();
app.use(express.json());
connectToDatabase();
app.get("/", (req, res) => {
  res.status(200).json({
    messege: "success",
  });
});
//C api among CURD
app.post("/book", async (req, res) => {
  const {
    bookName,
    bookPrice,
    isbnNumber,
    authorName,
    publishedAt,
    publication,
  } = req.body;
  await Book.create({
    bookName,
    bookPrice,
    isbnNumber,
    authorName,
    publishedAt,
    publication,
  });
  res.status(201).json({
    message: "Book created successfully",
  });
});
//R among CURD
app.get("/book", async (req, res) => {
  const books = await Book.find(); //retun array garxa ;- array ma length check garinxa
  console.log(books);
  res.status(200).json({
    message: "Books fetched successfully",
    data: books,
  });
});
//single read
app.get("/book/:id", async (req, res) => {
  const { id } = req.params;
  const book = await Book.findById(id); // return obect garxa:- obejct ko lenth hunna
  console.log(book);
  res.status(200).json({
    message: "single book fetched successfully",
    data: book,
  });
});
app.listen(3000, () => {
  console.log("Nodejs server has started at port 3000");
});
