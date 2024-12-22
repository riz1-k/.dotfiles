import { Button, buttonVariants } from '@/components/ui/button';
import { createFileRoute, Link, useSearch } from '@tanstack/react-router';

import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { CheckCircle, Eye, Plus, TrendingUp } from 'lucide-react';
import { z } from 'zod';
import { useDashboard } from './(dashboard-page)/-utils/useDashboard';
import { useState } from 'react';
import { useSellerSubscription } from '@/lib/hooks/useSession';
import { formatDate } from 'date-fns';
import { AddListingModal } from '@/components/global/BottomNav';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  TotalCallChart,
  TotalChatChart,
} from './(dashboard-page)/-components/usage-charts';
import {
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Lock, ShoppingCart } from 'lucide-react';

const searchSchema = z.object({
  overviewChart: z
    .enum(['total-listing', 'total-call-clicks', 'total-chat-clicks'])
    .optional(),
});

export const Route = createFileRoute('/_dashboard/dashboard/')({
  component: Dashboard,
  validateSearch: searchSchema,
});

function Dashboard() {
  const dashboardQuery = useDashboard();
  const activeSubscription = useSellerSubscription();
  useSearch({ from: '/_dashboard/dashboard/' });
  const [categoryView, setCategoryView] = useState<'service' | 'product'>(
    'service'
  );

  if (dashboardQuery.isLoading || activeSubscription.isLoading)
    return <div>Loading...</div>;

  if (!dashboardQuery.data || !activeSubscription.data)
    return (
      <div className='min-h-full bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4'>
        <Card className='max-w-3xl w-full'>
          <CardHeader>
            <div className='flex items-center justify-center mb-4'>
              <Lock className='h-12 w-12 text-yellow-500' />
            </div>
            <CardTitle className='text-2xl text-center'>
              Welcome to Your Seller Journey!
            </CardTitle>
            <CardDescription className='text-center text-lg'>
              We're excited to have you on board, but there's one more step to
              unlock your full potential.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            <p className='text-gray-600 text-center'>
              Thank you for joining our platform! To access the dashboard and
              boost your business, you'll need to subscribe to one of our
              subscription plans.
            </p>
            <div className='grid md:grid-cols-2 gap-4'>
              <FeatureCard
                title='Powerful Analytics'
                description='Gain insights into your sales performance and customer behavior.'
              />
              <FeatureCard
                title='Listing Management'
                description='Easily track and manage your listings (including leads and calls) from one place.'
              />
              <FeatureCard
                title='24/7 Support'
                description='Get help whenever you need it with our round-the-clock support team.'
              />
              <FeatureCard
                title='Marketing Tools'
                description='Access tools to promote your products & services to reach more customers.'
              />
            </div>
          </CardContent>
          <CardFooter className='flex flex-col items-center space-y-4'>
            <p className='text-center text-gray-600'>
              Ready to take your business to the next level? Subscribe now and
              unlock all these features!
            </p>
            <Link
              to='/dashboard/subscriptions'
              search={{ plan: 'Silver', frequency: 'MONTHLY' }}
              className={buttonVariants({
                variant: 'default',
                size: 'lg',
                className: 'w-full max-w-sm',
              })}
            >
              <ShoppingCart className='mr-2 h-5 w-5' /> Choose Your Subscription
            </Link>
          </CardFooter>
        </Card>
      </div>
    );

  return (
    <main className='p-6 max-w-[800px] flex flex-col gap-y-8'>
      <header className='flex items-center gap-2'>
        <div
          className='w-6 h-6 bg-accent flex items-center justify-center rounded'
          aria-hidden='true'
        >
          <svg
            width='16'
            height='16'
            viewBox='0 0 16 16'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            className='text-white'
          >
            <path
              d='M2 2h4v4H2V2zM10 2h4v4h-4V2zM2 10h4v4H2v-4zM10 10h4v4h-4v-4z'
              fill='currentColor'
            />
          </svg>
        </div>
        <h1 className='text-2xl font-bold'>Dashboard</h1>
      </header>
      <section aria-labelledby='analytics-title'>
        <Card className='p-4'>
          <header className='flex items-center justify-between mb-4'>
            <h2 id='analytics-title' className='text-xl font-bold'>
              Analytics Overview
            </h2>
            <TrendingUp className='w-5 h-5 text-gray-600' aria-hidden='true' />
          </header>
          <div className='grid grid-cols-3 gap-4'>
            <Link
              to='/dashboard'
              search={{
                overviewChart: undefined,
              }}
              replace
              className='rounded-md border p-2 shadow-md'
            >
              <p className='text-xl text-center font-bold mb-1'>
                {dashboardQuery.data.totalListings}
              </p>
              <p className='text-xs text-card-foreground text-center'>
                Total Listings
              </p>
            </Link>
            <Link
              to='/dashboard'
              search={{
                overviewChart: 'total-call-clicks',
              }}
              replace
              className='rounded-md border p-2 shadow-md'
            >
              <p className='text-xl text-center font-bold mb-1'>
                {dashboardQuery.data.totalClicks}
              </p>
              <p className='text-xs text-card-foreground text-center'>
                Total Clicks On Calls
              </p>
            </Link>
            <Link
              to='/dashboard'
              search={{
                overviewChart: 'total-chat-clicks',
              }}
              replace
              className='rounded-md border p-2 shadow-md'
            >
              <p className='text-xl text-center font-bold mb-1'>
                {dashboardQuery.data.totalChats}
              </p>
              <p className='text-xs text-card-foreground text-center'>
                Total Clicks on Chats
              </p>
            </Link>
          </div>
        </Card>
      </section>
      <div className='flex justify-center items-center'>
        <TotalChatChart />
        <TotalCallChart />
      </div>
      <section aria-labelledby='listings-status-title'>
        <header className='flex items-center justify-between mb-4'>
          <div className='flex items-center gap-2'>
            <h2 id='listings-status-title' className='text-xl font-bold'>
              Listings Status
            </h2>
            <AddListingModal>
              <Button
                size='icon'
                variant='ghost'
                className='rounded-full border-accent border-2 h-6 w-6'
                aria-label='Add new listing'
              >
                <Plus className='w-4 h-4 text-accent' />
              </Button>
            </AddListingModal>
          </div>
          <Link
            to='/dashboard/listings'
            search={{
              listType: 'service',
              sort: ['createdAt', 'desc'],
            }}
          >
            <Eye className='w-5 h-5' aria-hidden='true' />
          </Link>
        </header>
        <div className='grid grid-cols-2 gap-4'>
          <article>
            <Card className='p-4'>
              <h3 className='font-semibold mb-1'>Active</h3>
              <p className='text-sm text-gray-600'>
                {dashboardQuery.data.product.overallStats.ACTIVE +
                  dashboardQuery.data.service.overallStats.ACTIVE}{' '}
                Listings
              </p>
            </Card>
          </article>
          <article>
            <Card className='p-4'>
              <h3 className='font-semibold mb-1'>Inactive</h3>
              <p className='text-sm text-gray-600'>
                {dashboardQuery.data.product.overallStats.IN_ACTIVE +
                  dashboardQuery.data.service.overallStats.IN_ACTIVE}{' '}
                Listings
              </p>
            </Card>
          </article>
          <article>
            <Card className='p-4'>
              <h3 className='font-semibold mb-1'>Draft</h3>
              <p className='text-sm text-gray-600'>
                {dashboardQuery.data.product.overallStats.DRAFT +
                  dashboardQuery.data.service.overallStats.DRAFT}{' '}
                Listings
              </p>
            </Card>
          </article>
          <article>
            <Card className='p-4'>
              <h3 className='font-semibold mb-1'>Under Review</h3>
              <p className='text-sm text-gray-600'>
                {dashboardQuery.data.product.overallStats.UNDER_REVIEW +
                  dashboardQuery.data.service.overallStats.UNDER_REVIEW}{' '}
                Listings
              </p>
            </Card>
          </article>
        </div>
      </section>
      <section aria-labelledby='categories-title'>
        <Accordion type='single' className='p-4'>
          <AccordionItem value='listing-categories-2'>
            <AccordionTrigger className='text-xl font-bold'>
              Listings Categories
            </AccordionTrigger>
            <AccordionContent>
              <div
                className='flex items-center justify-center gap-4 mb-6'
                role='group'
                aria-label='Toggle listing type'
              >
                <span className='font-medium'>Service</span>
                <Switch
                  aria-label='Toggle between service and product'
                  checked={categoryView === 'service'}
                  onCheckedChange={(checked) => {
                    setCategoryView(checked ? 'service' : 'product');
                  }}
                />
                <span className='font-medium'>Product</span>
              </div>
              <h3 className='text-sm font-medium mb-4'>
                <span className='capitalize'>{categoryView}</span> Categories
                List
              </h3>
              <ul className='space-y-4'>
                {dashboardQuery.data[categoryView].categoryStats.map(
                  (category) => (
                    <li
                      key={category.categoryId}
                      className='flex items-center justify-between'
                    >
                      <span>{category.categoryTitle}</span>
                      <span>{category.productCount}</span>
                    </li>
                  )
                )}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
      <div className='space-y-8'>
        <div className='space-y-6'>
          <h2 className='font-semibold'>
            All Leads Captured (Overall Analytics)
          </h2>
          <div className='grid gap-4 grid-cols-2'>
            <Card className='p-6'>
              <CardContent className='p-0'>
                <div className='text-sm text-muted-foreground mb-2'>Total</div>
                <div className='text-3xl font-bold mb-1'>
                  {dashboardQuery.data.currentUsage.socialVisits}
                </div>
                <div className='text-sm'>Listing Visits</div>
              </CardContent>
            </Card>
            <Card className='p-6'>
              <CardContent className='p-0'>
                <div className='text-sm text-muted-foreground mb-2'>Total</div>
                <div className='text-3xl font-bold mb-1'>
                  {dashboardQuery.data.currentUsage.websiteVisits}
                </div>
                <div className='text-sm'>Leads Capture</div>
              </CardContent>
            </Card>
            <Card className='p-6'>
              <CardContent className='p-0'>
                <div className='text-sm text-muted-foreground mb-2'>Total</div>
                <div className='text-3xl font-bold mb-1'>
                  {dashboardQuery.data.savedListingCount}
                </div>
                <div className='text-sm'>Saved Listing</div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className='space-y-4'>
          <h2 className='text-xl font-semibold'>Current Plan Subscription</h2>
          <Card className='p-6'>
            <CardContent className='p-0 space-y-4'>
              <div>
                <div className='font-semibold mb-1'>Premium Plan</div>
                <div className='text-sm text-muted-foreground'>
                  Renewal Date:{' '}
                  {formatDate(
                    new Date(
                      activeSubscription.data?.activeSubscription?.endDate ?? ''
                    ),
                    'dd MMMM yyyy'
                  )}
                </div>
              </div>
              <Link
                to='/dashboard/my-subscription'
                search={{
                  frequency: 'MONTHLY',
                }}
                className={buttonVariants({ className: 'w-full rounded-full' })}
              >
                Manage Subscription
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className='flex items-start space-x-3'>
      <CheckCircle className='h-6 w-6 text-green-500 flex-shrink-0 mt-1' />
      <div>
        <h3 className='font-semibold'>{title}</h3>
        <p className='text-sm text-gray-600'>{description}</p>
      </div>
    </div>
  );
}
