const mongoose = require("mongoose");
const generate = require("../helpers/generate");

const userSchema = new mongoose.Schema(
    {
        fullName: String,
        email: String,
        password: String,
        tokenUser: {
            type: String,
            default: generate.generateRandomString(20)
        },
        phone: String,
        avatar: String,
        friendList: [
            {
                user_id: String,
                room_chat_id: String
            }
        ],
        acceptFriends: Array, // danh sách bạn bè đang đợi mình chấp nhận
        requestFriends: Array, // danh sách bạn bè mình đã gửi lơi mời
        statusOnline: String,
        status: {
            type: String,
            default: "active"
        }, 
        deleted: {
            type: Boolean,
            default: false,
        },
        deletedAt: Date,
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema, "users");

module.exports = User;