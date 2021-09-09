const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const UsersSchema  = new mongoose.Schema({
    login: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    nickName: {
        type: String,
        required: true
    },
    createdAt : {
        type: Date,
        required: true
    }
});

UsersSchema.plugin(uniqueValidator);

const Users = mongoose.model('users', UsersSchema);

module.exports = Users;
