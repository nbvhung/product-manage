const systemConfig = require("../../config/system");

const dashboardRoutes = require("./dashboard.route");
const productRoutes = require("./product.route");
const productCategoryRoutes = require("./product-category.route");
const roleRoutes = require("./role.route");
const accountRoutes = require("./account.route");
const authRoutes = require("./auth.route");
const myAccountRoutes = require("./my-account.route");
const settingRoutes = require("./setting.route");

const authMiddlewares = require("../../middlewares/admin/auth.middlewares");

module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin;

    app.use(PATH_ADMIN + "/dashboard", authMiddlewares.requireAuth, dashboardRoutes);

    app.use(PATH_ADMIN + "/products", authMiddlewares.requireAuth, productRoutes);

    app.use(PATH_ADMIN + "/products-category", authMiddlewares.requireAuth, productCategoryRoutes);

    app.use(PATH_ADMIN + "/roles", authMiddlewares.requireAuth, roleRoutes);

    app.use(PATH_ADMIN + "/accounts", authMiddlewares.requireAuth, accountRoutes);

    app.use(PATH_ADMIN + "/auth", authRoutes);

    app.use(PATH_ADMIN + "/my-account", authMiddlewares.requireAuth,  myAccountRoutes);

    app.use(PATH_ADMIN + "/settings", authMiddlewares.requireAuth, settingRoutes);
} 
