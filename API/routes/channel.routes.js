const express = require('express');
const router = express.Router();
const channelController = require('../controllers/channel.controller');
const checkTokenMiddleware = require('../controllers/jwt.controller');

router.post('/',checkTokenMiddleware.checkToken, channelController.newChannel);
router.post('/join', checkTokenMiddleware.checkToken, channelController.joinChannel);
router.post('/message', checkTokenMiddleware.checkToken, channelController.addMessage)

router.get('/', checkTokenMiddleware.checkToken, channelController.allChannel);
router.get('/one', checkTokenMiddleware.checkToken, channelController.oneChannel);

router.put('/disconnect', checkTokenMiddleware.checkToken, channelController.disconnectUser)

router.delete('/', checkTokenMiddleware.checkToken, channelController.destroyChannel)

module.exports = router;
