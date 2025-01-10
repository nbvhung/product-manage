const User = require("../../models/user.model");

const usersSocket = require("../../socket/client/users.socket");

// [GET] /users/not-friend
module.exports.notFriend = async (req, res) => {
    // Socket
    usersSocket(res);
    // End Socket

    const userId = res.locals.user.id;
    
    const myUser = await User.findOne({
        _id: userId
    });

    const requestFriends = myUser.requestFriends; // lấy được mảng chứa những người yêu cầu
    const acceptFriends = myUser.acceptFriends;

    const users = await User.find({
        //_id: { $ne: userId}, // danh sách users không bao gồm chính mình; $ne: not equal
        $and: [
            {_id: { $ne: userId }}, 
            {_id: { $nin: requestFriends }}, 
            {_id: { $nin: acceptFriends }}
        ], // danh sách users không bao gồm những người mình đã gửi lời mời and danh sách users không bao gồm chính mình; $ne: not equal
        status: "active",
        deleted: false
    }).select("avatar fullName");

    res.render("client/pages/users/not-friend", {
        pageTitle: "Danh sách người dùng",
        users: users
    });
}


// [GET] /users/request
module.exports.request = async (req, res) => {
    // Socket
    usersSocket(res);
    // End Socket

    const userId = res.locals.user.id;

    const myUser = await User.findOne({
        _id: userId
    });

    const requestFriends = myUser.requestFriends;

    const users = await User.find({
        _id: { $in: requestFriends },
        status: "active",
        deleted: false
    }).select("id avatar fullName");

    res.render("client/pages/users/request", {
        pageTitle: "Lời mời đã gửi",
        users: users
    });
}


// [GET] /users/accept
module.exports.accept = async (req, res) => {
    // Socket
    usersSocket(res);
    // End Socket

    const userId = res.locals.user.id;

    const myUser = await User.findOne({
        _id: userId
    });

    const acceptFriends = myUser.acceptFriends;

    const users = await User.find({
        _id: { $in: acceptFriends },
        status: "active",
        deleted: false
    }).select("id avatar fullName");


    res.render("client/pages/users/accept", {
        pageTitle: "Lời mời kết bạn",
        users: users
    })
}


// [GET] /users/friends
module.exports.friends = async (req, res) => {
    // Socket
    usersSocket(res);
    // End Socket

    const userId = res.locals.user.id;

    const myUser = await User.findOne({
        _id: userId
    });

    const friendList = myUser.friendList;

    const friendListId = friendList.map(item => item.user_id)

    const users = await User.find({
        _id: { $in: friendListId },
        status: "active",
        deleted: false
    }).select("id avatar fullName statusOnline");

    res.render("client/pages/users/friends", {
        pageTitle: "Danh sách bạn bè",
        users: users
    });
}