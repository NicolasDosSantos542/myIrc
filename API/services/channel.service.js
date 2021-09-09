const Channel = require('../models/channelModel')

exports.addChannel = async (name, idUser, login, nickName, socketId) => {
    try {
        let valid = await Channel.findOne({name: name})
        if (valid === null) {
            const channel = new Channel({createdAt: new Date()})
            const content = {
                name: name,
                autorId: idUser,
                users: [{
                    socketId: socketId,
                    idUser: idUser,
                    login: login,
                    nickName: nickName
                }]
            }
            Object.assign(channel, content);
            await channel.save();
            return {
                success: true,
                code: 201
            };
        } else {
            return {
                error: false,
                code: 400
            }
        }
    } catch (e) {
        return {
            server: {
                error: "la requete n'a pas abouti",
                devMessage: e,
                code: 500
            }
        };
    }
}
exports.joinChannel = async (name, idUser, login, nickName, socketId) => {
    try {
        let test = await Channel.findOne({name: name});
        let valid = true
        if(test === null) {
            return {
                error: "Le Channel n'existe pas !",
                code: 400
            };
        } else {
            await test.users.forEach(element => {
                if (element.idUser === idUser) {
                    valid = false
                }
            })
        }
        if (valid === true) {
            let resultUpdate = await Channel.findOneAndUpdate(
                {name: name},
                {
                    $push: {
                        users: [{
                            socketId: socketId,
                            idUser: idUser,
                            login: login,
                            nickName: nickName
                        }]
                    }
                })
            if (resultUpdate) {
                return {
                    success: true,
                    code: 201
                };
            } else {
                return {
                    error: "Le Channel n'existe pas !",
                    code: 400
                };
            }
        } else {
            return {
                success: "Vous avez déjà rejoin ce channel !",
                code: 200
            }
        }
    } catch (e) {
        return {
            server: {
                error: "la requete n'a pas abouti",
                devMessage: e,
                code: 500
            }
        };
    }
}
exports.allChannel = async () => {
    try {
        let channels = await Channel.find({});
        let result = {channels: [], success: true, code: 200}
        await channels.forEach(element => {
            result.channels.push({
                name: element.name,
            })
        })
        return result
    } catch (e) {
        return {
            error: "la requete n'a pas abouti",
            devMessage: e,
            code: 500
        }
    }
}
exports.oneChannel = async (name) => {
    try {
        let channel = await Channel.findOne({name: name})
        if (channel) {
            return {
                success: true,
                code: 200,
                channel: channel
            }
        } else {
            return {
                error: "aucun channel n'existe sous ce nom",
                code: 400
            }
        }
    } catch (e) {
        return {
            error: "la requete n'a pas abouti",
            devMessage: e,
            code: 500
        }
    }
}
exports.disconectUser = async (socketId) => {
    try {
        await Channel.updateMany(
            {"users.socketId": socketId},
            {
                $pull: {
                    "users": {
                        socketId: socketId
                    }
                }
            }
        )
        let newChannel = await Channel.findOne({name: name})
        return {
            success: true,
            code: 200,
            channel: newChannel,
            name: channel.name
        }
    } catch (e) {
        return {
            error: "la requete n'a pas abouti",
            devMessage: e,
            code: 500
        }
    }
}
exports.addMessage = async (idUser, login, nickName, name, message, color) => {
    try {
        await Channel.updateOne(
            {name: name},
            {
                $push: {
                    message: [{
                        idUser: idUser,
                        login: login,
                        nickName: nickName,
                        message: message,
                        color: color
                    }]
                }
            }
        )
        return {
            success: true,
            code: 200,
        }
    } catch (e) {
        return {
            error: "la requete n'a pas abouti",
            devMessage: e,
            code: 500
        }
    }
}
exports.destroyChannel = async (idUser, name) => {
    try {
        let channel = await Channel.findOne({name: name, autorId: idUser});
        if(channel === null) {
            return {
                error: "Ce n'est pas votre channel",
                code: 400
            }
        } else {
            await Channel.deleteOne({name: name, autorId: idUser});
            return {
                success: true,
                code: 200,
            }
        }
    } catch (e) {
        return {
            error: "la requete n'a pas abouti",
            devMessage: e,
            code: 500
        }
    }
}
