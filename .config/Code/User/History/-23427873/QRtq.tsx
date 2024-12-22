import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSellerSubscription } from '@/lib/hooks/useSession';
import {
  createFileRoute,
  Link,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import { useMemo } from 'react';
import { z } from 'zod';
import {
  TSubscriptionPlan,
  useSubscription,
} from '../subscriptions/-utils/useSubscription';
import DowngradePlanDialog from './-components/downgrade-plan-dialog';
import UpgradePlanDialog from './-components/upgrade-plan.dialog';
import { CancelPlanDialog } from './-components/cancel-plan.dialog';
import {
  Credenza,
  CredenzaContent,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaTrigger,
} from '@/components/ui/credenza';
import { Button } from '@/components/ui/button';

const searchParamsSchema = z.object({
  frequency: z.enum(['MONTHLY', 'SEMI-ANNUAL', 'YEARLY']).default('MONTHLY'),
  selectedPlanId: z.string().optional(),
  planType: z.enum(['upgrade', 'downgrade']).optional(),
});

export const Route = createFileRoute('/_dashboard/dashboard/my-subscription/')({
  validateSearch: searchParamsSchema,
  component: PricingSection,
});

function PricingSection() {
  const { frequency, planType, selectedPlanId } = useSearch({
    from: '/_dashboard/dashboard/my-subscription/',
  });
  const navigate = useNavigate();
  const search = useSearch({ from: '/_dashboard/dashboard/my-subscription/' });
  const { data: pricingData, isLoading } = useSubscription();
  const { data: currentSubscription } = useSellerSubscription();

  const faqs = useMemo(() => {
    if (!pricingData) return [];
    return pricingData[0].faq;
  }, [pricingData]);

  // Group plans by frequency
  const plansByFrequency = useMemo(() => {
    if (!pricingData) return {} as Record<string, TSubscriptionPlan[]>;
    return pricingData.reduce(
      (acc, plan) => {
        if (!acc[plan.frequency]) {
          acc[plan.frequency] = [];
        }
        acc[plan.frequency].push(plan);
        return acc;
      },
      {} as Record<string, TSubscriptionPlan[]>
    );
  }, [pricingData]);

  if (isLoading) return <div>Loading...</div>;

  if (!pricingData) return <div>No data</div>;

  // Get current plans based on selected frequency
  const currentPlans = plansByFrequency[frequency ?? 'MONTHLY'] || [];

  function isCurrentPlan(plan: TSubscriptionPlan) {
    return (
      plan._id ===
      currentSubscription?.activeSubscription?.subscriptionDetails.subscription
    );
  }

  function comparePlans(newPlan: TSubscriptionPlan) {
    const activeSubscription = currentSubscription?.activeSubscription;
    if (!activeSubscription) return 'same';
    const currentPlan = pricingData?.find(
      (x) => x._id === activeSubscription.subscriptionDetails.subscription
    );
    if (!currentPlan) return 'same';

    if (
      currentPlan.price === newPlan.price &&
      currentPlan.frequency === newPlan.frequency
    )
      return 'same';

    if (
      currentPlan.price < newPlan.price &&
      currentPlan.frequency <= newPlan.frequency
    )
      return 'upgrade';

    return 'downgrade';
  }

  return (
    <div className='w-full px-4 py-8 space-y-6 '>
      {/* Header Section */}
      <div className='gap-2 flex flex-col items-center '>
        <div className='flex gap-3 items-center'>
          <svg
            className='w-8 h-8 text-accent'
            viewBox='0 0 24 24'
            fill='currentColor'
          >
            <path d='M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z' />
          </svg>
          <h1 className='text-3xl font-bold'>My Subscription</h1>
        </div>
      </div>

      <Tabs
        value={frequency}
        className='w-full'
        onValueChange={(value) =>
          navigate({
            from: '/dashboard/my-subscription',
            search: {
              frequency: value as any,
            },
            replace: true,
            resetScroll: false,
          })
        }
      >
        <TabsList className='grid w-full max-w-md mx-auto grid-cols-3'>
          <TabsTrigger value='MONTHLY'>Monthly</TabsTrigger>
          <TabsTrigger value='SEMI-ANNUAL'>6 MONTHS</TabsTrigger>
          <TabsTrigger value='YEARLY'>YEARLY</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Pricing Cards */}
      <div className='grid md:grid-cols-3 gap-8 mb-16'>
        {currentPlans.map((plan) => (
          <Card
            key={plan._id}
            className={`relative ${isCurrentPlan(plan) ? 'border-2 border-accent' : 'border-2'} shadow-md`}
          >
            {isCurrentPlan(plan) && (
              <div className='absolute -top-3 left-1/2 transform -translate-x-1/2'>
                <span className='bg-accent text-white px-4 py-1 rounded-full text-sm'>
                  Active
                </span>
              </div>
            )}
            <CardContent className='p-6'>
              <h3 className='text-xl font-bold mb-2'>{plan.name}</h3>
              <div className='mb-4'>
                <span className='text-3xl font-bold'>
                  {plan.price === 0
                    ? 'Free'
                    : `₹${plan.price.toLocaleString()}`}
                </span>
                {plan.price > 0 && (
                  <span className='text-gray-500'>
                    /{frequency?.toLowerCase()}
                  </span>
                )}
              </div>
              <ul className='mb-6 space-y-2'>
                {plan.topFeatures.map((feature, index) => (
                  <li key={index} className='text-gray-600'>
                    {feature}
                  </li>
                ))}
              </ul>
              <div
                aria-hidden={comparePlans(plan) === 'same'}
                className='space-y-2 aria-hidden:hidden'
              >
                <Link
                  to='/dashboard/my-subscription'
                  search={{
                    ...search,
                    selectedPlanId: plan._id,
                    planType:
                      comparePlans(plan) === 'upgrade'
                        ? 'upgrade'
                        : 'downgrade',
                  }}
                  className={buttonVariants({
                    className: 'w-full',
                    variant:
                      comparePlans(plan) === 'downgrade'
                        ? 'outline'
                        : 'default',
                  })}
                >
                  {comparePlans(plan) === 'upgrade' && (
                    <span>Upgrade to {plan.name}</span>
                  )}
                  {comparePlans(plan) === 'downgrade' && (
                    <span>Select Plan</span>
                  )}
                </Link>
              </div>
              {isCurrentPlan(plan) && (
                <Credenza>
                  <CredenzaTrigger asChild>
                    <Button variant='outline' className='w-full mt-4'>
                      View Plan
                    </Button>
                  </CredenzaTrigger>
                  <CredenzaContent>
                    <CredenzaHeader>
                      <CredenzaTitle>{plan.name} Plan Details</CredenzaTitle>
                      <CredenzaDescription>
                        Your current active subscription plan
                      </CredenzaDescription>
                    </CredenzaHeader>
                    <div className='py-4'>
                      <div className='mb-4'>
                        <span className='text-2xl font-bold'>
                          {plan.price === 0
                            ? 'Free'
                            : `₹${plan.price.toLocaleString()}`}
                        </span>
                        {plan.price > 0 && (
                          <span className='text-gray-500'>
                            /{frequency?.toLowerCase()}
                          </span>
                        )}
                      </div>
                      <div className='space-y-2'>
                        {plan.topFeatures.map((feature, index) => (
                          <div key={index} className='flex items-center gap-2'>
                            <svg
                              className='w-4 h-4 text-green-500'
                              viewBox='0 0 24 24'
                              fill='none'
                              stroke='currentColor'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M5 13l4 4L19 7'
                              />
                            </svg>
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <CredenzaFooter>
                      <CancelPlanDialog>
                        <Button variant='destructive'>Cancel Plan</Button>
                      </CancelPlanDialog>
                    </CredenzaFooter>
                  </CredenzaContent>
                </Credenza>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQ */}
      <div className='flex flex-col items-center gap-5'>
        <img
          src='/images/subscription/faq.svg'
          alt='faq'
          className='h-40 w-40 '
        />
        <div className='space-y-1 flex flex-col items-center'>
          <h1 className='text-3xl font-bold'>FAQs</h1>
          <p className='text-xs'>
            Get the answers to our frequestly asked questions in this section.
          </p>
        </div>
        {faqs.map((faq, index) => (
          <Accordion key={index} type='single' collapsible className='w-full'>
            <AccordionItem value={`item-${index}`}>
              <AccordionTrigger className='py-3'>
                {faq.question}
              </AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>
      {planType && planType === 'downgrade' && selectedPlanId && (
        <DowngradePlanDialog />
      )}
      {planType && planType === 'upgrade' && selectedPlanId && (
        <UpgradePlanDialog />
      )}
    </div>
  );
}
