const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const config = require('config');
const cors = require('cors');

const db = require('./database');

const port = process.env.PORT || 3001;

db.connect(config.get('mongodb.uri'))
    .then((msg) => {
        console.log(msg);

        const app = express();

        app.use(morgan('dev'));
        app.use(cors());
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded());
        app.use(express.static('./public'));

        app.get('/ping', (req, res) => {
            return res.send('pong');
        });

        app.use('/api', require('./api'));

        app.listen(port, (err) => {
            if (!err) console.log('Server is listening on', port);
        });
    })
    .catch(err => {
        throw err;
    });