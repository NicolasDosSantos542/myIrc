const mongoose = require('mongoose');

const messageSchema  = new mongoose.Schema({
    id_user: {
        type: String,
        required: true
    },
    login: {
        type: String,
        required: true
    },
    nickName: {
        type: String,
        required: true
    },
    message : {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    }
});

const Users = mongoose.model('message', messageSchema);

module.exports = Users;
