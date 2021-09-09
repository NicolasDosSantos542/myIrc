const messageService = require("../services/message.service");
const checkTokenMiddleware = require("./jwt.controller");
const jwt = require("jsonwebtoken");

let user;
let users = [];

onChatMessage = (socket, message) => {
    socket.broadcast.emit('chat-message', message);
    console.log("message / nickName =>",message)
}
onUserList = (socket, users) => {

}
onUserLogin = (socket, data) => {
    const token = "Bearer "+ data.token && checkTokenMiddleware.extractBearerToken("Bearer "+data.token);
     user = jwt.decode(token, {complete: false});

    // console.log("decoded => ",user)
     // console.log("onUserLogin, user = ", user)
        users.push(user)
    // console.log(users)
socket.emit("user-list", users)
    socket.broadcast.emit("new-user", user)
    }

onNewUser = (socket, data) =>{
    users.push(data)
    socket.emit("new-user", data)
    
}
onChangeNickName = (socket, data) => {
    // console.log(users)
    let pos = users.indexOf(data[0])
    console.log(pos)
    users.splice(pos, 1, data[1])
    console.log(users)
}
onDisconnect = async function (socket) {
    console.log("users", users)
    console.log("toto", user)


    users.forEach(function(item, index, object) {
        console.log("item", item)
        if (item.id === user.id) {
            object.splice(index, 1);
        }
    });

    console.log("after delete",users)
    socket.broadcast.emit('user-disconnect', user)
    socket.emit('user-disconnect', user)
    console.log("good bye")

}

module.exports = {
    onChatMessage,
    onUserLogin,
    onChangeNickName,
    onDisconnect,
    onUserList,
    onNewUser,
    
}
