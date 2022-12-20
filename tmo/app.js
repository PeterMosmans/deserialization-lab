// PGCM - (c)2022 - support@go-forward.net - GPLv3

// Vulnerable web application
const express = require("express");
const chalk = require("chalk");
const morgan = require("morgan");
const path = require("path");
const bodyparser = require("body-parser");
var serialize = require("node-serialize");

// If no environment variable is defined, use port 80 by defaut
const PORT = process.env.PORT || 80;
const app = express();

// Show nice HTTP logs
app.use(morgan("combined"));
// Enable serving static pages
app.use(express.static(path.join(__dirname, "/public/")));
// Parse post data
app.use(bodyparser.json());

app.get("/request", (req, res) => {
  res.send(
    "Add a take me out request using a JSON post to this endpoint. Don't forget to specify the id and description parameter."
  );
});

app.post("/request", (req, res, next) => {
  try {
    var item = serialize.unserialize(req.body);
    res.send(
      `Request ${chalk.red(item["id"])} received with description ${chalk.red(
        item["description"]
      )}`
    );
  } catch (err) {
    res.send("No valid request received");
    console.log(err);
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${chalk.green(PORT)}`);
});
