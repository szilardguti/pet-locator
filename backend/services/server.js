const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
var fs = require("fs");

const app = express();
const dogFilePath = "./resources/dogs.geojson";
const catFilePath = "./resources/cats.geojson";

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post("/api/dogs", (req, res) => {
  const jsonData = req.body;

  fs.writeFile(dogFilePath, JSON.stringify(jsonData), (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    } else {
      console.log("Data saved to dogs.geojson");
      res.status(200).send("OK");
    }
  });
});

app.get("/api/dogs", (req, res) => {
  fs.readFile(dogFilePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    } else {
      try {
        const jsonData = JSON.parse(data);
        console.log("Data returned from dogs.geojson");
        res.status(200).json(jsonData);
      } catch (jsonError) {
        console.error(jsonError);
        res.status(500).send("Error parsing GeoJSON file");
      }
    }
  });
});

app.post("/api/cats", (req, res) => {
  const jsonData = req.body;

  fs.writeFile(catFilePath, JSON.stringify(jsonData), (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    } else {
      console.log("Data saved to cats.geojson");
      res.status(200).send("OK");
    }
  });
});

app.get("/api/cats", (req, res) => {
  fs.readFile(catFilePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    } else {
      try {
        const jsonData = JSON.parse(data);
        console.log("Data returned from cats.geojson");
        res.status(200).json(jsonData);
      } catch (jsonError) {
        console.error(jsonError);
        res.status(500).send("Error parsing GeoJSON file");
      }
    }
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
