import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowDown, Download } from 'lucide-react';
import { useState } from 'react';
import { useBillingTrustSeal } from '../-utils/useStoreSubscriptions';
import { formatDate } from 'date-fns';
import { EmptyView } from '@/components/global/empty-view';
import { Pagination } from '@/components/global/pagination';
import { TableSkeleton } from '@/components/global/table-skeleton';

export function SealSubscriptionList() {
  const { data: trustSealData, isLoading, isError } = useBillingTrustSeal();
  const [sorting, setSorting] = useState<SortingState>([]);

  // Transform trust seal data into table rows
  const billingHistory =
    trustSealData?.subscriptions.map((seal) => ({
      invoiceNumber: seal.subscriptionID,
      billingDate: seal.startDate || 'N/A',
      amount: seal.paymentDetails.paidAmount,
      sealId: seal._id,
      currency: seal.subscriptionDetails.currency,
    })) ?? [];

  type TrustSealRow = (typeof billingHistory)[number];

  const columns: ColumnDef<TrustSealRow>[] = [
    {
      accessorKey: 'invoiceNumber',
      header: 'Invoice',
      cell: ({ row }) => {
        return row.original.invoiceNumber.slice(4);
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Billing Date',
      cell: ({ row }) => {
        return formatDate(row.original.billingDate, 'MMMM d, yyyy');
      },
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => {
        return `${row.original.currency} ${row.original.amount}`;
      },
    },
    {
      id: 'actions',
      cell: () => {
        return (
          <Button variant='ghost' size='icon' className='h-8 w-8'>
            <Download className='h-4 w-4' />
          </Button>
        );
      },
    },
  ];

  const table = useReactTable({
    data: billingHistory,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  if (isLoading) return <TableSkeleton rows={10} columns={5} showHeader />;

  if (isError || !trustSealData)
    return (
      <EmptyView
        icon='no-files'
        title='No data found'
        description='No billing data found'
      />
    );

  return (
    <section className='space-y-5'>
      <Card>
        <CardContent className='p-4'>
          <div>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead
                          key={header.id}
                          className='text-sm font-medium cursor-pointer'
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                          {header.column.getIsSorted() && (
                            <ArrowDown className='ml-1 h-4 w-4 inline' />
                          )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className='py-3 whitespace-nowrap'
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className='h-24 text-center'
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <Pagination total={trustSealData.total} />
    </section>
  );
}
