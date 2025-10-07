import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export const multerOptions: MulterOptions = {
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
};
