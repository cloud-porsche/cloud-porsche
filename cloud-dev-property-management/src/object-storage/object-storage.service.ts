import { Injectable, Logger } from '@nestjs/common';
import { storage } from 'firebase-admin';

@Injectable()
export class ObjectStorageService {
  private readonly logger = new Logger(ObjectStorageService.name);

  storage: storage.Storage;
  bucket: string;

  constructor() {
    this.storage = storage();
    this.logger.debug(
      `Cloud Storage initialized at: ${this.storage.bucket().name}`,
    );
    this.bucket = process.env.FIREBASE_STORAGE_BUCKET;
  }

  async uploadFile(file: Express.Multer.File) {
    const bucket = this.storage.bucket(this.bucket);
    const fileRef = bucket.file(file.originalname);
    const blobStream = fileRef.createWriteStream();

    return new Promise((resolve, reject) => {
      blobStream.on('error', (err) => {
        reject(err);
      });

      blobStream.on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${this.bucket}/${fileRef.name}`;
        resolve(publicUrl);
      });

      blobStream.end(file.buffer);
    });
  }

  // Function to generate a signed URL
  async getFile(file: string): Promise<{ signedUrl: string }> {
    this.logger.debug(`Generating signed URL for file: ${file}`);
    const bucket = this.storage.bucket(this.bucket);
    const fileRef = bucket.file(file);

    try {
      // Generate a signed URL with an expiration time (e.g., 15 minutes)
      const [signedUrl] = await fileRef.getSignedUrl({
        action: 'read',
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes from now
      });

      this.logger.debug(`Signed URL generated successfully: ${signedUrl}`);
      return { signedUrl: signedUrl };
    } catch (error) {
      this.logger.error(`Error generating signed URL: ${error}`);
      throw error;
    }
  }

  // Function to delete a file
  async deleteFile(file: string): Promise<void> {
    this.logger.debug(`Deleting file: ${file}`);
    const bucket = this.storage.bucket(this.bucket);
    const fileRef = bucket.file(file);

    try {
      await fileRef.delete();
      this.logger.debug(`File deleted successfully: ${file}`);
    } catch (error) {
      this.logger.error(`Error deleting file: ${error}`);
      throw error;
    }
  }

  async updateFile(file: string, newFile: Express.Multer.File) {
    try {
      await this.deleteFile(file);
    } catch (error) {
      this.logger.debug(
        `Assuming File doesn't exist: ${file}, uploading new File anyway`,
      );
    }
    return await this.uploadFile(newFile);
  }
}
