const express = require("express");

const router = require("express").Router();





router.get("/", (req, res) => {
  res.send("<h2> hey user</h2>");
});

module.exports = router;
