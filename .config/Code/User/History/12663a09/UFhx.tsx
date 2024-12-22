import { CircleUserRound, Star, Users, Ticket } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from '@tanstack/react-router';

const tabs = [
  'profile',
  'listings',
  'subscriptions',
  'reviews',
  'billing',
  'help',
] as const;

export default function StoreTabs({
  storeId,
  currentTab,
}: {
  storeId: string;
  currentTab: (typeof tabs)[number];
}) {
  return (
    <Tabs value={currentTab} className='w-full max-w-5xl mx-auto'>
      <TabsList className='h-auto grid grid-cols-5 p-0'>
        <TabsTrigger
          asChild
          value='profile'
          className='flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 py-3'
        >
          <Link
            to={`/dashboard/users/stores/$id/business-profile`}
            params={{ id: storeId }}
          >
            <CircleUserRound className='h-5 w-5' />
            <span className='text-sm font-medium'>Business profile</span>
          </Link>
        </TabsTrigger>
        <TabsTrigger
          asChild
          value='listings'
          className='flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 py-3'
        >
          <Link
            to={`/dashboard/users/stores/$id/listings`}
            params={{ id: storeId }}
            search={{ listType: 'service' }}
          >
            <CircleUserRound className='h-5 w-5' />
            <span className='text-sm font-medium'>Listings</span>
          </Link>
        </TabsTrigger>
        <TabsTrigger
          asChild
          value='subscriptions'
          className='flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 py-3'
        >
          <Link
            to={`/dashboard/users/stores/$id/subscriptions`}
            params={{ id: storeId }}
            search={{ subscriptionType: 'business', page: 1, limit: 10 }}
          >
            <Ticket className='h-5 w-5' />
            <span className='text-sm font-medium'>
              Subscriptions & Billings
            </span>
          </Link>
        </TabsTrigger>
        <TabsTrigger
          value='reviews'
          asChild
          className='flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 py-3'
        >
          <Link
            to={`/dashboard/users/stores/$id/reviews`}
            params={{ id: storeId }}
            search={{ listType: 'service' }}
          >
            <Star className='h-5 w-5' />
            <span className='text-sm font-medium'>Reviews & Rating</span>
          </Link>
        </TabsTrigger>
        <TabsTrigger
          value='help'
          className='flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 py-3'
        >
          <Users className='h-5 w-5' />
          <span className='text-sm font-medium'>Help & Support</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
