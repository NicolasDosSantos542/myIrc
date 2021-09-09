const ChannelService = require('../services/channel.service')
const jwt = require('jsonwebtoken');
const checkTokenMiddleware = require('../controllers/jwt.controller');
var sha1 = require('sha1');

function socketRouter(io) {

    io.on("connection", (socket) => {
        socket.on("join-channel", async (data) => {
            const token = "Bearer " + data.token && checkTokenMiddleware.extractBearerToken("Bearer " + data.token);
            const decoded = jwt.decode(token, {complete: false});
            let connexionToChannel = await ChannelService.joinChannel(data.channel, decoded.id, decoded.login, decoded.nickName, socket.id);
            if (connexionToChannel.success) {
                let getChannel = await ChannelService.oneChannel(data.channel);
                socket.emit("res-join", getChannel)

                socket.join(getChannel.channel.name);
                socket.to(getChannel.channel.name).emit("user-join-your-channel", decoded.nickName)
            } else {
                socket.emit("res-join", connexionToChannel);
            }
        })
        socket.on("new-message", async (data) => {
            const token = "Bearer " + data.token && checkTokenMiddleware.extractBearerToken("Bearer " + data.token);
            const decoded = jwt.decode(token, {complete: false});
            let test = sha1(decoded.id)
            let subStr = test.substring(0, 6)
            let newMessage = await ChannelService.addMessage(decoded.id, decoded.login, decoded.nickName, data.name, data.message, "#" + subStr);
            if (newMessage.success) {
                let messageForAll = {
                    login: decoded.login,
                    idUser: decoded.id,
                    message: data.message,
                    nickName: decoded.nickName,
                    color: "#" + subStr
                }
                socket.to(data.name).emit("new-message", messageForAll)
            } else {
                socket.emit("error", newMessage)
            }
        })
        socket.on('list', async () => {
            let channels = await ChannelService.allChannel()
            if(channels.success) {
                socket.emit('list', channels.channels)
            }
        });
        socket.on("create-channel", async (data) => {
            const token = "Bearer " + data.token && checkTokenMiddleware.extractBearerToken("Bearer " + data.token);
            const decoded = jwt.decode(token, {complete: false});
            let createChannel = await ChannelService.addChannel(data.name, decoded.id, decoded.login, decoded.nickName, socket.id)
            if(createChannel.success) {
                let getChannel = await ChannelService.oneChannel(data.name);
                socket.emit("res-join", getChannel)
                socket.join(data.name);
                io.emit("success", "Le channel " + data.name + " Vien d'être créer par " + decoded.nickName)
            } else {
                socket.emit('error', createChannel)
            }
        })
        socket.on("leave", (data) => {
            ChannelService.disconectUser(socket.id);
            socket.leave(data.name)
            socket.broadcast.to(data.name).emit("leave", {error: data.nickName + " a quitter le channel :'(",  nickName: data.nickName})
        })
        socket.on("delete-channel", async (data) => {
            const token = "Bearer " + data.token && checkTokenMiddleware.extractBearerToken("Bearer " + data.token);
            const decoded = jwt.decode(token, {complete: false});
            let resDelete = await ChannelService.destroyChannel(decoded.id, data.name)
            if(resDelete.success) {
                socket.delete(data.name);
                socket.emit("channel-remove", "Le channel " + data.name + " Vien d'être créer par " + decoded.nickName);
                io.emit("channel-remove", "Le channel " + data.name + " Vien d'être créer par " + decoded.nickName);
            } else {
                socket.emit("error", resDelete)
            }
        })

        socket.on("disconnect", () => {
            ChannelService.disconectUser(socket.id);
       })
    })
}

module.exports = {socketRouter}

