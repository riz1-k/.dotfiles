import { isAxiosError } from 'axios';
import { type ClassValue, clsx } from 'clsx';
import parsePhoneNumber from 'libphonenumber-js';
import { FieldErrors } from 'react-hook-form';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';
import { AnyZodObject, z, ZodError } from 'zod';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getErrorMessage(err: unknown) {
  let message: string = '';

  if (isAxiosError(err)) {
    message = err.response?.data?.error?.message || err?.message;
  } else if (err instanceof ZodError) {
    message = err.issues[0].message;
  } else if (err instanceof Error) {
    message = err.message;
  } else if (typeof err === 'string') {
    message = err;
  } else if (err && typeof err === 'object' && 'message' in err) {
    message = String(err.message);
  }
  return message;
}

export function getNumber(value: string | number): string | null {
  if (typeof value === 'string') {
    if (value === '') return '';
    const parsed = Number(value);
    if (isNaN(parsed)) {
      return null;
    }
    return parsed.toString();
  }
  return value.toString();
}
export const zodnonEmptyString = z.coerce.string().trim().min(1);

export function devLogger(log: unknown) {
  // if (env.ENVIRONMENT !== 'dev') return;
  // eslint-disable-next-line no-console
  console.log('=======');
  // eslint-disable-next-line no-console
  console.log(log);
}

export function getFormErrorMessage(err: FieldErrors<AnyZodObject>) {
  const firstErrorKey = Object.keys(err)[0] as keyof typeof err;
  const message = err[firstErrorKey]?.message;
  return `Error in ${firstErrorKey}: ${message}`;
}

export function toYtEmbedLink(link: string) {
  if (!link.includes('watch?v=')) {
    return `https://www.youtube.com/embed/${
      link.split('/')[link.split('/').length - 1]
    }`;
  }
  return `https://www.youtube.com/embed/${link.split('watch?v=')[1]}`;
}

export function normaliseString(str: string, seperator = '-', join = '') {
  return str
    .replaceAll(seperator, ' ')
    .split(' ')
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1).toLowerCase())
    .join(join);
}

export function dateTimeFormater(date: Date) {
  // check if its a valid data
  if (isNaN(date.getTime())) return '';
  const date2 = new Date(date).toISOString();
  return `${date2.split('T')[0]}T${date2.split('T')[1].slice(0, 5)}`;
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

export const isMobile = window.isMobile;
export const safeInsetBottom = Number(window.safeInsetBottom ?? 0);
export function sendMessageToNative(payload: unknown) {
  if (window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(JSON.stringify(payload));
  }
}

export function capitalizer(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function handleFormError(err: Record<string, unknown>) {
  console.log(err);
  if (typeof window === 'undefined') {
    throw new Error('This function can only be used in the browser');
  }

  // Function to find the first message in nested objects and arrays
  function findFirstMessage(value: unknown): string | undefined {
    // Handle arrays
    if (Array.isArray(value)) {
      for (const item of value) {
        const message = findFirstMessage(item);
        if (message) return message;
      }
    }
    // Handle objects
    else if (value && typeof value === 'object') {
      const obj = value as Record<string, unknown>;
      for (const [key, val] of Object.entries(obj)) {
        if (key === 'message' && typeof val === 'string') {
          return val;
        }
        const nestedMessage = findFirstMessage(val);
        if (nestedMessage) return nestedMessage;
      }
    }
    return undefined;
  }

  // Scroll to the first error field
  const firstErrorKey = Object.keys(err)[0];
  document
    .getElementById(firstErrorKey)
    ?.scrollIntoView({ behavior: 'smooth' });

  // Handle different types of error values
  if (err instanceof ZodError) {
    toast.error(`${capitalizer(firstErrorKey)} - ${err.errors[0].message}`);
    return;
  }

  const errorValue = err[firstErrorKey];

  if (typeof errorValue === 'string') {
    toast.error(errorValue);
  } else if (Array.isArray(errorValue) && typeof errorValue[0] === 'string') {
    toast.error(errorValue[0]);
  } else {
    const message = findFirstMessage(err);
    toast.error(message || 'Please fill in the required fields correctly.');
  }
}

export function transformPayload(
  obj: Record<string, any>
): Record<string, any> {
  for (const key in obj) {
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

export function getCountryName(countryCode: string) {
  const country = COUNTRIES.find((x) => x.value === countryCode);
  return country?.label!;
}

export const COUNTRIES = [
  { value: 'IN', label: 'India' },
  { value: 'US', label: 'United States' },
  { value: 'SA', label: 'Saudi Arabia' },
] as const;
