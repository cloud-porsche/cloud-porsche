import { Storage } from '@google-cloud/storage';

export class ObjectStorageService {
  storage: Storage;
  bucket: string;

  constructor() {
    this.storage = new Storage({
      projectId: process.env.FIREBASE_PROJECT_ID,
      credentials: {
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        private_key: process.env.FIREBASE_PRIVATE_KEY,
      }
    });

    this.bucket = process.env.FIREBASE_STORAGE_BUCKET;
    console.log(this.bucket);
    console.log(this.storage);
  }

  async uploadFile(file: Express.Multer.File) {
    const bucket = this.storage.bucket(this.bucket);
    console.log(file)
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
}
