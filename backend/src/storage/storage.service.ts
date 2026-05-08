import { Injectable } from '@nestjs/common';
import { Client } from 'minio';

@Injectable()
export class StorageService {
  private client: Client;
  private bucket = 'lab-files';
  private bucketReady: Promise<void>;

  constructor() {
    this.client = new Client({
      endPoint: 'localhost',
      port: 9000,
      useSSL: false,
      accessKey: 'madmin',
      secretKey: 'xjwnd2@#mSS',
    });
    this.bucketReady = this.ensureBucket();
  }

  async upload(fileName: string, buffer: Buffer, mime: string) {
    await this.bucketReady;
    await this.client.putObject(
      this.bucket,
      fileName,
      buffer,
      buffer.length,
      { 'Content-Type': mime },
    );

    return {
      url: `http://localhost:9000/${this.bucket}/${fileName}`,
    };
  }

  async remove(fileName: string) {
    await this.bucketReady;
    await this.client.removeObject(this.bucket, fileName);
  }

  private async ensureBucket() {
    const exists = await this.client.bucketExists(this.bucket);
    if (!exists) {
      await this.client.makeBucket(this.bucket, 'us-east-1');
    }

    // Allow browser reads for uploaded lab files in local development.
    await this.client.setBucketPolicy(
      this.bucket,
      JSON.stringify({
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: { AWS: ['*'] },
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${this.bucket}/*`],
          },
        ],
      }),
    );
  }
}
