import { Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ObjectStorageService {
  storage: Storage;
  bucket: string;

  constructor() {
    this.storage = new Storage({
      projectId: process.env.FIREBASE_PROJECT_ID,
      credentials: {
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        private_key: process.env.FIREBASE_PRIVATE_KEY,
      },
    });

    this.bucket = process.env.FIREBASE_STORAGE_BUCKET;
  }

  async uploadFile(file: Express.Multer.File) {
    const bucket = this.storage.bucket(this.bucket);
    const blob = bucket.file(file.originalname);
    const blobStream = blob.createWriteStream();

    return new Promise((resolve, reject) => {
      blobStream.on('error', (err) => {
        reject(err);
      });

      blobStream.on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${this.bucket}/${blob.name}`;
        resolve(publicUrl);
      });

      blobStream.end(file.buffer);
    });
  }

  // Function to generate a signed URL
  async getFile(file: string): Promise<{ signedUrl: string }> {
    console.log('Generating signed URL for file:', file);
    const bucket = this.storage.bucket(this.bucket);
    const fileRef = bucket.file(file);

    try {
      // Generate a signed URL with an expiration time (e.g., 15 minutes)
      const [signedUrl] = await fileRef.getSignedUrl({
        action: 'read',
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes from now
      });

      console.log('Signed URL generated successfully:', signedUrl);
      return { signedUrl: signedUrl };
    } catch (error) {
      console.error('Error generating signed URL:', error);
      throw error;
    }
  }

  // Function to delete a file
  async deleteFile(file: string): Promise<void> {
    console.log('Deleting file:', file);
    const bucket = this.storage.bucket(this.bucket);
    const fileRef = bucket.file(file);

    try {
      await fileRef.delete();
      console.log('File deleted successfully:', file);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }

  async updateFile(file: string, newFile: Express.Multer.File) {
    await this.deleteFile(file);
    return await this.uploadFile(newFile);
  }
}
