'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: String,
    username: {
        type: String,
        unique: true
    },
    gender: String,
    password: String,
    avatar_url: String
});

const User = mongoose.model('User', UserSchema);

module.exports = User;