import axios from 'axios';
import React from 'react';

import { env } from '~/lib/config/env';
import {
  type TProductCategory,
  type TServiceCategory,
} from '~/types/TCategory';

import Category from './_components/Category';

export default async function Page() {
  let serviceData: TServiceCategory | null = null;
  let productData: TProductCategory | null = null;
  let error: string | null = null;

  try {
    const serviceResponse = axios.get(
      `${env.BACKEND_URL}/category?categoryType=BServiceListing`
    );

    const productResponse = axios.get(
      `${env.BACKEND_URL}/category?categoryType=BProductListing`
    );

    const [serviceRes, productRes] = await Promise.all([
      serviceResponse,
      productResponse,
    ]);
    serviceData = serviceRes.data.data as TServiceCategory;
    productData = productRes.data.data as TProductCategory;
  } catch (err: any) {
    error = 'Failed to load categories. Please try again later.';
  }

  return (
    <div>
      {error ? (
        <div className='flex h-screen items-center justify-center text-sm font-bold'>
          <p>{error}</p>
        </div>
      ) : (
        <>
          {serviceData && productData && (
            <Category serviceData={serviceData} productData={productData} />
          )}
        </>
      )}
    </div>
  );
}
