const md5 = require("md5");
const Account = require("../../models/account.model");

const systemConfig = require("../../config/system.js");
//[GET] /admin/auth/login
module.exports.login = (req,res) => {
    if(req.cookies.token){
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    }
    else{// nếu chưa có token trong cookies
        res.render("admin/pages/auth/login", {
            pageTitle: "Trang đăng nhập"
        });
    }
}

//[POST] /admin/auth/login
module.exports.loginPost = async (req,res) => {
    const email = req.body.email;
    const password = req.body.password;

    // const {email, password} = req.body;

    const user = await Account.findOne({
        email: email,
        deleted: false
    });

    if(!user){
        req.flash("error", "Email này không tồn tại!");
        res.redirect("back");
        return;
    }

    if(md5(password) != user.password){
        req.flash("error", "Sai mật khẩu!");
        res.redirect("back");
        return;
    }

    if(user.status != "active"){
        req.flash("error", "Tải khoản đã bị khóa!");
        res.redirect("back");
        return;
    }

    res.cookie("token", user.token);
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
}

//[GET] /admin/auth/logout
module.exports.logout = (req,res) => {
    res.clearCookie("token"); // xóa token khỏi cookie
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
}