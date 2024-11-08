const Account = require("../../models/account.model");
const Role = require("../../models/role.model");

const systemConfig = require("../../config/system");

module.exports.requireAuth = async (req, res, next) => {
    
    if(!req.cookies.token){ // ko có token phải vào login
        res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    }
    else{
        const user = await Account.findOne({token: req.cookies.token}).select("-password");
        if(!user){ //token ko hợp lệ
            res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
        }
        else{
            const role = await Role.findOne({
                _id: user.role_id
            }).select("title permissions")

            res.locals.user = user; // render ra gd
            res.locals.role = role;
            next();
        }
    }
}