const express = require("express");
const app = express();
const fs = require("fs");
const connectToDatabase = require("./db/index.js");
const Book = require("./model/bookModel.js");
//multerconfig imports
const { multer, storage } = require("./middleware/multerConfig.js");
const upload = multer({
  storage: storage,
  // limits: {
  // fileSize: 5 * 1024 * 1024, // Set file size limit to 5mb
  // },
});
// cors package
const cors = require("cors");

app.use(
  cors({
    origin: "*",
  })
);
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
app.post("/book", upload.single("image"), async (req, res) => {
  let fileName;
  if (!req.file) {
    fileName =
      "https://images.unsplash.com/photo-1731332066050-47efac6e884f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw4fHx8ZW58MHx8fHx8";
  } else {
    fileName = "https://mern-with-dp.onrender.com/" + req.file.filename;
  }

  const {
    bookName,
    bookPrice,
    isbnNumber,
    authorName,
    publishedAt,
    publication,
    description,
  } = req.body;
  await Book.create({
    bookName,
    bookPrice,
    isbnNumber,
    authorName,
    publishedAt,
    publication,
    description,
    imageUrl: fileName,
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
//delete operation
app.delete("/book/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const book = await Book.findByIdAndDelete(id);

  res.status(200).json({
    message: "Book deleted successfully!!",
  });
});
//update
app.patch("/book/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const oldData = await Book.findById(id);
  let fileName;
  if (req.file) {
    const oldImagePath = oldData.imageUrl;
    const localHostUrlLength = "https://mern-with-dp.onrender.com/".length;
    const newOldImagePath = oldImagePath.slice(localHostUrlLength);
    fs.unlink(`./storage/${newOldImagePath}`, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("file deleted successfully");
      }
    });
    fileName = "https://mern-with-dp.onrender.com/"+ req.file.filename;
  }
  const {
    bookName,
    bookPrice,
    isbnNumber,
    authorName,
    publishedAt,
    description,
    publication,
  } = req.body;
  const book = await Book.findByIdAndUpdate(id, {
    bookName,
    bookPrice,
    isbnNumber,
    authorName,
    publishedAt,
    publication,
    description,
    imageUrl: fileName,
  });
  res.status(200).json({
    message: "Book updated successfully!!",
  });
});
app.use(express.static("./storage"));
app.listen(3000, () => {
  console.log("Nodejs server has started at port 3000");
});
