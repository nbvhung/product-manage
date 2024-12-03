const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");

module.exports = async (res) => {
    const userId = res.locals.user.id;
    const fullName = res.locals.user.fullName;

    _io.once('connection', (socket) => { //once: chỉ lưu 1 lần khi ko viết nội dung mới và load lại trang
        socket.on("CLIENT_SEND_MESSAGE", async (content) => {
            const chat = new Chat({
                user_id: userId,
                content: content
            });

            await chat.save();

            // trả data về client
            _io.emit("SERVER_RETURN_MESSAGE", {
                userId: userId,
                fullName: fullName,
                content: content
            });
        })

        socket.on("CLIENT_SEND_TYPING", (type) => {
            socket.broadcast.emit("SERVER_RETURN_TYPING", { // broadcast: chi nguoi nhan moi thay
                userId: userId,
                fullName: fullName,
                type: type
            });
        })
    });
}