const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");

const chatSocket = require("../../socket/client/chat.socket");

// [GET] /chat/:roomChatId 
module.exports.index = async (req, res) => {
    const roomChatId = req.params.roomChatId;

    // SocketIO
    chatSocket(req, res);
    // End SockIO


    // Lấy ra data
    const chats = await Chat.find({
        room_chat_id: roomChatId,
        deleted: false
    });

    for(const chat of chats){
        const infoUser = await User.findOne({
            _id: chat.user_id,
        }).select("fullName");

        chat.infoUser = infoUser;
    }
    
    res.render("client/pages/chat/index", {
        pageTile: "Chat",
        chats: chats
    });
}