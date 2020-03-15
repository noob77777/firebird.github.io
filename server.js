var http = require("http");
var fs = require("fs");

var server = http.createServer(function(req, res) {
  console.log("Request for " + req.url);
  if (req.url === "/" || req.url === "/index.html") {
    res.writeHead(200, { "Content-Type": "text/html" });
    var read = fs.createReadStream("./index.html", "utf8");
    read.pipe(res);
  } else if (req.url === "/signup.html") {
    res.writeHead(200, { "Content-Type": "text/html" });
    var read = fs.createReadStream("./signup.html", "utf8");
    read.pipe(res);
  } else if (req.url === "/styles.css") {
    var read = fs.createReadStream("./styles.css", "utf8");
    read.pipe(res);
  } else if (req.url === "/signup.html") {
    res.writeHead(200, { "Content-Type": "text/html" });
    var read = fs.createReadStream("./signup.html", "utf8");
    read.pipe(res);
  } else if (req.url === "/database.js") {
    var read = fs.createReadStream("./database.js", "utf8");
    read.pipe(res);
  } else if (req.url === "/script.js") {
    var read = fs.createReadStream("./script.js", "utf8");
    read.pipe(res);
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(5500);
