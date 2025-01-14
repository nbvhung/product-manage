const express = require("express");
const multer = require("multer");
const route = express.Router();

const upload = multer();

const controller = require("../../controllers/admin/product-category.controller");
const validate = require("../../validates/admin/product-category.validate");

const uploadCloud = require("../../middlewares/admin/uploadCloud.middlewares");

route.get("/", controller.index);

route.get("/create", controller.create);

route.post(
    "/create",
    upload.single("thumbnail"),
    uploadCloud.upload,
    validate.createPost,// nhúng validate 
    controller.createPost
);

route.get("/edit/:id",controller.edit);

route.patch(
    "/edit/:id",
    upload.single("thumbnail"),
    uploadCloud.upload,
    //validate.createPost,
    controller.editPatch
)

module.exports = route;