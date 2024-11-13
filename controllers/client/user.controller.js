// [GET] /user/register
module.exports.register = (req, res) => {
    res.render("client/pages/user/register",{
        pageTitle: "Đăng ký tài khoản",
    });
};


// [POST] /user/this.register
module.exports.registerPost = (req, res) => {
    console.log(req.body);
    res.send("OK");
}