import { type ClassValue, clsx } from 'clsx';
import parsePhoneNumber from 'libphonenumber-js';
import { twMerge } from 'tailwind-merge';
import { z } from 'zod';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const phoneSchema = z.preprocess(
  (v) => {
    if (v && typeof v === 'string') {
      if (v.startsWith('+')) {
        return v;
      }
      return `+${v}`;
    }
    return undefined;
  },
  z
    .string({ required_error: 'Phone number is required' })
    .min(1, 'Phone number is required')
    .max(15, 'Invalid number. Number shound be less than 15 characters.')
    .regex(
      /^\+[1-9]\d{1,14}$/,
      'Invalid number. Enter with country code (e.g., +1234567890).'
    )
    .refine(
      (v) => {
        if (!v) return true;
        try {
          const t = parsePhoneNumber(v);
          if (!t) {
            return false;
          }

          if (!t.isValid() || !t.isPossible()) {
            return false;
          }

          return true;
        } catch (e) {
          return false;
        }
      },
      {
        message: 'Invalid number. Enter with country code (e.g., +1234567890).',
      }
    )
);

export const COUNTRIES = [
  { value: 'IN', label: 'India' },
  { value: 'US', label: 'United States' },
  { value: 'SA', label: 'Saudi Arabia' },
] as const;

export default function formatFileSize(bytes: number): string {
  const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  let i = 0;
  while (bytes >= 1024 && i < units.length - 1) {
    bytes /= 1024;
    i++;
  }
  return `${bytes.toFixed(2)} ${units[i]}`;
}

export function transformPayload(
  obj: Record<string, any>
): Record<string, any> {
  for (const key in obj) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];

      if (typeof value === 'object' && value !== null) {
        if ('_id' in value && 'src' in value) {
          obj[key] = value._id;
        } else {
          transformPayload(value);
        }
      }
    }
  }
  return obj;
}

export const APP_NAMES = [
  'Botim',
  'IMO',
  'Viber',
  'Line',
  'Telegram',
  'Skype',
  'Signal',
  'Whatsapp',
  'International Whatsapp',
  'International Phone',
] as const;

export type TAPP_NAME = (typeof APP_NAMES)[number];
