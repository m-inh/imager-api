const mongoose = require('mongoose');

const {unauthorized} = require('../../utils/response');

const User = mongoose.model('User');

module.exports = () => {
    return async (req, res, next) => {
        try {
            const token = req.headers.authorization;
            const [username, password] = token.split(':');

            const user = await User.findOne({username, password});
            if (user) {
                req.user_data = user.toJSON();
                next();
            } else {
                throw new Error('');
            }
        }
        catch (err) {
            res.json(unauthorized("Không thể xác thực người dùng"));
        }
    };
};