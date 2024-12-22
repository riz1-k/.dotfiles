import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { BarChart, Copy, Edit, Eye, Trash2, Users } from 'lucide-react';
import { TListProduct, useCatalog } from '../-hooks/useCatalog';
import { STATUS_LABEL } from '../-utils/listing-schema';
import { Card, CardContent } from '@/components/ui/card';
import { env } from '@/lib/utils/env';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { CatalogStausLabel } from '../../listings/-utils/useListings';
import { useAxios } from '@/lib/hooks/useAxios';
import { Checkbox } from '@/components/ui/checkbox';
import {
  BulkActiveDialog,
  BulkInactiveDialog,
} from '../../listings/-components/bulk-action-dialog';

export function CatalogList() {
  const { data: catalog } = useCatalog();
  const search = useSearch({ from: '/_dashboard/dashboard/catalog/' });
  const [checked, setChecked] = React.useState<string[]>([]);
  const [bulkActive, setBulkActive] = React.useState(false);
  const [bulkInactive, setBulkInactive] = React.useState(false);

  return (
    <>
      <ul className='flex flex-col gap-y-4'>
        <div className='flex justify-end gap-2'>
          <Button
            size='sm'
            aria-hidden={search.status !== 'IN_ACTIVE'}
            onClick={() => setBulkActive(true)}
            disabled={checked.length === 0}
            className='aria-hidden:hidden px-3 text-xs h-8'
            variant='accent'
          >
            Bulk Active
          </Button>
          <Button
            size='sm'
            aria-hidden={search.status !== 'ACTIVE'}
            onClick={() => setBulkInactive(true)}
            disabled={checked.length === 0}
            className='aria-hidden:hidden px-3 text-xs h-8'
            variant='accent'
          >
            Bulk Inactive
          </Button>
        </div>
        {catalog?.listings.map((listItem) => (
          <ListingCard
            listItemData={listItem}
            key={listItem._id}
            status={search.status ?? 'ACTIVE'}
            checked={checked}
            setChecked={setChecked}
          />
        ))}
      </ul>
      <BulkActiveDialog
        itemIds={checked}
        open={bulkActive}
        setOpen={setBulkActive}
        listType={search.listType ?? 'service'}
      />
      <BulkInactiveDialog
        itemIds={checked}
        open={bulkInactive}
        setOpen={setBulkInactive}
        listType={search.listType ?? 'service'}
      />
    </>
  );
}

const cardColor: Record<
  (typeof STATUS_LABEL)[keyof typeof STATUS_LABEL],
  { text: string; background: string; titleColor: string }
> = {
  'Action Required': {
    text: 'text-destructive-foreground',
    background: 'bg-destructive',
    titleColor: 'text-destructive',
  },
  Active: {
    text: 'text-primary-foreground',
    background: 'bg-primary',
    titleColor: 'text-primary',
  },
  'In Active': {
    text: 'text-destructive-foreground',
    background: 'bg-destructive',
    titleColor: 'text-destructive',
  },
  Draft: {
    text: 'text-white',
    background: 'bg-yellow-500',
    titleColor: 'text-yellow-500',
  },
  'Under Review': {
    text: 'text-white',
    background: 'bg-blue-500',
    titleColor: 'text-blue-500',
  },
};

