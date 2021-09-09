const mongoose = require('mongoose');

const ChannelsSchema  = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    autorId: {
        type: String,
        required: true
    },
    users: {
        type: Array
    },
    message: {
        type: Array
    }

});

const Users = mongoose.model('channels', ChannelsSchema);

module.exports = Users;
