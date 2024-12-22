import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { BarChart, Copy, Edit, Eye, Trash2, Users } from 'lucide-react';
import { useMemo } from 'react';
import { TListProduct, useCatalog } from '../-hooks/useCatalog';
import { LIST_STATUS } from '../-utils/listing-schema';

export function CatalogList() {
  const { data: catalog } = useCatalog();
  const groupedCatalog = useMemo(() => {
    type TGroupCatalog = {
      [key in (typeof LIST_STATUS)[number]]: TListProduct[];
    };
    if (!catalog) return {} as TGroupCatalog;
    return catalog?.reduce((acc, curr) => {
      const { status } = curr;
      if (!acc[status]) {
        acc[status] = [];
      }
      acc[status].push(curr);
      return acc;
    }, {} as TGroupCatalog);
  }, [catalog]);

  return (
    <ul className='flex flex-col gap-y-4'>
      {LIST_STATUS.map((status) => (
        <GroupedList key={status} name={status} list={groupedCatalog[status]} />
      ))}
    </ul>
  );
}

function GroupedList({
  name,
  list,
}: {
  name: (typeof LIST_STATUS)[number];
  list: TListProduct[];
}) {
  return (
    <ul className='flex flex-col gap-y-4'>
      {list.map((listing) => (
        <ListingCard key={listing._id} listItemData={listing} />
      ))}
    </ul>
  );
}

const cardColor: Record<(typeof LIST_STATUS)[number], string> = {
  ACTION_REQUIRED: 'bg-destructive text-destructive-foreground',
  ACTIVE: 'bg-primary text-primary-foreground',
  IN_ACTIVE: 'bg-destructive text-destructive-foreground',
  DRAFT: 'bg-yellow-500 text-white',
  UNDER_REVIEW: 'bg-blue-500 text-white',
};

function ListingCard(props: { listItemData: TListProduct }) {
  const { listItemData } = props;
  return (
    <div className='w-full bg-white rounded-lg shadow-sm mb-4'>
      <div className={cn(`p-4 rounded-t-lg`, cardColor[listItemData.status])}>
        <p className='font-medium'>
          I will fix your bathroom internal pipe issues.....
        </p>
      </div>
      <div className='p-2 grid grid-cols-3 gap-2'>
        <a
          className={buttonVariants({
            variant: 'ghost',
            size: 'sm',
            className: 'flex items-center gap-2 px-2',
          })}
        >
          <Eye className='w-4 h-4' /> View
        </a>
        <Button
          variant='ghost'
          size='sm'
          className='flex items-center gap-2 px-2  '
        >
          <Copy className='w-4 h-4' /> Clone
        </Button>
        <Button
          variant='ghost'
          size='sm'
          className='flex items-center gap-2 px-2  '
        >
          <Users className='w-4 h-4' /> All Leads
        </Button>
        <Button
          variant='ghost'
          size='sm'
          className='flex items-center gap-2 px-2  '
        >
          <Edit className='w-4 h-4' /> Edit
        </Button>
        <Button
          variant='ghost'
          size='sm'
          className='flex items-center gap-2 px-2  '
        >
          <Trash2 className='w-4 h-4' /> Delete
        </Button>
        <Button
          variant='ghost'
          size='sm'
          className='flex items-center gap-2 px-2  '
        >
          <BarChart className='w-4 h-4 rounded-full' /> Analytics
        </Button>
      </div>
    </div>
  );
}
