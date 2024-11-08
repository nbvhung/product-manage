const homeRoutes = require("./home.route");
const productRoutes = require("./product.route");

const categoryMiddleware = require("../../middlewares/client/category.middleware")

module.exports = (app) => {
    app.use(categoryMiddleware.category); // dùng middleware cho nhanh dùng được cho mọi trang

    app.use("/",homeRoutes);
    
    app.use("/products", productRoutes); 
} 