import { ColumnDef } from '@tanstack/react-table';
import { Eye, MoreHorizontal, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TListProduct } from '../-utils/useListings';
import { DataTable } from '@/components/global/data-table';
import { listingsSearchSchema, TLISTING_STATUS } from '../-utils/constants';
import { useNavigate } from '@tanstack/react-router';
import { z } from 'zod';

export function ListingTable({
  data,
  search,
}: {
  data: TListProduct[];
  search: z.infer<typeof listingsSearchSchema>;
}) {
  const navigate = useNavigate();
  const columns: ColumnDef<TListProduct>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
    },
    {
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        return STATUS_LABEL[status];
      },
    },
    {
      accessorKey: 'visibility',
      header: 'Visibility',
    },
    {
      accessorKey: 'category.title',
      header: 'Category',
    },
    {
      accessorKey: 'subCategory.title',
      header: 'Subcategory',
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-8 w-8 p-0'>
                <span className='sr-only'>Open menu</span>
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem className='cursor-pointer'>
                <Eye className='h-4 w-4 mr-2' />
                View Listing
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  navigate({
                    to: `/dashboard/listings/edit/${search.listType}/$id`,
                    search: {
                      step: 'main-info',
                      isEdit: false,
                    },
                    params: { id: row.original._id },
                  });
                }}
                className='cursor-pointer'
              >
                <Pencil className='h-4 w-4 mr-2' />
                Edit Listing
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return <DataTable columns={columns} data={data} />;
}

export const STATUS_LABEL: Record<TLISTING_STATUS, string> = {
  DRAFT: 'Draft',
  ACTIVE: 'Active',
  IN_ACTIVE: 'In Active',
  ACTION_REQUIRED: 'Action Required',
  UNDER_REVIEW: 'Under Review',
};
