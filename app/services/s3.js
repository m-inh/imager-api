const aws = require('aws-sdk');
const config = require('config');

aws.config.update({
    accessKeyId: config.get('aws.access_key_id'),
    secretAccessKey: config.get('aws.secret')
});

const s3 = new aws.S3();
const S3_BUCKET = config.get('aws.s3_bucket');

function createS3SignedUrl({fileName, fileType, expired, acl, action}) {
    const s3Params = {
        Bucket: S3_BUCKET,
        Key: fileName,
        Expires: expired || 600,
    };

    if (action === 'putObject') {
        s3Params["ContentType"] = fileType;
        s3Params["ACL"] = acl;
    } else if (action === 'getObject') {
        // ko lam gi ca
    }

    return new Promise((resolve, reject) => {
        return s3.getSignedUrl(action, s3Params, (err, data) => {
            if (err) {
                return reject(err);
            }
            const returnData = {
                signedRequest: data,
                url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
            };

            return resolve(returnData);
        });
    });
}

function getS3Url({fileName}) {

    // s3.getSignedUrl('getObject', {
    //     Bucket: myBucket,
    //     Key: myKey,
    //     Expires: signedUrlExpireSeconds
    // })

    return `https://${S3_BUCKET}.s3.amazonaws.com/${encodeURIComponent(fileName)}`;
}

module.exports = {
    createS3SignedUrl,
    getS3Url
};