const RoomChat = require("../../models/room-chat.model");

module.exports.isAccess = async (req, res, next) => {
    const userId = res.locals.user.id;
    const roomChatId = req.params.roomChatId;
    
    try {
        const isAccessRoomChat = await RoomChat.findOne({
            _id: roomChatId,
            "users.user_id": userId, // kiểm tra id của các user có trong phòng chat(người khác ko có id phòng thì không thể truy cập mặc dù có link)
            deleted: false
        });
        if(isAccessRoomChat){
            next();
        }    
        else{
            res.redirect("/");
        }
    } catch (error) {
        res.redirect("/");
    }
}