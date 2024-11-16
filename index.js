const express = require("express");
const path = require("path");
const methodOverride = require('method-override');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("express-flash");
const multer = require("multer");
const moment = require("moment");
require("dotenv").config();

const database = require("./config/database.js");

const systemConfig = require("./config/system.js");

const route = require("./routes/client/index.route.js");
const routeAdmin = require("./routes/admin/index.route.js");

database.connect();

const app = express();
const port = process.env.PORT; 

app.use(methodOverride('_method'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

// flash
app.use(cookieParser("ILFHIALFHIAEU"));// cài thêm thư viện cookie-parser và express-session
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
// end flash

// TinyMCE
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

// End tinytmce

// App local variable
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;

app.use(express.static(`${__dirname}/public`));

//routes
route(app);
routeAdmin(app);

// 404
app.get("*", (req, res) => { // *: các trường hợp còn lại
    res.render("client/pages/errors/404", {
        pageTitle: "404 Not Found",
    })
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
}); 