import { Injectable } from '@nestjs/common';
import { v2 } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor() {
    v2.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadImage(filePath: string) {
    return new Promise((resolve, reject) => {
      v2.uploader.upload(filePath, { folder: 'lesson' }, (error, result) => {
        if (error) reject(error);
        resolve(result);
      });
    });
  }
}
