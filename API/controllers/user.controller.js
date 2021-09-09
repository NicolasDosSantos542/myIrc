const UserService = require('../services/user.service');
const jwt = require('jsonwebtoken');
const checkTokenMiddleware = require('../controllers/jwt.controller');

exports.register = async (req, res) => {
    try {
        let userServiceRes = await UserService.createUser(req.body);

        res.status(userServiceRes.code);
        res.send(userServiceRes);

    } catch (err) {
        res.status(500);
        res.send({
            error: "la requete n'a pas abouti",
            devMessage: err,
            code: 500
        });
    }
}
exports.login = async (req, res) => {
    try {
        let userServiceRes = await UserService.loginUser(req.body);

        res.status(userServiceRes.code);
        res.send(userServiceRes);

    } catch (err) {
        res.status(500)
        res.send({
            error: "La requête n'a pas abouti",
            devMessage: err,
            code: 500
        });
    }
}
exports.unsetUser = async (req, res) => {
    try {
        const token = req.headers.authorization && checkTokenMiddleware.extractBearerToken(req.headers.authorization);
        const decoded = jwt.decode(token, {complete: false});

        let userServiceRes = await UserService.unsetUser(decoded.id);

        res.status(userServiceRes.code);
        res.send(userServiceRes);

    } catch (err) {
        res.status(500)
        res.send({
            error: "La requête n'a pas abouti",
            devMessage: err,
            code: 500
        });
    }
}
exports.updateLogin = async (req, res) => {
    try {
        const token = req.headers.authorization && checkTokenMiddleware.extractBearerToken(req.headers.authorization);
        const decoded = jwt.decode(token, {complete: false});

        let userServiceRes = await UserService.updateLogin(decoded.id, req.body);

        res.status(userServiceRes.code);
        res.send(userServiceRes);

    } catch (err) {
        res.status(500);
        res.send({
            error: "La requête n'a pas abouti",
            devMessage: err,
            code: 500
        });
    }
}
exports.updateNickname = async (req, res) => {
    try {
        const token = req.headers.authorization && checkTokenMiddleware.extractBearerToken(req.headers.authorization);
        const decoded = jwt.decode(token, {complete: false});

        let userServiceRes = await UserService.updateNickname(decoded.id, req.body);

        res.status(userServiceRes.code);
        res.send(userServiceRes);

    } catch (err) {
        res.status(500);
        res.send({
            error: "La requête n'a pas abouti",
            devMessage: err,
            code: 500
        });
    }
}
exports.updateUserPass = async (req, res) => {
    try {
        const token = req.headers.authorization && checkTokenMiddleware.extractBearerToken(req.headers.authorization);
        const decoded = jwt.decode(token, {complete: false});

        let userServiceRes = await UserService.updateUserPass(decoded.id, req.body);
        res.status(userServiceRes.code);
        res.send(userServiceRes);

    } catch (err) {
        res.status(500);
        res.send({
            error: "La requête n'a pas abouti",
            devMessage: err,
            code: 500
        });
    }
}
