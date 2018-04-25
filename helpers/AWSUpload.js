const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const secret = require('../secret/secretfile');

AWS.config.update({
    accessKeyId: secret.s3.accessKeyId,
    secretAccessKey: secret.s3.secretAccessKey,
    region: secret.s3.region
});

const s0 = new AWS.S3({});
const upload = multer({
    storage: multerS3({
        s3: s0,
        bucket: secret.s3.bucket,
        acl: secret.s3.acl,
        metadata: function(req, file, cb){
            cb(null, {fieldName: file.fieldname});
        },
        key: function(req, file, cb){
            cb(null, file.originalname);
        }
    }),

    rename: function (fieldname, filename) {
        return filename.replace(/\W+/g, '-').toLowerCase();
    }
})

exports.Upload = upload;











