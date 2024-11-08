const Product = require("../../models/product.model");
const productsHelper = require("../../helpers/products");

// [GET] /
module.exports.index = async (req,res) => {
    // featured product
    const productsFeatured = await Product.find({
        featured: "1",
        deleted: false,
        status: "active"
    }).limit(6);

    const newProducts = productsHelper.priceNewProducts(productsFeatured);
    // end featured product

    
    // new product
    const productsNew = await Product.find({
        deleted: false,
        status: "active",
    }).sort({position : "desc"}).limit(6);
    // end new product

    res.render("client/pages/home/index", {
        pageTitle: "Trang chủ",
        productsFeatured: newProducts,
        productsNew: productsNew
    });
} 