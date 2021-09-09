const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const SECRET = 'mykey';
const bcrypt = require('bcrypt');

exports.createUser = async (newUser) => {
    try {
        if (newUser.password !== newUser.confPassword) {
            return {
                error: "Les mots de passes ne sont pas identiques",
                code: 400
            }
        }
        if (newUser.login.length < 2 || newUser.login.length > 9) {
            return {
                error: "Le nom d'utilisateur doit faire entre 2 et 9 caractères !",
                code: 400
            }
        }
        if (newUser.nickName.length < 2 || newUser.nickName.length > 9) {
            return {
                error: "Le nom d'utilisateur doit faire entre 2 et 9 caractères !",
                code: 400
            }
        }
        const checkLogin = await User.findOne({login: newUser.login});

        if (checkLogin === null) {
            newUser.password = await bcrypt.hash(newUser.password, 10);
            const user = new User({createdAt: new Date()});
            Object.assign(user, newUser);
            await user.save();
            return {
                success: true,
                code: 201
            };
        } else {
            return {
                error: "Ce Login existe déjà !",
                code: 400
            };
        }
    } catch (err) {
        return {
            server: {
                error: "la requete n'a pas abouti",
                devMessage: err,
                code: 500
            }
        };
    }
}
exports.loginUser = async (logUser) => {
    try {
        const user = await User.findOne({login: logUser.login})
        if (!user) {
            return {
                error: "Vos identifiants sont incorect !",
                code: 400
            }
        } else {
            let valid = await bcrypt.compare(logUser.password, user.password)
            if (!valid) {
                return {
                    error: "Vos identifiants sont incorect !",
                    code: 400
                }
            } else {
                const token = jwt.sign({
                    id: user._id,
                    login: user.login,
                    nickName: user.nickName
                }, SECRET, {expiresIn: '3 hours'})
                return {
                    success: true,
                    code: 200,
                    token: token,
                    login: user.login,
                    nickName: user.nickName,
                };
            }
        }
    } catch (err) {
        return {
            error: "la requete n'a pas abouti",
            devMessage: err,
            code: 500
        }
    }
}
exports.unsetUser = async (id) => {
    try {
        await User.deleteOne({_id: id});
        return {
            success: true,
            code: 200,
            message: "Votre compte a bien été supprimé !"
        };
    } catch (err) {
        return {
            error: "La requete n'a pas abouti",
            devMessage: err,
            code: 500
        }
    }
}
exports.updateLogin = async (id, change) => {
    console.log(change)
    try {
        const user = await User.findOne({_id: id})
        console.log(user)
        if (user.login === change.login) {
            return {
                success: true,
                code: 200,
                message: "Aucun changement n'a été effectuer",
                login: change.login
            }
        }
        if (change.login.length < 2 || change.login.length > 9) {
            return {
                error: "Le nom d'utilisateur doit faire entre 2 et 9 caractères !",
                code: 400
            }
        }
        const checkLogin = await User.findOne({login: change.login});
        if (checkLogin) {
            return {
                error: "Ce Login existe déjà !",
                code: 400
            };
        }
        await User.findOneAndUpdate({_id: id}, {login: change.login});
        return {
            success: true,
            code: 200,
            message: "Votre Login a bien été modifier",
            login: change.login
        };
    } catch (err) {
        return {
            error: "La requete n'a pas abouti",
            devMessage: err,
            code: 500
        }
    }
}
exports.updateNickname = async (id, change) => {
    try {
        const user = await User.findOne({_id: id})
        if (user.nickName === change.nickName) {
            return {
                success: true,
                code: 200,
                message: "Aucun changement n'a été effectuer",
                nickName: change.nickName
            }
        }
        if (change.nickName < 2 || change.nickName > 9) {
            return {
                error: "Le nom d'utilisateur doit faire entre 2 et 9 caractères !",
                code: 400
            }
        }
        await User.findOneAndUpdate({_id: id}, {nickName: change.nickName});
        return {
            success: true,
            code: 200,
            message: "Votre Login a bien été modifier",
            nickName: change.nickName
        };
    } catch (err) {
        return {
            error: "La requete n'a pas abouti",
            devMessage: err,
            code: 500
        }
    }
}
exports.updateUserPass = async (id, change) => {
    try {
        if (change.newPassword !== change.confPassword) {
            return {
                error: "les nouveaux mots de passes ne sont pas identique",
                code: 400
            }
        }
        let user = await User.findOne({_id: id})
        let valid = await bcrypt.compare(change.password, user.password)
        if (!valid) {
            return {
                error: "L'ancien mot de pass ne correspond pas !",
                code: 400
            };
        }
        change.confPassword = await bcrypt.hash(change.confPassword, 10);
        await User.findOneAndUpdate({_id: id}, {password: change.confPassword});
        return {
            success: true,
            code: 200,
            message: "Le mot de passe a bien été changer"
        };
    } catch (err) {
        return {
            error: "La requete n'a pas abouti",
            devMessage: err,
            code: 500
        }
    }
}
