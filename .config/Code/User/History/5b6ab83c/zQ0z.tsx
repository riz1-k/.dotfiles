import { PageHeader } from '@/components/global/common-page-components';
import {
  createFileRoute,
  Link,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import { ListTree, Search } from 'lucide-react';
import { z } from 'zod';
import { buttonVariants } from '@/components/ui/button';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { ListingView } from './-components/listing-view';
import { LIST_STATUS, STATUS_LABEL } from '../catalog/-utils/listing-schema';
import { ListingToggle } from '@/components/global/ListingToggle';

const searchSchema = z.object({
  listType: z.enum(['product', 'service']).catch('product'),
});

export const Route = createFileRoute('/_dashboard/dashboard/listings/')({
  component: ListingOverview,
  validateSearch: searchSchema,
});

function ListingOverview() {
  return (
    <main className='w-full px-4 py-6 space-y-6'>
      <PageHeader title='Listings' icon={<ListTree className='h-6 w-6' />} />
      <ListTypeToggle />
      <ListStatusTabs />
      <ListSearch />
      <ListingView />
    </main>
  );
}

const ListTypeToggle = () => {
  const navigate = useNavigate();
  const searchParams = useSearch({ from: '/_dashboard/dashboard/listings/' });
  return (
    <div className='flex justify-center'>
      <ListingToggle
        checked={searchParams.listType === 'service'}
        onCheckedChange={(value) => {
          navigate({
            to: '/dashboard/listings',
            search: {
              ...searchParams,
              listType: value ? 'service' : 'product',
            },
          });
        }}
      />
    </div>
  );
};

const ListStatusTabs = () => {
  const searchParams = useSearch({ from: '/_dashboard/dashboard/listings/' });
  return (
    <div className='flex gap-4 items-center overflow-x-auto'>
      {LIST_STATUS.map((status) => (
        <Link
          key={status}
          to='/dashboard/catalog'
          search={{
            status: status,
            page: 1,
            limit: 10,
            listType: searchParams.listType,
          }}
          className={buttonVariants({
            variant: 'outline',
            className: 'capitalize !px-4 !rounded-full',
            size: 'sm',
          })}
        >
          {STATUS_LABEL[status].toLowerCase()}
        </Link>
      ))}
    </div>
  );
};

const ListSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const search = useSearch({ from: '/_dashboard/dashboard/listings/' });
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        navigate({
          to: '/dashboard/catalog',
          search: {
            search: searchTerm,
            page: 1,
            limit: 10,
            listType: search.listType,
          },
        });
      }}
      className='relative'
    >
      <Input
        placeholder='Search for listings or businesses'
        className='pl-10'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Search className='w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground' />
    </form>
  );
};
