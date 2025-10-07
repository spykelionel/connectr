import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export const multerOptions: MulterOptions = {
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB file size limit
    files: 10, // Maximum 10 files per request
    fieldSize: 10 * 1024 * 1024, // 10MB field size limit
  },
};
