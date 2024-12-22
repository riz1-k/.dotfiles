import { env } from '~/lib/config/env';
import { type TService } from '~/types/TService';

import ServiceListing from '../../_components/ServiceListing';

interface TypeParamsProps {
  params: {
    slug: string;
  };
}

export default async function Services({ params }: TypeParamsProps) {
  const { slug } = params;

  async function fetchProductListingData() {
    try {
      const res = await fetch(
        `${env.BACKEND_URL}/listing/public/service/${slug}`,
        { next: { revalidate: 60 * 10 } }
      );
      const data = await res.json();
      console.log(data);
      return data.data as TService;
    } catch (error) {
      return null;
    }
  }

  const services = await fetchProductListingData();
  const error = !services ? 'Failed to fetch service details' : null;

  return (
    <>
      {error ? (
        <div className='flex h-screen items-center justify-center text-sm font-bold'>
          {error}
        </div>
      ) : (
        <>{services && <ServiceListing services={services} slug={slug} />}</>
      )}
    </>
  );
}
