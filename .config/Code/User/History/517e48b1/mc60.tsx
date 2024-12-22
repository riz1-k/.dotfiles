import { ColumnDef } from '@tanstack/react-table';
import { formatDate } from 'date-fns';

import { DataTable } from '@/components/global/data-table';
import { TStore } from '../-utils/useStore';
import { getCountryName } from '@/lib/utils';
import { Link } from '@tanstack/react-router';

export function StoreListTable({ data }: { data: TStore[] }) {
  const columns: ColumnDef<TStore>[] = [
    {
      header: 'Store ID',
      cell: ({ row }) => {
        const value = row.original.storeID;
        return (
          <Link
            to={`/dashboard//stores/$id/business-profile`}
            params={{
              id: row.original._id,
            }}
            className='link'
          >
            {value}
          </Link>
        );
      },
    },
    {
      accessorKey: 'storeName',
      header: 'StoreName',
    },
    {
      header: 'Created At',
      cell: ({ row }) => {
        const value = row.original.createdAt;
        return formatDate(new Date(value), 'dd-MM-yyyy');
      },
    },
    {
      accessorKey: 'storeData.contactName',
      header: 'Business/Individual Name',
    },
    {
      header: 'Business/Individual Origin',
      cell: ({ row }) => {
        const value = row.original.country;
        return getCountryName(value);
      },
    },
    {
      accessorKey: 'storeData.businessPhone',
      header: 'Primary (Local) Number',
    },
    {
      accessorKey: 'storeData.businessEmail',
      header: 'Email',
    },
    {
      accessorKey: 'kycStatus',
      header: 'KYC Status',
    },
    {
      accessorKey: 'status',
      header: 'Store Status',
    },
    {
      accessorKey: '_id',
      header: 'DB ID',
    },
  ];

  return <DataTable columns={columns} data={data} />;
}
