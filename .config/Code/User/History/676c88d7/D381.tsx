import {
  createFileRoute,
  useNavigate,
  useParams,
  useSearch,
} from '@tanstack/react-router';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Review,
  singleReviewSchema,
  useSingleReview,
} from './-utils/useReview';
import env from '@/lib/config/env';
import {
  Credenza,
  CredenzaContent,
  CredenzaHeader,
  CredenzaTitle,
} from '@/components/ui/credenza';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselApi,
} from '@/components/ui/carousel';
import { EmptyPage } from '@/components/global/empty-view';
import { MetricsCard, RatingStars, ReviewCard } from './-components/ReviewCard';
import PageHeader from '@/components/global/PageHeader';
import StoreTabs from '../-components/StoreTabs';

export const Route = createFileRoute(
  '/_dashboard/dashboard/users/stores/$id/reviews/$reviewId'
)({
  component: SingleReview,
  validateSearch: singleReviewSchema,
});

// Helper function to render stars with half stars
const ProgressCard = ({
  title,
  value,
  total,
}: {
  title: string;
  value: number;
  total: number;
}) => (
  <div className='flex items-center gap-4 text-muted-foreground'>
    <Button size='xs' variant='outline' className='rounded-full'>
      {title} Star
    </Button>
    <Progress value={(value / total) * 100} />
    <span className='text-xs'>{value}</span>
  </div>
);
export default function SingleReview() {
  const navigate = useNavigate();
  const search = useSearch({
    from: '/_dashboard/dashboard/users/stores/$id/reviews/$reviewId',
  });
  const { data, isLoading, error, refetch } = useSingleReview();
  const listingId = useParams({
    from: '/_dashboard/dashboard/users/stores/$id/reviews/$reviewId',
  }).reviewId;
  const storeId = useParams({
    from: '/_dashboard/dashboard/users/stores/$id/reviews/$reviewId',
  }).id;

  const ITEMS_PER_PAGE = search.limit || 10;
  const currentPage = Number(search.page) || 1;
  const totalPages = data ? Math.ceil(data.reviews.length / ITEMS_PER_PAGE) : 0;

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const allImages =
    data?.reviews
      .filter((review) => review.images.length > 0)
      .map((review) => ({
        src: review.images.map((image) => env.CDN_URL + image.src),
        reviewId: review._id,
        reviewData: {
          subject: review.subject,
          comment: review.comment,
          rating: review.rating,
          createdAt: review.createdAt,
          isAnonymous: true,
          user: {
            name: 'Anonymous',
          },
        },
      })) || [];

  // Update the image click handler
  const handleImageClick = (_: number, imageIndex: number) => {
    setSelectedImageIndex(imageIndex);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <section className='flex flex-col gap-4'>
        <PageHeader
          breadcrumbs={[
            { label: 'Stores', link: { to: '/dashboard/users/stores' } },
            {
              label: 'Reviews',
              link: {
                to: '/dashboard/users/stores/$id/reviews',
                params: { id: storeId },
              },
            },
            { label: 'Loading', link: null },
          ]}
        />
        <StoreTabs storeId={storeId} currentTab='reviews' />
        <h2 className='text-center'>Loading...</h2>
      </section>
    );
  }

  if (error || !data || !data.reviews.length) {
    return (
      <section className='flex flex-col gap-4'>
        <PageHeader
          breadcrumbs={[
            { label: 'Stores', link: { to: '/dashboard/users/stores' } },
            {
              label: 'Reviews',
              link: {
                to: '/dashboard/users/stores/$id/reviews',
                params: { id: storeId },
              },
            },
            { label: '#404', link: null },
          ]}
        />
        <StoreTabs storeId={storeId} currentTab='reviews' />

        <EmptyPage icon='users' title='404' description='No Reviews Found' />
      </section>
    );
  }

  // Calculate metrics from reviews
  const metrics = {
    totalReviews: data.reviews.length,
    recommendationCount: data.reviews.filter((r) => r.isRecommended).length,
    recommendationPercentage: Math.round(
      (data.reviews.filter((r) => r.isRecommended).length /
        data.reviews.length) *
        100
    ),
    rating: {
      average: calculateAverageRating(data.reviews),
      count: data.reviews.length,
      distribution: calculateDistribution(data.reviews),
      metrics: {
        professionalism: calculateAverageMetric(
          data.reviews,
          'professionalism'
        ),
        timeliness: calculateAverageMetric(data.reviews, 'timeliness'),
        serviceProduct: calculateAverageMetric(data.reviews, 'serviceOuality'),
        valueForMoney: calculateAverageMetric(data.reviews, 'valueForMoney'),
      },
    },
  };

  const paginatedReviews = data.reviews.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (newPage: number) => {
    navigate({
      to: '/dashboard/users/stores/$id/reviews/$reviewId',
      params: {
        reviewId: listingId,
        id: storeId,
      },
      search: {
        ...search,
        page: newPage,
      },
    });
  };
  return (
    <section className='flex flex-col gap-4'>
      <PageHeader
        breadcrumbs={[
          { label: 'Stores', link: { to: '/dashboard/users/stores' } },
          {
            label: 'Reviews',
            link: {
              to: '/dashboard/users/stores/$id/reviews',
              params: { id: storeId },
            },
          },
          { label: data.listing.title, link: null },
        ]}
      />
      <StoreTabs storeId={storeId} currentTab='reviews' />

      <article className='flex flex-col gap-6 p-4 mt-5'>
        <header>
          <h1 className='text-xl font-semibold'>{data.listing.title}</h1>
        </header>

        <div className='grid grid-cols-2 font-bold'>
          <div className='custom-shadow flex flex-col items-center gap-2 px-1 py-2'>
            <p className='text-4xl font-bold'>
              {metrics.rating.average.toFixed(1)}
            </p>
            <RatingStars rating={metrics.rating.average} />
            <p>{metrics.totalReviews} Overall Ratings</p>
          </div>

          <div className='flex flex-col items-center gap-2'>
            <p className='text-4xl'>{metrics.recommendationPercentage}%</p>
            <p className='text-sm text-foreground/50'>Would Recommend</p>
            <p className='text-xs'>
              {metrics.recommendationCount} Recommendations
            </p>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-5 bg-card rounded-md p-5 custom-shadow'>
          {Object.entries(metrics.rating.metrics).map(([key, value]) => (
            <MetricsCard
              key={key}
              label={
                key.charAt(0).toUpperCase() +
                key.slice(1).replace(/([A-Z])/g, ' $1')
              }
              value={value}
            />
          ))}
        </div>

        <div className='flex flex-col gap-3 p-5 bg-card rounded-md custom-shadow'>
          {Object.entries(metrics.rating.distribution).map(([stars, count]) => (
            <ProgressCard
              key={stars}
              title={stars}
              value={count}
              total={metrics.totalReviews}
            />
          ))}
        </div>

        <div className='flex flex-col gap-4'>
          <Select
            defaultValue={`${search.sortBy?.[0]}-${search.sortBy?.[1]}`}
            onValueChange={(value) => {
              const [field, direction] = value.split('-') as [
                'createdAt' | 'rating',
                'asc' | 'desc',
              ];
              navigate({
                to: '/dashboard/users/stores/$id/reviews/$reviewId',
                params: { id: storeId, reviewId: listingId },
                search: {
                  ...search,
                  sortBy: [field, direction],
                  // Reset to first page when sorting changes
                  page: 1,
                },
                replace: true,
              }).then(() => {
                refetch();
              });
            }}
          >
            <SelectTrigger className='!outline-none'>
              <SelectValue placeholder='Sort by...' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='createdAt-desc'>Most Recent</SelectItem>
              <SelectItem value='rating-desc'>Highest Rated</SelectItem>
              <SelectItem value='rating-asc'>Lowest Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {data.reviews.some((review) => review.images.length > 0) && (
          <section className='flex flex-col items-center justify-center gap-5 font-bold'>
            <h2 className='text-lg text-foreground/50'>Guest Review Images</h2>
            <div className='grid grid-cols-2 gap-4 w-full px-10'>
              {allImages.slice(0, 3).map((image, index) => (
                <div
                  key={`image-${index}`}
                  className='aspect-square cursor-pointer'
                  onClick={() => handleImageClick(index, 0)}
                >
                  <img
                    src={image.src[0]}
                    alt={`Review ${index + 1}`}
                    className='w-full h-full object-cover rounded-md'
                  />
                </div>
              ))}
              {allImages.length > 3 && (
                <div
                  className='aspect-square flex flex-col items-center justify-center border rounded-md cursor-pointer bg-muted/10 hover:bg-muted/20 transition-colors'
                  onClick={() => handleImageClick(3, 0)}
                >
                  <p className='text-muted-foreground font-medium text-center'>
                    View More
                    <br />
                    Images
                  </p>
                </div>
              )}
            </div>
            <p className='text-sm text-foreground/50'>
              We found {allImages.length} review images
            </p>
          </section>
        )}

        <section className='flex flex-col gap-6'>
          {paginatedReviews.map((review) => (
            <ReviewCard key={review._id} review={review} />
          ))}
        </section>

        <ImageDialog
          selectedImageIndex={selectedImageIndex}
          allImages={allImages}
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
        />

        <div className='flex justify-center gap-2 mt-4'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className='h-4 w-4' />
          </Button>
          <span className='flex items-center px-4'>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant='outline'
            size='sm'
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className='h-4 w-4' />
          </Button>
        </div>
      </article>
    </section>
  );
}

