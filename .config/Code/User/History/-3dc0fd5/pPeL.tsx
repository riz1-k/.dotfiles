import { buttonVariants } from '@/components/ui/button';
import {
  Credenza,
  CredenzaClose,
  CredenzaContent,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
} from '@/components/ui/credenza';
import { Separator } from '@/components/ui/separator';
import { useAxios } from '@/lib/hooks/useAxios';
import { useSellerSubscription, useSession } from '@/lib/hooks/useSession';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate, useSearch } from '@tanstack/react-router';
import { formatDate } from 'date-fns';
import { useMemo } from 'react';
import {
  TSubscriptionPlan,
  useSubscription,
} from '../../subscriptions/-utils/useSubscription';
import { PriceRow } from './downgrade-plan-dialog';

export default function UpgradePlanDialog() {
  const searchParams = useSearch({
    from: '/_dashboard/dashboard/my-subscription/',
  });
  const activeSub = useSellerSubscription();
  const subList = useSubscription();
  const planId = searchParams.selectedPlanId;
  const planType = searchParams.planType;
  const axios = useAxios();
  const session = useSession();
  const navigate = useNavigate();
  const storeId = session.currentStore?._id;

  const { data: planData, isLoading } = useQuery({
    queryKey: ['plan', planId],
    queryFn: async () => {
      if (!storeId || !planId)
        throw new Error('Store ID or Plan ID is missing');
      const response = await axios.get<
        TResponse<{
          newEndDate: string;
          upgradeCost: number;
          currentBalanceOldSub: number;
          upgradePlanCharges: number;
          subscriptionDetails: TSubscriptionPlan;
        }>
      >('/subscription/utils/upgrade-check', {
        params: { storeId, subscriptionId: planId },
      });
      return response.data.data;
    },
    enabled: !!(planId && storeId && planType === 'upgrade'),
  });

  const activeSubData = useMemo(() => {
    if (!subList || !activeSub.data?.activeSubscription) return null;
    return subList.data?.find(
      (sub) =>
        sub._id ===
        activeSub.data?.activeSubscription?.subscriptionDetails.subscription
    );
  }, [subList, activeSub.data?.activeSubscription]);

  if (isLoading) return null;

  if (!planData) return null;

  return (
    <Credenza
      open={!!planId && planType === 'upgrade'}
      onOpenChange={(open) => {
        navigate({
          to: '/dashboard/my-subscription',
          search: {
            frequency: 'MONTHLY',
            selectedPlanId: open ? planId : undefined,
          },
        });
      }}
    >
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle className='capitalize'>
            Upgrade to {planData.subscriptionDetails.name} Plan
          </CredenzaTitle>
        </CredenzaHeader>
        <div className='py-4 flex flex-col gap-6'>
          <PriceRow
            title='New Plan Charges'
            description={`(${planData.subscriptionDetails.name} ${planData.subscriptionDetails.frequency})`}
            subtitle={`from current date to ${formatDate(new Date(planData.newEndDate), 'dd MMM yyyy')}`}
            amount={
              planData.subscriptionDetails.currency +
              ' ' +
              planData.upgradePlanCharges.toFixed(2)
            }
          />
          <PriceRow
            title='Current Plan Balance'
            description={`(${activeSubData?.name} ${activeSubData?.frequency})`}
            subtitle={`usages from ${formatDate(new Date(activeSub.data?.activeSubscription?.createdAt ?? ''), 'dd MMM yyyy')} to till current date`}
            amount={`${planData.subscriptionDetails.currency} ${planData.currentBalanceOldSub.toFixed(2)}`}
            amountClassName='text-destructive'
            prefix='-'
          />
          <Separator className='-my-3' />
          <PriceRow
            title='Net Payable'
            amountClassName='font-bold'
            description='Upgrade Cost'
            amount={
              planData.subscriptionDetails.currency +
              ' ' +
              planData.upgradeCost.toFixed(2)
            }
          />
        </div>
        <CredenzaFooter className='px-0'>
          <Link
            to='/dashboard/my-subscription/upgrade/$id'
            params={{
              id: planId ?? '',
            }}
            search={{
              returnUrl:
                window.location.origin + '/dashboard/subscriptions/return',
            }}
            className={buttonVariants({
              variant: 'default',
              className: 'w-full',
            })}
          >
            Upgrade Plan
          </Link>
          <CredenzaClose
            className={cn(buttonVariants({ variant: 'destructive' }))}
          >
            Cancel
          </CredenzaClose>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
}
