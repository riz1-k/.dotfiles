import { PageHeader } from '@/components/global/common-page-components';
import { buttonVariants } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  createFileRoute,
  Link,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import { ListTree } from 'lucide-react';
import { z } from 'zod';
import { CatalogList } from './-components/catalog-list';

const LIST_STATUS = [
  'DRAFT',
  'ACTIVE',
  'IN_ACTIVE',
  'ACTION_REQUIRED',
  'UNDER_REVIEW',
] as const;

export const LIST_STATUS_WITH_LABEL = [
  {
    value: 'DRAFT',
    label: 'Draft',
  },
  {
    value: 'ACTIVE',
    label: 'Active',
  },
  {
    value: 'IN_ACTIVE',
    label: 'Inactive',
  },
  {
    value: 'ACTION_REQUIRED',
    label: 'Action Required',
  },
  {
    value: 'UNDER_REVIEW',
    label: 'Under Review',
  },
] as const;

const searchSchema = z.object({
  page: z.coerce.number().min(1).int().default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  category: z.string().optional(),
  subCategory: z.string().optional(),
  status: z.enum(LIST_STATUS).optional(),
  store: z.string().length(24).optional(),
  sort: z
    .tuple([
      z.enum(['title', 'createdAt', 'updatedAt']),
      z.enum(['asc', 'desc']),
    ])
    .default(['createdAt', 'desc']),
  listType: z.enum(['service', 'product']).default('service').optional(),
});

export const Route = createFileRoute('/dashboard/catalog/')({
  component: CatalogPage,
  validateSearch: searchSchema,
});

function CatalogPage() {
  return (
    <main className='w-full px-4 py-6 space-y-6'>
      <PageHeader title='Listings' icon={<ListTree className='h-6 w-6' />} />
      <ListTypeToggle />
      <ListStatusTabs />
      <CatalogList />
    </main>
  );
}

const ListTypeToggle = () => {
  const navigate = useNavigate();
  const searchParams = useSearch({ from: '/dashboard/catalog/' });
  return (
    <div className='flex justify-center'>
      <div className='flex items-center gap-4'>
        <span className='font-semibold'>Service</span>
        <Switch
          className='data-[state=checked]:bg-accent'
          checked={searchParams.listType === 'product'}
          onCheckedChange={(checked) => {
            navigate({
              to: '/dashboard/catalog',
              search: {
                ...searchParams,
                listType: checked ? 'product' : 'service',
              },
            });
          }}
        />
        <span className='font-semibold'>Product</span>
      </div>
    </div>
  );
};

const ListStatusTabs = () => {
  const searchParams = useSearch({ from: '/dashboard/catalog/' });
  return (
    <div className='flex gap-4 items-center overflow-x-auto'>
      {LIST_STATUS_WITH_LABEL.map((status) => (
        <Link
          key={status.value}
          to='/dashboard/catalog'
          search={{
            ...searchParams,
            status: status.value,
          }}
          className={buttonVariants({
            variant:
              searchParams.status === status.value ? 'default' : 'outline',
            className: 'capitalize !px-4 !rounded-full',
            size: 'sm',
          })}
        >
          {status.label.replace('_', ' ').toLowerCase()}
        </Link>
      ))}
    </div>
  );
};