// Update the ImageDialog component
const ImageDialog = (props: {
  selectedImageIndex: number;
  allImages: Array<{
    src: string[];
    reviewId: string;
    reviewData: {
      subject: string;
      comment: string;
      rating: number;
      createdAt: string;
      isAnonymous: boolean;
      user: {
        name: string;
      };
    };
  }>;
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { selectedImageIndex, allImages, isDialogOpen, setIsDialogOpen } =
    props;
  const [currentReviewIndex, setCurrentReviewIndex] =
    useState(selectedImageIndex);
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) return;

    api.on('select', () => {
      setCurrentReviewIndex(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <Credenza open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <CredenzaContent className='max-w-4xl'>
        <CredenzaHeader>
          <CredenzaTitle>
            Review {currentReviewIndex + 1} of {allImages.length}
          </CredenzaTitle>
        </CredenzaHeader>

        <div className='mt-4'>
          <Carousel setApi={setApi} className='w-full'>
            <CarouselContent>
              {allImages.map((review, reviewIndex) => (
                <CarouselItem key={`review-${review.reviewId}`}>
                  <div className='flex flex-col gap-4'>
                    <Carousel>
                      <CarouselContent>
                        {review.src.map((imageUrl, imageIndex) => (
                          <CarouselItem
                            key={`image-${reviewIndex}-${imageIndex}`}
                          >
                            <img
                              src={imageUrl}
                              alt={`Review ${reviewIndex + 1} - Image ${imageIndex + 1}`}
                              className='w-full h-[400px] object-contain'
                            />
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      {review.src.length > 1 && (
                        <>
                          <CarouselPrevious className='left-2' />
                          <CarouselNext className='right-2' />
                        </>
                      )}
                    </Carousel>
                    <div className='bg-card p-4 rounded-lg'>
                      <div className='flex items-center justify-between mb-2'>
                        <div>
                          <h3 className='font-semibold'>
                            {review.reviewData.subject}
                          </h3>
                          <p className='text-sm text-muted-foreground'>
                            by{' '}
                            {review.reviewData.isAnonymous
                              ? 'Anonymous'
                              : review.reviewData.user.name}
                          </p>
                        </div>
                        <RatingStars rating={review.reviewData.rating} />
                      </div>
                      <time className='text-sm text-muted-foreground'>
                        {new Date(
                          review.reviewData.createdAt
                        ).toLocaleDateString()}
                      </time>
                      <p className='mt-2 text-foreground/80'>
                        {review.reviewData.comment}
                      </p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className='left-2' />
            <CarouselNext className='right-2' />
          </Carousel>
        </div>
      </CredenzaContent>
    </Credenza>
  );
};

// Helper functions for calculations
function calculateAverageRating(reviews: Review[]): number {
  if (!reviews.length) return 0;
  return (
    reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
  );
}

function calculateAverageMetric(
  reviews: Review[],
  metric: keyof Pick<
    Review,
    'professionalism' | 'timeliness' | 'valueForMoney' | 'serviceOuality'
  >
): number {
  if (!reviews.length) return 0;
  return (
    reviews.reduce((acc, review) => acc + review[metric], 0) / reviews.length
  );
}

function calculateDistribution(reviews: Review[]): { [key: number]: number } {
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  reviews.forEach((review) => {
    const rating = Math.round(review.rating);
    if (rating >= 1 && rating <= 5) {
      distribution[rating as keyof typeof distribution]++;
    }
  });
  return distribution;
}
