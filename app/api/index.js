const api = require('express').Router();
const Glob = require('glob');

const {success, fail, unauthorized} = require('../utils/response');

api.get('/', (req, res) => {
    return res.json(success({hello: "you"}));
});

const apis = Glob.sync("**/*.api.js");
apis.forEach((subApi) => api.use(require('../../' + subApi)));

module.exports = api;