const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const checkTokenMiddleware = require('../controllers/jwt.controller');

//create and connect User
router.post('/register', userController.register);
router.post('/connect', userController.login);

//delete User
router.delete('/', checkTokenMiddleware.checkToken, userController.unsetUser);

//update User
router.put('/login', checkTokenMiddleware.checkToken, userController.updateLogin);
router.put('/nickname', checkTokenMiddleware.checkToken, userController.updateNickname);
router.put('/password', checkTokenMiddleware.checkToken, userController.updateUserPass);


module.exports = router;
