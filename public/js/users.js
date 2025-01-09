// chức năng gửi yêu cầu
const listAddFriend = document.querySelectorAll("[btn-add-friend]");
if(listAddFriend.length > 0){
    listAddFriend.forEach(button => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.add("add"); // closest: đi đến class .box-closest rồi thêm class add
            
            const userId = button.getAttribute("btn-add-friend"); // Id cua nguoi nhan loi moi (B)

            socket.emit("CLIENT_ADD_FRIEND", userId);
        });
    });
}
// hết chức năng gửi yêu cầu


// chức năng hủy gửi yêu cầu
const listBtnCancelFriend = document.querySelectorAll("[btn-cancel-friend]");
if(listBtnCancelFriend.length > 0){
    listBtnCancelFriend.forEach(button => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.remove("add");

            const userId =  button.getAttribute("btn-cancel-friend");

            socket.emit("CLIENT_CANCEL_FRIEND", userId);
        });
    });
}
// hết chức năng hủy gửi yêu cầu


// chức năng từ chối kết bạn
const listBtnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]");
if(listBtnRefuseFriend.length > 0){
    listBtnRefuseFriend.forEach(button => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.add("refuse");

            const userId = button.getAttribute("btn-refuse-friend");

            socket.emit("CLIENT_REFUSE_FRIEND", userId);
        });
    });
}
// hết chức năng từ chối kết bạn


// chức năng chấp nhận kết bạn
const listBtnAcceptFriend = document.querySelectorAll("[btn-accept-friend]");
if(listBtnAcceptFriend.length > 0){
    listBtnAcceptFriend.forEach(button => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.add("accepted");

            const userId = button.getAttribute("btn-accept-friend");

            socket.emit("CLIENT_ACCEPT_FRIEND", userId);
        });
    });
}
// hết chức năng chấp nhận kết bạn


// SERVER_RETURN_LENGTH_ACCEPT_FRIEND
socket.on("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", (data) => {
    const badgeUsersAccept = document.querySelector("[badge-users-accept]");
    const userId = badgeUsersAccept.getAttribute("badge-users-accept"); // lấy ra id người đã nhận lời mời(B)

    if(userId == data.userId){
        badgeUsersAccept.innerHTML = data.lengthAcceptFriends;
    }
})
// End SERVER_RETURN_LENGTH_ACCEPT_FRIEND



// SERVER_RETURN_INFO_ACCEPT_FRIEND
socket.on("SERVER_RETURN_INFO_ACCEPT_FRIEND", (data) => {
    const dataUsersAccept = document.querySelector("[data-users-accept]");
    const userId = dataUsersAccept.getAttribute("data-users-accept");

    if(userId == data.userId){
        // Vẽ user ra giao diện
        const newBoxUser = document.createElement("div");
        newBoxUser.classList.add("col-6");
        newBoxUser.setAttribute("user-id", data.infoUserA._id);

        newBoxUser.innerHTML = `
            <div class="box-user">
                <div class="inner-avatar">
                    <img src="/images/avatar.jpg" alt=${data.infoUserA.fullName}>
                </div>
                <div class="inner infor">
                    <div class="inner-name">${data.infoUserA.fullName}</div>
                    <div class="inner-button">
                        <button 
                            class="btn btn-sm btn-primary mr-1"
                            btn-accept-friend="${data.infoUserA._id}"
                        >
                            Chấp nhận
                        </button>
                        <button 
                            class="btn btn-sm btn-secondary mr-1"
                            btn-refuse-friend="${data.infoUserA._id}"
                        >
                            Xóa
                        </button>
                        <button 
                            class="btn btn-sm btn-secondary mr-1"
                            btn-deleted-friend="btn-deleted-friend"
                            disabled="disabled"
                        >
                            Đã xóa
                        </button>
                        <button 
                            class="btn btn-sm btn-primary mr-1"
                            btn-accepted-friend="btn-accepted-friend"
                            disabled="disabled"
                        >
                            Đã chấp nhận
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        dataUsersAccept.appendChild(newBoxUser);



        // Xóa lời mời kb
        const btnRefuseFriend = newBoxUser.querySelector("[btn-refuse-friend]");
        btnRefuseFriend.addEventListener("click", () => {
            btnRefuseFriend.closest(".box-user").classList.add("refuse");
            const userId = btnRefuseFriend.getAttribute("btn-refuse-friend");

            socket.emit("CLIENT_REFUSE_FRIEND", userId);
        });


        // Chấp nhận lời mời kết bạn
        const btnAcceptFriend = newBoxUser.querySelector("[btn-accept-friend]");
        btnAcceptFriend.addEventListener("click", () => {
            btnAcceptFriend.closest(".box-user").classList.add("accepted");

            const userId = btnAcceptFriend.getAttribute("btn-accept-friend");

            socket.emit("CLIENT_ACCEPT_FRIEND", userId);
        });
 
    }
})
// End SERVER_RETURN_INFO_ACCEPT_FRIEND



// SERVER_RETURN_USER_ID_CANCEL_FRIEND
socket.on("SERVER_RETURN_USER_ID_CANCEL_FRIEND", (data) => {
    const dataUsersAccept = document.querySelector("[data-users-accept]");
    const userId = dataUsersAccept.getAttribute("data-users-accept");

    if(userId == data.userId){
        // Xóa A khỏi danh sách của B
        const boxUserRemove = dataUsersAccept.querySelector(`[user-id="${data.userIdA}"]`);

        if(boxUserRemove){
            dataUsersAccept.removeChild(boxUserRemove);
        }
    }
});
// End SERVER_RETURN_USER_ID_CANCEL_FRIEND