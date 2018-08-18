const api = require('express').Router();
const mongoose = require('mongoose');

const {success, fail, unauthorized} = require('../utils/response');
const {getS3Url, createS3SignedUrl} = require('../services/s3');
const {mustHave} = require('../middlewares/verify-payload');
const {basicAuth} = require('../middlewares/auth');

const Image = mongoose.model('Image');

api.get('/images',
    basicAuth(),

    async (req, res) => {
        try {
            const page_size = parseInt(req.query.page_size || 10);
            const page_number = parseInt(req.query.page_number || 0);

            const images = await Image.find({}).sort("-_id").limit(page_size).skip(page_number * (page_size + 1));
            //todo: get image from s3 and create get signed-url
            // const s3Urls = images.map(
            //     (img) => ({url: getS3Url({fileName: img.name}), author: img.author, caption: img.caption})
            // );

            const testImage = images.pop();
            const {signedRequest} = await createS3SignedUrl({fileName: testImage.name, fileType: "image/png", action: "getObject"});
            const testPayload = {
                url: signedRequest,
                author: testImage.author,
                caption: testImage.caption
            };

            // return res.json(success({images: s3Urls}));
            return res.json(success({images: [testPayload]}));
        }
        catch (err) {
            res.json(fail(err.message));
        }
    }
);

// api.get('/images/:id', (req, res) => {
//     return res.json({hello: "you"});
// });

api.post('/images',
    mustHave(
        "name",
        "caption"
    ),
    basicAuth(),

    async (req, res) => {
        const {name, caption} = req.body;
        const userData = req.user_data;

        try {
            const newImage = new Image({name, caption, author: {username: userData.username, gender: userData.gender}});
            //todo: find and delete auto delete s3 object command

            const savedImage = await newImage.save();

            return res.json(success(savedImage.toJSON()));
        }
        catch (err) {
            res.json(fail(err.message));
        }
    }
);

// api.delete('/images', (req, res) => {
//     return res.json({hello: "you"});
// });

module.exports = api;