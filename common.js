var req = require("request");
var async = require("async");
var fs = require("fs");
var _ = require("lodash");

var common = {
  req,
  async,
  fs,
  _
};

module.exports = common;
