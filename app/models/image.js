'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    user_id: String,
    name: {
        type: String,
        unique: true
    },
    caption: String,
    author: Schema.Types.Mixed
});

const Image = mongoose.model('Image', ImageSchema);

module.exports = Image;