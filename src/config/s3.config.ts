import * as AWS from 'aws-sdk';

export const s3 = new AWS.S3({
  endpoint: 'http://localhost:4566', // LocalStack S3 endpoint
  region: 'ap-northeast-2',
  accessKeyId: 'test',
  secretAccessKey: 'test',
  s3ForcePathStyle: true,
});

export const S3_BUCKET = 'app';
