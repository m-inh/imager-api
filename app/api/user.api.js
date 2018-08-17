const api = require('express').Router();
const mongoose = require('mongoose');

const {success, fail, unauthorized} = require('../utils/response');
const {mustHave} = require('../middlewares/verify-payload');
const {basicAuth} = require('../middlewares/auth');

const User = mongoose.model('User');

// api.get('/users', (req, res) => {
//     return res.json({hello: "you"});
// });
//
// api.get('/users/:id', (req, res) => {
//     return res.json({hello: "you"});
// });
//
// api.put('/users/:id', (req, res) => {
//     return res.json({hello: "you"});
// });

api.post('/users/login',
    mustHave(
        "username",
        "password"
    ),

    async (req, res) => {
        const {username, password} = req.body;

        try {
            const user = await User.findOne({username, password});
            if (user) {
                return res.json(success(user));
            } else {
                throw new Error("Thông tin đăng nhập không đúng");
            }
        }
        catch (err) {
            res.json(fail(err.message));
        }
    }
);

api.post('/users/register',
    mustHave(
        'username',
        'password',
        'gender'
    ),
    async (req, res) => {
        const {username, password, gender} = req.body;

        try {
            const newUser = new User({username, password, gender});
            const savedUser = await newUser.save();

            return res.json(success(savedUser));
        }
        catch (err) {
            res.json(fail("Tên người dùng đã tồn tại"));
        }
    }
);

module.exports = api;