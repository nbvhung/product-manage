const Cart = require("../../models/cart.model");

module.exports.cardId = async (req, res, next) => {
    if(!req.cookies.cartId){ // lần đầu vào, giỏ hàng chưa có gì
        const cart = new Cart();
        await cart.save();

        const expiresTime = 1000 * 60 * 60 * 24 * 365;

        res.cookie("cartId", cart.id, {
            expires: new Date(Date.now() + expiresTime)
        });// key, val, th gian het han
    }
    else{ // khi co gio hang
        const cart = await Cart.findOne({
            _id: req. cookies.cartId
        })

        cart.totalQuantity = cart.products.reduce((sum, item) => sum + item.quantity, 0);// tong tat ca cac san pham trong gio hang, them thuoc tinh

        res.locals.miniCart = cart;
    }

    next();
}