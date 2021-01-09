var express = require("express");
var server = express();
var bodyParser = require("body-parser");

var model = {};

server.use(bodyParser.json());

server.listen(3000);
module.exports = { model, server };
