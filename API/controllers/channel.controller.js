const ChannelService = require('../services/channel.service')
const jwt = require('jsonwebtoken');
const checkTokenMiddleware = require('../controllers/jwt.controller');

exports.newChannel = async (req, res) => {
    try {
        const token = req.headers.authorization && checkTokenMiddleware.extractBearerToken(req.headers.authorization);
        const decoded = jwt.decode(token, {complete: false});
        let newChannel = await ChannelService.addChannel(req.body.name, decoded.id, decoded.login, decoded.nickName);
        res.status(newChannel.code)
        res.send(newChannel)
    } catch (e) {
        res.status(500)
        res.send( {
            server: {
                error: "la requete n'a pas abouti",
                devMessage: e,
                code: 500
            }
        })
    }
}
exports.joinChannel = async (req, res) => {
    try {
        const token = req.headers.authorization && checkTokenMiddleware.extractBearerToken(req.headers.authorization);
        const decoded = jwt.decode(token, {complete: false});
        let joinChannel = await ChannelService.joinChannel(req.body.name, decoded.id, decoded.login, decoded.nickName);
        res.status(joinChannel.code)
        res.send(joinChannel)
    } catch (e) {
        res.status(500)
        res.send( {
            server: {
                error: "la requete n'a pas abouti",
                devMessage: e,
                code: 500
            }
        })
    }
}
exports.allChannel = async (req, res) => {
    try {
        let allChannel = await ChannelService.allChannel()
        res.status(allChannel.code);
        res.send(allChannel)
    } catch (e) {
        res.status(500)
        res.send( {
            server: {
                error: "la requete n'a pas abouti",
                devMessage: e,
                code: 500
            }
        })
    }
}
exports.oneChannel = async (req, res) => {
    try {
        let oneChannel = await ChannelService.oneChannel(req.body.name);
        res.status(oneChannel.code);
        res.send(oneChannel);
    }  catch (e) {
        res.status(500)
        res.send( {
            server: {
                error: "la requete n'a pas abouti",
                devMessage: e,
                code: 500
            }
        })
    }
}
exports.disconnectUser = async (req, res) => {
    try {
        const token = req.headers.authorization && checkTokenMiddleware.extractBearerToken(req.headers.authorization);
        const decoded = jwt.decode(token, {complete: false});
        let disconectUser = await ChannelService.disconectUser(decoded.id, decoded.login, req.body.name)
        res.status(disconectUser.code);
        res.send(disconectUser);
    } catch (e) {
        res.status(500)
        res.send( {
            server: {
                error: "la requete n'a pas abouti",
                devMessage: e,
                code: 500
            }
        })
    }
}
exports.addMessage = async (req, res) => {
    try {
        const token = req.headers.authorization && checkTokenMiddleware.extractBearerToken(req.headers.authorization);
        const decoded = jwt.decode(token, {complete: false});
        let addMessage = await ChannelService.addMessage(decoded.id, decoded.login, req.body.name, req.body.message);
        res.status(addMessage.code);
        res.send(addMessage);
    } catch (e) {
        res.status(500)
        res.send( {
            server: {
                error: "la requete n'a pas abouti",
                devMessage: e,
                code: 500
            }
        })
    }
}
exports.destroyChannel = async (req, res) => {
    try {
        const token = req.headers.authorization && checkTokenMiddleware.extractBearerToken(req.headers.authorization);
        const decoded = jwt.decode(token, {complete: false});
        let destroyChannel = await ChannelService.destroyChannel(decoded.id, req.body.name);
        res.status(destroyChannel.code);
        res.send(destroyChannel);
    } catch (e) {
        res.status(500)
        res.send( {
            server: {
                error: "la requete n'a pas abouti",
                devMessage: e,
                code: 500
            }
        })
    }
}
