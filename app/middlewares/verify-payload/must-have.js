const {fail} = require('../../utils/response');

module.exports = (...requires) => {
    return (req, res, next) => {
        const payloadKeys = Object.keys(req.body);
        const isHaveAll = requires.reduce((acc, current) => {
            return acc && payloadKeys.indexOf(current) !== -1;
        }, true);

        isHaveAll ? next() : res.json(fail('Thiếu dữ liệu truyền lên'));
    };
};