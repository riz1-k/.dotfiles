import { fileValidator } from '@/lib/utils/file-utils';
import { z } from 'zod';
import {
  COUNTRIES,
  createProductSchema,
  productListingUpdateSchema,
} from '../../-utils/products-listing.schema';

const createServiceSchemaMain = createProductSchema
  .pick({
    title: true,
    listingType: true,
    visibility: true,
    category: true,
    subCategory: true,
  })
  .extend({
    myLocations: z
      .array(
        z.object({
          country: z
            .enum(COUNTRIES, { message: 'Invalid country selected' })
            .optional(),
          locations: z
            .array(
              z.object({
                state: z
                  .string({
                    errorMap: () => ({ message: 'State is required' }),
                  })
                  .min(1, { message: 'State is required' }),
                cities: z
                  .array(z.string())
                  .min(1, { message: 'At least one city is required' }),
              })
            )
            .min(1, { message: 'At least one location must be selected' }),
        })
      )
      .min(1, { message: 'Select at least one location' })
      .nullable()
      .default(null),
    customerLocations: z
      .array(
        z.object({
          country: z
            .enum(COUNTRIES, { message: 'Invalid country selected' })
            .optional(),
          locations: z
            .array(
              z.object({
                state: z
                  .string({
                    errorMap: () => ({ message: 'State is required' }),
                  })
                  .min(1, { message: 'State is required' }),
                cities: z
                  .array(z.string())
                  .min(1, { message: 'At least one city is required' }),
              })
            )
            .min(1, { message: 'At least one location must be selected' }),
        })
      )
      .min(1, { message: 'Select at least one location' })
      .optional(),
    online: z
      .array(z.enum(COUNTRIES))
      .min(1, { message: 'Select at least one country for online service' })
      .optional(),
  });

export const serviceListingAdditionalSchema = createServiceSchemaMain
  .and(
    productListingUpdateSchema.pick({
      _id: true,
      images: true,
      description: true,
      highlights: true,
      speciality: true,
      paymentMethods: true,
      pricingType: true,
      price: true,
    })
  )
  .superRefine((data, ctx) => {
    if (
      data.customerLocations?.length === 0 &&
      data.myLocations?.length === 0 &&
      data.online?.length === 0
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        fatal: true,
        message: 'At least one service location is required',
        path: ['customerLocations', 'myLocations', 'online'],
      });
    }
  });

export const serviceListingFeaturedSchema = serviceListingAdditionalSchema
  .and(
    z.object({
      featuredProjects: z.array(
        z.object({
          projectName: z
            .string()
            .min(3, 'Must be atleast 3 characters')
            .max(100, 'Must be atmost 100 characters'),
          projectMedia: z
            .array(fileValidator)
            .min(1, 'Please upload atleast 1 image')
            .max(5, 'You can upload a maximum of 5 images'),
        })
      ),
    })
  )
  .and(productListingUpdateSchema.pick({ catalog: true, faqs: true }));

export type TCreateServiceSchema = z.infer<typeof createServiceSchemaMain>;
export type TServiceAdditionalSchemaSchema = z.infer<
  typeof serviceListingAdditionalSchema
>;
export type TServiceFeaturedSchema = z.infer<
  typeof serviceListingFeaturedSchema
>;

export const createServiceSchema = createServiceSchemaMain.superRefine(
  (data, ctx) => {
    if (
      (data.customerLocations ?? []).length === 0 &&
      (data.myLocations ?? []).length === 0 &&
      (data.online ?? []).length === 0
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        fatal: true,
        message: 'At least one service location is required',
        path: ['customerLocations', 'myLocations', 'online'],
      });
    }
  }
);
