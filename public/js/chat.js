import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'


// // fileUploadWithPreview    
// const upload = new FileUploadWithPreview.FileUploadWithPreview('upload-image', {
//     multiple: true,
//     maxFileCount: 6
// });

// // End fileUploadWithPreview

// CLIENT_SEND_MESSAGES 
const formSendData = document.querySelector(".chat .inner-form");
if (formSendData) {
    formSendData.addEventListener("submit", (e) => {
        e.preventDefault(); // ngăn load lại trang
        const content = e.target.elements.content.value; // lấy ra giá trị khi nhắn tin
        // const images = upload.catchFileArray || [];

        if (content) {
            // Gửi content hoặc ảnh lên trên server\
            socket.emit("CLIENT_SEND_MESSAGE", content); // gui len server
            e.target.elements.content.value = "";
            socket.emit("CLIENT_SEND_TYPING", "hidden");
        }
    });
}
// End CLIENT_SEND_MESSAGES 


// SERVER_RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
    const myId = document.querySelector("[my-id]").getAttribute("my-id"); // lay ra id nguoi gui
    const body = document.querySelector(".chat .inner-body");
    const boxTyping = document.querySelector(".inner-list-typing");

    const div = document.createElement("div"); // tao ra 1 the div

    let htmlFullName = "";

    if (myId == data.userId) { // người nhắn(gửi)
        div.classList.add("inner-outgoing"); // add class inner-outgoing cho the div (nguoi gui)
        // htmlFullName = "";
    }
    else {
        div.classList.add("inner-incoming"); // add class inner-incoming cho the div (nguoi nhan)
        htmlFullName = `<div class="inner-name">${data.fullName}</div>`; // người nhận cần thấy tên người gửi
    }



    div.innerHTML = `
        ${htmlFullName}
        <div class="inner-content">${data.content}</div>
    `;

    body.insertBefore(div, boxTyping); // them the div vao the body va insert vao truoc Typing

    body.scrollTop = body.scrollHeight;
})
// End SERVER_RETURN_MESSAGE



// Scroll Chat To Bottom
const bodyChat = document.querySelector(".chat .inner-body");
if (bodyChat) {
    bodyChat.scrollTop = bodyChat.scrollHeight;
}

// End Scroll Chat To Bottom



// Show Typing
var timeOut;
const showTyping = () => {
    socket.emit("CLIENT_SEND_TYPING", "show");

    clearTimeout(timeOut);// khi đang gõ thì thời gian để ẩn typing được reset lại

    timeOut = setTimeout(() => {
        socket.emit("CLIENT_SEND_TYPING", "hidden");// ẩn typing khi ko gõ
    }, 2000)
}
// End Show Typing



// emoji-picker

//Show popup
const buttonIcon = document.querySelector(".button-icon");
const tooltip = document.querySelector(".tooltip");
Popper.createPopper(buttonIcon, tooltip);

buttonIcon.onclick = () => {
    tooltip.classList.toggle("shown");
}


// Insert Icon
const emojiPicker = document.querySelector("emoji-picker");
if (emojiPicker) {
    const inputChat = document.querySelector(".chat .inner-form input[name='content']");

    emojiPicker.addEventListener("emoji-click", (event) => {
        const icon = event.detail.unicode;
        inputChat.value = inputChat.value + icon;
        const end = inputChat.value.length;
        inputChat.setSelectionRange(end, end); // chen icon thi focus duoc xuong cuoi cung doan chat
        inputChat.focus();

        showTyping();
    });


    inputChat.addEventListener("keyup", () => {
        showTyping();
    });

}
// end emoji-picker



// SERVER_RETURN_TYPING
const elementListTyping = document.querySelector(".chat .inner-list-typing");
if (elementListTyping) {
    socket.on("SERVER_RETURN_TYPING", (data) => {
        if(data.type == "show"){
            const existTyping = elementListTyping.querySelector(`[user-id="${data.userId}"]`);

            if(!existTyping){
                const bodyChat = document.querySelector(".chat .inner-body");
                const boxTyping = document.createElement("div");
                boxTyping.classList.add("box-typing");
                boxTyping.setAttribute("user-id", data.userId);

                boxTyping.innerHTML = `
                    <div class="inner-name">${data.fullName}</div>
                    <div class="inner-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                `;

                elementListTyping.appendChild(boxTyping);
                bodyChat.scrollTop = bodyChat.scrollHeight;
            }
        }
        else{
            const boxTypingRemove = elementListTyping.querySelector(`[user-id="${data.userId}"]`);
            
            if(boxTypingRemove){
                elementListTyping.removeChild(boxTypingRemove);
            }
        }
    });
}


// End SERVER_RETURN_TYPING



