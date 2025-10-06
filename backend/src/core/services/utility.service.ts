import { HttpException, HttpStatus } from '@nestjs/common';

export function generateSlug(phrase: string) {
  return phrase
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-word, non-whitespace, and non-hyphen characters
    .replace(/[\s-]+/g, '-') // Replace sequences of whitespace and hyphens with a single hyphen
    .replace(/^-+|-+$/g, ''); // Trim leading and trailing hyphens
}

export function httpErrorException(error: any) {
  throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
}

export function generateImageFileName(extension: string) {
  const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '');
  const randomNumber = Math.floor(Math.random() * 10000);
  return `${timestamp}_${randomNumber}.${extension}`;
}
