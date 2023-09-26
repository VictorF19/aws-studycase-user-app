const express = require('express');
const router = express.Router();
const { User } = require('../models/index')
const multer = require('multer')
const multerS3 = require('multer-s3')

const { Upload } = require('@aws-sdk/lib-storage');
const { S3 } = require('@aws-sdk/client-s3');

const accessKeyId = process.env.AWS_S3_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_S3_SECRET_ACCESS_KEY;
const region = process.env.AWS_S3_REGION;
const bucketName = process.env.BUCKET_NAME;

const s3 = new S3({
  region,
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
});

const upload = multer({
  s3: s3,
  bucket: bucketName,
  contentType: multerS3.AUTO_CONTENT_TYPE,
  acl: "public-read",
  key: (req, file, cb) => {
    crypto.randomBytes(16, (err, hash) => {
      if (err) cb(err);

      const fileName = `${hash.toString("hex")}-${file.originalname}`;

      cb(null, fileName);
    });
  },
})

async function uploadPhoto(photo) {
  const { buffer, mimetype } = photo;

  const uploadedFile = await new Upload({
    client: s3,
    params: {
      Bucket: bucketName,
      Key: `photo-${Date.now()}`,
      Body: buffer,
      ContentType: mimetype,
      ContentEncoding: 'base64',
    },
  }).done();

  return uploadedFile
}

router.get('/', async function (req, res, next) {
  const users = await User.findAll()
  res.status(200).json(users);
});

router.post('/', async function (req, res, next) {

  const { body } = req;

  if (!body.name || !body.email) return res.send({ messag: 'Insufficient Data!' })

  const createdUser = await User.create(body);
  res.status(200).json(createdUser);
});

router.put('/:id/photo', upload.single('photo'), async function (req, res, next) {

  const { id } = req.params;

  if (!id) return res.send({ messag: 'Invalid Param!' })

  if (!req.file.mimetype.includes('image')) {
    return res.status(400);
  }

  const photo = req.file;

  const { Location: pictureUrl } = await uploadPhoto(photo)

  const updatedUser = await User.update({ picture: pictureUrl }, {
    where: {
      id
    }
  });

  res.status(200).json(updatedUser);
});

module.exports = router;
