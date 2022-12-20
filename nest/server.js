// PGCM - (c)2022 - support@go-forward.net - GPLv3

// Simple web server, which displays headers, GET and POST data on the console
const http = require("http");
const url = require("url");

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  const now = new Date();
  console.log(
    `Request received at ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`
  );
  const query = url.parse(req.url, true).search;
  if (query) {
    console.log(`  GET query parameters: ${query}`);
  }
  for (let k in req.headers) {
    console.log(`  ${k}: ${req.headers[k]}`);
  }
  res.write("OK");
  req.on("data", (chunk) => {
    console.log(`  ${chunk.toString()}`);
  });
  res.end();
});

server.listen(PORT, () => {
  console.log(`Nest server is running on port ${PORT}`);
});
