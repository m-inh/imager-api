const api = require('express').Router();

const {success, fail, unauthorized} = require('../utils/response');
const {createS3SignedUrl} = require('../services/s3');
const {basicAuth} = require('../middlewares/auth');

api.get('/s3/signed-url',
    basicAuth(),

    async (req, res) => {
        try {
            const fileName = req.user_data.username + " - " + req.query['file-name'];
            const fileType = req.query['file-type'];
            const {signedRequest, url} = await createS3SignedUrl({
                fileName,
                fileType,
                action: 'putObject'
            });

            //todo: auto delete s3 object after 10 minutes

            return res.json(success({signedRequest, name: fileName, url}));
        }
        catch (err) {
            console.log(err);
            res.json(fail(err.message));
        }
    }
);

module.exports = api;