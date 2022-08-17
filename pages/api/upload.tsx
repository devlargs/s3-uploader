import aws from 'aws-sdk';
import crypto from 'crypto';
import dotenv from 'dotenv';
import type { NextApiRequest, NextApiResponse } from 'next';
import { promisify } from 'util';
const randomBytes = promisify(crypto.randomBytes);

dotenv.config();

const region = 'us-east-1';
const bucketName = 'largs-movie-database';
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: 'v4',
});

// eslint-disable-next-line
async function generateUploadURL(): Promise<any> {
  const rawBytes = await randomBytes(16);
  const imageName = rawBytes.toString('hex');

  const params = {
    Bucket: bucketName,
    Key: imageName,
    Expires: 60,
  };

  const uploadURL = await s3.getSignedUrlPromise('putObject', params);
  return uploadURL;
}

const Upload = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  //   res.status(200).json({ name: 'John Doe' });
  const url = await generateUploadURL();
  res.send({ url });
};

export default Upload;
