import { Injectable } from '@nestjs/common';
import { s3, S3_BUCKET } from '../../config/s3.config';

@Injectable()
export class FileService {
  async uploadFile(
    file: Express.Multer.File,
  ): Promise<{ key: string; url: string }> {
    const epoch = Date.now();
    const filename = `${epoch}_${file.originalname}`;
    const key = `temp/${filename}`;
    await s3
      .upload({
        Bucket: S3_BUCKET,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
      })
      .promise();
    const url = s3.endpoint.href + S3_BUCKET + '/' + key;
    return { key, url };
  }

  async getPresignedUrl(key: string, expiresIn = 60): Promise<string> {
    console.log('[PRESIGNED-URL PARAMS]', {
      Bucket: S3_BUCKET,
      Key: key,
      Expires: expiresIn,
    });
    const params = {
      Bucket: S3_BUCKET,
      Key: key,
      Expires: expiresIn,
    };
    return s3.getSignedUrlPromise('getObject', params);
  }

  async moveFile(tempKey: string, destPath: string): Promise<void> {
    console.log('[FileService.moveFile] headObject params:', {
      Bucket: S3_BUCKET,
      Key: tempKey,
    });
    // 파일 존재 확인
    try {
      await s3.headObject({ Bucket: S3_BUCKET, Key: tempKey }).promise();
      console.log('[FileService.moveFile] headObject success:', tempKey);
    } catch (e) {
      console.error('[FileService.moveFile] headObject error:', e);
      throw new Error('저장된 파일이 없습니다.');
    }
    // 복사
    console.log('[FileService.moveFile] copyObject params:', {
      Bucket: S3_BUCKET,
      CopySource: `/${S3_BUCKET}/${tempKey}`,
      Key: destPath,
    });
    await s3
      .copyObject({
        Bucket: S3_BUCKET,
        CopySource: `/${S3_BUCKET}/${tempKey}`,
        Key: destPath,
      })
      .promise();
    console.log('[FileService.moveFile] copyObject success:', destPath);
    // 삭제
    console.log('[FileService.moveFile] deleteObject params:', {
      Bucket: S3_BUCKET,
      Key: tempKey,
    });
    await s3.deleteObject({ Bucket: S3_BUCKET, Key: tempKey }).promise();
    console.log('[FileService.moveFile] deleteObject success:', tempKey);
  }

  async deleteFile(key: string): Promise<void> {
    try {
      await s3.deleteObject({ Bucket: S3_BUCKET, Key: key }).promise();
      console.log('[FileService.deleteFile] deleteObject success:', key);
    } catch (e) {
      console.error('[FileService.deleteFile] deleteObject error:', e);
      // 파일이 없으면 무시
    }
  }
}
