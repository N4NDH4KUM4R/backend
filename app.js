const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const multer = require("multer");
const mongoose = require("mongoose");

// model file import
const imageModel = require("./imageModel");
// end
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose
  .connect("mongodb://127.0.0.1:27017/image", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("mongodb is connected");
  })
  .catch((err) => {
    console.log("Error connecting", err);
  });

//storage
const storageOur = multer.diskStorage({
  destination: "upload",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storageOur,
}).single("testImageUpload");
// end
app.get("/", (req, res) => {
  res.send("upload file");
});

app.post("/upload", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.log(err);
    } else {
      const newImage = new imageModel({
        name: req.body.name,
        image: {
          data: req.file.filename,
          contentType: "image/jpeg/png/jpg",
        },
      });
      newImage
        .save()
        .then(() => res.send("image uploaded successfully"))
        .catch((err) => console.log("image uploaded failed", err));
    }
  });
});
app.listen(7000, () => {
  console.log("server listening on http://localhost:7000");
});
