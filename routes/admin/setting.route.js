const express = require("express");
const multer = require("multer");
const route = express.Router();

const upload = multer();

const controller = require("../../controllers/admin/setting.controller");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middlewares");

route.get("/general", controller.general);

route.patch(
    "/general",
    upload.single("logo"),
    uploadCloud.upload,    
    controller.generalPatch 
);


module.exports = route;