export function GroupedList({
  name,
  list,
}: {
  name: keyof typeof STATUS_LABEL;
  list: TListProduct[];
}) {
  const search = useSearch({ from: '/_dashboard/dashboard/listings/' });
  const [checked, setChecked] = React.useState<string[]>([]);
  const [bulkActive, setBulkActive] = React.useState(false);
  const [bulkInactive, setBulkInactive] = React.useState(false);

  return (
    <Card>
      <CardContent className='p-3 '>
        <Accordion type='single' collapsible defaultValue={name}>
          <AccordionItem value={name} className='border-none'>
            <AccordionTrigger className='py-0'>
              <div className='flex items-center justify-between'>
                <span
                  className={cn(
                    'font-bold text-lg',
                    cardColor[STATUS_LABEL[name]].titleColor
                  )}
                >
                  {CatalogStausLabel[name]}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className='pt-4'>
              <div className='flex justify-end gap-2 pb-2'>
                <Button
                  size='sm'
                  aria-hidden={name !== 'IN_ACTIVE'}
                  onClick={() => setBulkActive(true)}
                  disabled={checked.length === 0}
                  className='aria-hidden:hidden px-3 text-xs h-8'
                  variant='accent'
                >
                  Bulk Active
                </Button>
                <Button
                  size='sm'
                  aria-hidden={name !== 'ACTIVE'}
                  onClick={() => setBulkInactive(true)}
                  disabled={checked.length === 0}
                  className='aria-hidden:hidden px-3 text-xs h-8'
                  variant='accent'
                >
                  Bulk Inactive
                </Button>
              </div>
              {list?.map((item) => (
                <ListingCard
                  key={item._id}
                  listItemData={item}
                  status={name}
                  checked={checked}
                  setChecked={setChecked}
                />
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      <BulkActiveDialog
        itemIds={checked}
        open={bulkActive}
        setOpen={setBulkActive}
        listType={search.listType ?? 'service'}
      />
      <BulkInactiveDialog
        itemIds={checked}
        open={bulkInactive}
        setOpen={setBulkInactive}
        listType={search.listType ?? 'service'}
      />
    </Card>
  );
}

function ListingCard(props: {
  listItemData: TListProduct;
  status: keyof typeof STATUS_LABEL;
  checked: string[];
  setChecked: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const { listItemData, status, checked, setChecked } = props;
  const navigate = useNavigate();
  const axios = useAxios();
  return (
    <div className='w-full rounded-lg border border-border shadow-md mb-4'>
      <div
        className={cn(
          `px-4 flex items-center justify-between py-3 rounded-t-lg ${cardColor[STATUS_LABEL[status]]?.background} ${cardColor[STATUS_LABEL[status]]?.text}`
        )}
      >
        <p className='font-medium'>{listItemData.title} </p>
        <Checkbox
          aria-hidden={!(status === 'ACTIVE' || status === 'IN_ACTIVE')}
          className={cn(
            `!border-white aria-hidden:hidden data-[state=checked]:${cardColor[STATUS_LABEL[status]]?.background}`
          )}
          checked={checked.includes(listItemData._id)}
          onCheckedChange={(value) => {
            if (value) {
              setChecked([...checked, listItemData._id]);
            } else {
              setChecked(checked.filter((id) => id !== listItemData._id));
            }
          }}
        />
      </div>
      <div className='p-2 grid grid-cols-3 gap-2'>
        <a
          className={buttonVariants({
            variant: 'ghost',
            size: 'sm',
            className: 'flex items-center gap-2 px-2',
          })}
          href={env.FRONTEND_URL + `/listing/${listItemData._id}`}
        >
          <Eye className='w-4 h-4' /> View
        </a>
        <Button
          variant='ghost'
          size='sm'
          disabled={listItemData.status === 'DRAFT'}
          className='flex items-center gap-2 px-2  '
          onClick={async () => {
            const isProduct =
              window.location.pathname.includes('product-listing') ||
              window.location.search.includes('listType=product');
            const prefix = isProduct ? 'product' : 'service';
            const response = await axios.put(
              `/listing/${prefix}/clone/${listItemData._id}`
            );
            const data = response.data.data;
            console.log(data);
          }}
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
          onClick={() => {
            const pathname = window.location.pathname;
            const isProduct =
              pathname.includes('product-listing') ||
              window.location.search.includes('listType=product');
            if (isProduct) {
              if (listItemData.status === 'DRAFT') {
                return navigate({
                  to: '/dashboard/catalog/product-listing/draft/$id',
                  params: { id: listItemData._id },
                  search: {
                    step: 'main-info',
                  },
                });
              }
              return navigate({
                to: '/dashboard/catalog/product-listing/edit/$id',
                params: { id: listItemData._id },
                search: {
                  step: 'main-info',
                },
              });
            }
            if (listItemData.status === 'DRAFT') {
              return navigate({
                to: '/dashboard/catalog/service-listing/draft/$id',
                params: { id: listItemData._id },
                search: {
                  step: 'main-info',
                },
              });
            }
            return navigate({
              to: '/dashboard/catalog/service-listing/edit/$id',
              params: { id: listItemData._id },
              search: {
                step: 'main-info',
              },
            });
          }}
        >
          <Edit className='w-4 h-4' /> Edit
        </Button>
        <Button
          variant='ghost'
          size='sm'
          className='flex items-center gap-2 px-2'
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
