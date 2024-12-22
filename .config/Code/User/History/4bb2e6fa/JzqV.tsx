import { Badge } from '@/components/ui/badge';
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
import { ArrowDown } from 'lucide-react';
import { useMemo, useState } from 'react';
import { formatDate } from 'date-fns';
import { Pagination } from '@/components/global/pagination';
import {
  DowngradedBillingDialog,
  NewBillingDialog,
  RefundDialog,
  UpgradedBillingDialog,
} from './subscription-details-dialogs';
import {
  TBillingSubscriptionData,
  TSubscriptionHistory,
  useBillingSubscription,
} from '../-utils/useStoreSubscriptions';
import { EmptyView } from '@/components/global/empty-view';
import { TableSkeleton } from '@/components/global/table-skeleton';

export type TBillingTableData = Omit<
  TBillingSubscriptionData['subscriptions'][number],
  'subscriptionHistory'
> & {
  subscriptionHistory: TSubscriptionHistory & {
    rowType: 'subscription' | 'refund';
  };
};

export function BusinessSubscriptionList() {
  const { data: billingData, isLoading, isError } = useBillingSubscription();
  const [sorting, setSorting] = useState<SortingState>([]);

  const billingHistory = billingData?.subscriptions ?? [];

  const columns: ColumnDef<TBillingTableData>[] = [
    {
      accessorKey: 'invoiceNumber',
      header: 'Subscription ID',
      cell: ({ row }) => {
        return row.original.subscriptionID;
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Billing Date',
      cell: ({ row }) => {
        if (row.original.subscriptionHistory.rowType === 'refund') {
          return formatDate(
            row.original.subscriptionHistory.refundDetails?.refundDate ?? '',
            'MMMM d, yyyy'
          );
        }
        return formatDate(row.original.createdAt, 'MMMM d, yyyy');
      },
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => {
        if (row.original.subscriptionHistory.rowType === 'refund') {
          return `${row.original.subscriptionDetails.currency} ${row.original.subscriptionHistory.refundDetails?.refundAmount.toFixed(2)}`;
        }
        return `${row.original.subscriptionDetails.currency} ${row.original.subscriptionHistory.paymentDetails.paidAmount.toFixed(2)}`;
      },
    },
    {
      header: 'Purpose',
      cell: ({ row }) => {
        const downgradeDiscount = row.original.downgradeDiscount;
        if (row.original.subscriptionHistory.rowType === 'refund') {
          return (
            <Badge className='w-24 py-1 justify-center text-xs font-light !bg-success text-success-foreground'>
              Refund
            </Badge>
          );
        }
        if (downgradeDiscount > 0) {
          return (
            <Badge
              className='w-24 py-1 justify-center text-xs font-light'
              variant='destructive'
            >
              Downgrade
            </Badge>
          );
        }
        if (row.original.subscriptionHistory.subscriptionDetails.price === 0) {
          return (
            <Badge
              className='w-24 py-1 justify-center text-xs font-light'
              variant='secondary'
            >
              Free
            </Badge>
          );
        }
        if (
          row.original.subscriptionHistory.subscriptionDetails.price ===
          row.original.subscriptionHistory.paymentDetails.paidAmount
        ) {
          return (
            <Badge
              className='w-24 py-1 justify-center text-xs font-light'
              variant='default'
            >
              New
            </Badge>
          );
        }
        return (
          <Badge
            className='w-24 py-1 justify-center text-xs font-light'
            variant='secondary'
          >
            Upgrade
          </Badge>
        );
      },
    },
    {
      header: 'Actions',
      cell: ({ row }) => {
        const downgradeDiscount = row.original.downgradeDiscount;
        const isRefund = row.original.subscriptionHistory.rowType === 'refund';

        const mainBillingData = billingHistory.find(
          (billing) => billing.subscriptionID === row.original.subscriptionID
        )!;

        if (isRefund) {
          return (
            <RefundDialog
              billingData={row.original}
              mainBillingData={mainBillingData}
            />
          );
        }

        if (downgradeDiscount > 0) {
          return <DowngradedBillingDialog billingData={row.original} />;
        }
        if (row.original.subscriptionHistory.subscriptionDetails.price === 0) {
          return 'Free';
        }
        if (
          row.original.subscriptionHistory.subscriptionDetails.price ===
          row.original.subscriptionHistory.paymentDetails.paidAmount
        ) {
          return <NewBillingDialog billingData={row.original} />;
        }
        return <UpgradedBillingDialog billingData={row.original} />;
      },
    },
  ];

  const tableData = useMemo(() => {
    if (!billingHistory.length) return [];
    let data: TBillingTableData[] = [];
    for (let i = 0; i < billingHistory.length; i++) {
      // Add subscription history records
      for (let j = 0; j < billingHistory[i].subscriptionHistory.length; j++) {
        data.push({
          ...billingHistory[i],
          subscriptionHistory: {
            ...billingHistory[i].subscriptionHistory[j],
            rowType: 'subscription',
          },
        });
      }

      // Add current subscription record
      data.push({
        ...billingHistory[i],
        subscriptionHistory: {
          subscriptionDetails: billingHistory[i].subscriptionDetails,
          paymentDetails: billingHistory[i].paymentDetails,
          refundDetails: billingHistory[i].refundDetails,
          endDate: new Date(),
          rowType: 'subscription',
        },
      });

      // Calculate total refund amount from all sources
      let totalRefundAmount = 0;
      if (billingHistory[i].refundDetails) {
        totalRefundAmount += billingHistory[i].refundDetails?.refundAmount || 0;
      }
      // Add refund amounts from subscription history
      for (let j = 0; j < billingHistory[i].subscriptionHistory.length; j++) {
        if (billingHistory[i].subscriptionHistory[j].refundDetails) {
          totalRefundAmount +=
            billingHistory[i].subscriptionHistory[j].refundDetails
              ?.refundAmount || 0;
        }
      }

      // Only add a refund record if there are any refunds
      if (totalRefundAmount > 0) {
        data.push({
          ...billingHistory[i],
          subscriptionHistory: {
            subscriptionDetails: billingHistory[i].subscriptionDetails,
            paymentDetails: billingHistory[i].paymentDetails,
            //@ts-expect-error for later
            refundDetails: {
              ...(billingHistory[i].refundDetails || {}),
              refundAmount: totalRefundAmount,
            },
            endDate: new Date(),
            rowType: 'refund',
          },
        });
      }
    }
    return data.reverse();
  }, [billingHistory]);

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  if (isLoading) return <TableSkeleton rows={10} columns={5} showHeader />;

  if (isError || !billingData)
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
      <Pagination total={billingData.total} />
    </section>
  );
}
