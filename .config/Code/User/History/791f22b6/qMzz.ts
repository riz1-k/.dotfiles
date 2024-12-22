import { z } from 'zod';
import { zodnonEmptyString } from '../utils';

export const FILE_TYPE = [
  'application/pdf',
  'image/jpg',
  'image/png',
  'image/jpeg',
  'image/webp',
] as const;

export const BUSINESS_FILES = [
  'CATEGORY',
  'STORE_ASSETS',
  'MAIN_LISTING',
  'CATALOG_MEDIA',
] as const;

export const fileValidator = z.object(
  {
    _id: z.string().length(24, 'File is required'),
    src: z.string(),
    fileType: z.enum(FILE_TYPE, {
      errorMap: () => ({
        message: `Only the following file types are supported: ${FILE_TYPE.join(
          ', '
        )}`,
      }),
    }),
    purpose: z.enum(BUSINESS_FILES, {
      errorMap: () => ({
        message: `Only the following file types are supported: ${BUSINESS_FILES.join(
          ', '
        )}`,
      }),
    }),
    meta: z.object({
      fileName: zodnonEmptyString,
      fileSize: z.coerce.number(),
    }),
    // createdAt: z.coerce.date(),
  },
  {
    message: 'File is required',
  }
);

export type TFile = z.infer<typeof fileValidator>;
