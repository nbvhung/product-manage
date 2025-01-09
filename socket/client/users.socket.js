const User = require("../../models/user.model");

module.exports = async (res) => {
    _io.once('connection', (socket) => {

        // Người dùng gửi yêu cầu kết bạn
        socket.on("CLIENT_ADD_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id; // Id cua nguoi gui loi moi (A)

            // Thêm id của A vào acceptFriend của B
            const existUserAinB = await User.findOne({
                _id: userId, // tìm id của B
                acceptFriends: myUserId // ktra xem id của A đã có trong danh sách đợi chấp nhận chưa
            });

            if(!existUserAinB){
                // nếu chưa có thì đẩy vào acceptFriends của B
                await User.updateOne({
                    _id: userId // điều kiện: id của B
                }, {
                    $push: {acceptFriends: myUserId} // đẩy id của A vào acceptFriends của B
                });
            }

            // Thêm id của B vào requestFriend của A
            const existUserBinA = await User.findOne({
                _id: myUserId,
                requestFriends: userId
            })

            if(!existUserBinA){
                await User.updateOne({
                    _id: myUserId
                }, {
                    $push: {requestFriends: userId}
                });
            }

            // Lấy độ dài acceptFriends của B trả về cho B
            const infoUserB = await User.findOne({
                _id: userId
            });

            const lengthAcceptFriends = infoUserB.acceptFriends.length;

            socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", { // broadcast: trả về cho mọi người khác trừ A
                userId: userId,
                lengthAcceptFriends: lengthAcceptFriends
            });


            // Lấy thông tin của A trả về cho B
            const infoUserA = await User.findOne({
                _id: myUserId
            }).select("id avatar fullName");

            socket.broadcast.emit("SERVER_RETURN_INFO_ACCEPT_FRIEND", {
                userId: userId,
                infoUserA: infoUserA
            });
        });



        // Người dùng hủy yêu cầu kết bạn
        socket.on("CLIENT_CANCEL_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id;

            // Xóa id của A trong acceptFriends của B
            const existUserAinB = await User.findOne({
                _id: userId,
                acceptFriends: myUserId
            });

            if(existUserAinB){
                await User.updateOne({
                    _id: userId
                }, {
                    $pull: { acceptFriends: myUserId } // Xóa A ra khỏi acceptFriends của B
                });
            }

            // Xóa id của B trong requestFriends của A
            const existUserBinA = await User.findOne({
                _id: myUserId,
                requestFriends: userId
            });

            if(existUserBinA){
                await User.updateOne({
                    _id: myUserId
                }, {
                    $pull: { requestFriends: userId } // Xóa B ra khỏi requestFriends của A
                });
            }

            // Lấy độ dài acceptFriends của B trả về cho B
            const infoUserB = await User.findOne({
                _id: userId
            });

            const lengthAcceptFriends = infoUserB.acceptFriends.length;

            socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
                userId: userId,
                lengthAcceptFriends: lengthAcceptFriends
            });


            // lấy userId của A trả về cho B
            socket.broadcast.emit("SERVER_RETURN_USER_ID_CANCEL_FRIEND", {
                userId: userId,
                userIdA: myUserId
            }); 
        });



        // Người dùng từ chối kết bạn
        socket.on("CLIENT_REFUSE_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id;

            // người từ chối hay chấp nhận là B => myUserId: B; userId: A (ngược)

            // Xóa id của A trong acceptFriends của B
            const existUserAinB = await User.findOne({
                _id: myUserId, // tim id cua B
                acceptFriends: userId // trong acceptFriends cua B tim Id cua A
            });

            if(existUserAinB){
                await User.updateOne({
                    _id: myUserId
                }, {
                    $pull: { acceptFriends: userId } // Xóa A ra khỏi acceptFriends của B
                });
            }

            // Xóa id của B trong requestFriends của A
            const existUserBinA = await User.findOne({
                _id: userId,
                requestFriends: myUserId
            });

            if(existUserBinA){
                await User.updateOne({
                    _id: userId
                }, {
                    $pull: { requestFriends: myUserId } // Xóa B ra khỏi requestFriends của A
                });
            }
        });


        // Người dùng chấp nhận kết bạn
        socket.on("CLIENT_ACCEPT_FRIEND", async (userId) => {
            // userId: A, myUserId: B

            const myUserId = res.locals.user.id;

            // Thêm {user_id, room_chat_id} của A vào friendList của B
            // Xóa id của A trong acceptFriends của B
            const existUserAinB = await User.findOne({
                _id: myUserId, 
                acceptFriends: userId 
            });

            if(existUserAinB){
                await User.updateOne({
                    _id: myUserId
                }, {
                    $push: { 
                        friendList: {
                            user_id: userId,
                            room_chat_id: ""
                        }
                    },
                    $pull: { acceptFriends: userId } 
                });
            }

            // Thêm {user_id, room_chat_id} của B vào friendList của A
            // Xóa id của B trong requestFriends của A
            const existUserBinA = await User.findOne({
                _id: userId,
                requestFriends: myUserId
            });

            if(existUserBinA){
                await User.updateOne({
                    _id: userId
                }, {
                    $push: { 
                        friendList: {
                            user_id: myUserId,
                            room_chat_id: ""
                        }
                    },
                    $pull: { requestFriends: myUserId } 
                });
            }
        });
    });
}




