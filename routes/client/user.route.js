const express = require("express");
const route = express.Router();

const controller = require("../../controllers/client/user.controller");

route.get("/register", controller.register);

route.post("/register", controller.registerPost);

module.exports = route;