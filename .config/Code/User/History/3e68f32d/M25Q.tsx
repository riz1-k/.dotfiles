import {
  createFileRoute,
  Link,
  useNavigate,
  useParams,
  useSearch,
} from '@tanstack/react-router';
import { ChevronRight } from 'lucide-react';

import { IoMdStar, IoMdStarHalf } from 'react-icons/io';
import {
  reviewPageSchema,
  useReviewAnalytics,
  useReviewCatalog,
} from './-utils/useReview';
import { Separator } from '@/components/ui/separator';
import { EmptyView } from '@/components/global/empty-view';
import { Pagination } from '@/components/global/pagination';
import PageHeader from '@/components/global/PageHeader';
import StoreTabs from '../-components/StoreTabs';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const Route = createFileRoute(
  '/_dashboard/dashboard/stores/$id/reviews/'
)({
  component: ReviewPage,
  validateSearch: reviewPageSchema,
});

function ReviewPage() {
  const { data, isLoading } = useReviewAnalytics();
  const catalog = useReviewCatalog();
  const navigate = useNavigate();
  const search = useSearch({
    from: '/_dashboard/dashboard/stores/$id/reviews/',
  });
  const storeId = useParams({
    from: '/_dashboard/dashboard/stores/$id/reviews/',
  }).id;

  if (isLoading) {
    return (
      <main className='flex flex-col gap-6 '>
        <PageHeader
          breadcrumbs={[
            { label: 'Stores', link: { to: '/dashboard/stores' } },
            { label: 'Reviews', link: null },
          ]}
        />
        <StoreTabs storeId={storeId} currentTab='reviews' />
        <h2 className='text-xl font-bold'>Loading...</h2>
      </main>
    );
  }

  if (!data?.totalReviews) {
    return (
      <main className='flex flex-col gap-6 '>
        <PageHeader
          breadcrumbs={[
            { label: 'Stores', link: { to: '/dashboard/stores' } },
            { label: 'Reviews', link: null },
          ]}
        />
        <StoreTabs storeId={storeId} currentTab='reviews' />
        <EmptyView
          icon='users'
          title='No Reviews'
          description='No reviews found'
        />
      </main>
    );
  }

  return (
    <main className='flex flex-col gap-6 '>
      <PageHeader
        breadcrumbs={[
          { label: 'Stores', link: { to: '/dashboard/stores' } },
          { label: 'Reviews', link: null },
        ]}
      />
      <StoreTabs storeId={storeId} currentTab='reviews' />

      {/* default card */}
      <section className='flex flex-col gap-4'>
        <h1 className='text-xl font-bold'>Overall Ratings & Reviews</h1>
        <section className='grid grid-cols-2 font-bold'>
          <section className='flex flex-col items-center gap-2'>
            <h1 className='text-4xl font-bold'>
              {data?.averageRatings.avgRating.toFixed(1)}
            </h1>
            <div className='flex'>
              {[1, 2, 3, 4, 5].map((star) => {
                const rating = data.averageRatings.avgRating;
                const isFullStar = star <= Math.floor(rating);
                const isHalfStar =
                  !isFullStar &&
                  star === Math.ceil(rating) &&
                  rating % 1 >= 0.5;

                return isFullStar ? (
                  <IoMdStar key={star} className='text-2xl text-yellow-400' />
                ) : isHalfStar ? (
                  <IoMdStarHalf
                    key={star}
                    className='text-2xl text-yellow-400'
                  />
                ) : (
                  <IoMdStar key={star} className='text-2xl text-gray-300' />
                );
              })}
            </div>
            <h2>{data?.totalReviews} Overall Ratings</h2>
          </section>
          <section className='flex flex-col items-center gap-2'>
            <h1 className='text-4xl'>
              {((data?.recommendedCount / data?.totalReviews) * 100).toFixed(0)}
              %
            </h1>
            <h1 className='text-sm text-foreground/50'>Would Recommend</h1>
            <h2 className='text-xs'>
              {data?.recommendedCount} Recommendations
            </h2>
          </section>
        </section>
        <section className='grid grid-cols-2 md:grid-cols-4 gap-y-5 gap-x-6 md:px-5 '>
          <ReviewCard
            title='Professionalism'
            ratingCount={data?.averageRatings.avgProfessionalism.toFixed(1)}
          />
          <ReviewCard
            title='Timeliness'
            ratingCount={data?.averageRatings.avgTimeliness.toFixed(1)}
          />
          <ReviewCard
            title='Service/Product'
            ratingCount={data?.averageRatings.avgServiceQuality.toFixed(1)}
          />
          <ReviewCard
            title='Value for Money'
            ratingCount={data?.averageRatings.avgValueForMoney.toFixed(1)}
          />
        </section>
      </section>
      <div className='flex justify-center'>
        <Tabs
          value={search.listType}
          onValueChange={(value) => {
            navigate({
              to: '/dashboard/stores/$id/reviews',
              search: {
                ...search,
                listType: value as typeof search.listType,
              },
              params: { id: storeId },
            });
          }}
        >
          <TabsList>
            <TabsTrigger value='service'>Service Ratings </TabsTrigger>
            <TabsTrigger value='product'>Product Ratings </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className='flex flex-col gap-6'>
        <h1 className='text-xl font-bold'>Listing Ratings & Reviews</h1>
        <div className='flex flex-col gap-4 '>
          {catalog.data?.listings.map((item, i) => (
            <>
              <Link
                to='/dashboard/stores/$id/reviews/$reviewId'
                params={{
                  id: storeId,
                  reviewId: item._id,
                }}
                search={{
                  page: 1,
                  limit: 10,
                  sortBy: ['createdAt', 'desc'],
                  listingType:
                    search.listType === 'service'
                      ? 'BServiceListing'
                      : 'BProductListing',
                }}
                className='flex justify-between items-center'
                key={item._id}
              >
                <span className='font-semibold'>
                  Listing Name {i + 1} : {item.title}
                </span>
                <ChevronRight className='h-4 w-4' />
              </Link>
              <Separator className='bg-foreground/30' />
            </>
          ))}
        </div>
      </div>
      <Pagination total={catalog.data?.total} />
    </main>
  );
}

function ReviewCard({
  title,
  ratingCount,
}: {
  title: string;
  ratingCount: string;
}) {
  return (
    <section className='custom-shadow flex flex-col items-center gap-1.5 rounded-xl p-4 font-bold'>
      <h3>{title}</h3>
      <h1 className='text-4xl'>{ratingCount}</h1>
      <div className='flex'>
        {[1, 2, 3, 4, 5].map((star) => {
          const rating = parseFloat(ratingCount);
          const isFullStar = star <= Math.floor(rating);
          const isHalfStar =
            !isFullStar && star === Math.ceil(rating) && rating % 1 >= 0.5;

          return isFullStar ? (
            <IoMdStar key={star} className='text-2xl text-yellow-400' />
          ) : isHalfStar ? (
            <IoMdStarHalf key={star} className='text-2xl text-yellow-400' />
          ) : (
            <IoMdStar key={star} className='text-2xl text-gray-300' />
          );
        })}
      </div>
    </section>
  );
}
