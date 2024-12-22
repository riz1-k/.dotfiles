/* eslint-disable @next/next/no-img-element */
'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Autoplay from 'embla-carousel-autoplay';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { CiSquareCheck } from 'react-icons/ci';
import { IoMdStar } from 'react-icons/io';
import { IoClose } from 'react-icons/io5';
import { MdArrowBack, MdArrowForward } from 'react-icons/md';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion';
import { Button } from '~/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '~/components/ui/carousel';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { Progress } from '~/components/ui/progress';
import { env } from '~/lib/config/env';
import { useAxios } from '~/lib/hooks/useAxios';
import { cn } from '~/lib/utils';
import {
  type StarCounts,
  type TOverview,
  type TReviews,
} from '~/types/TReviews';

import Loading from '../../loading';

export default function ProductReviewPage({ slug }: { slug: string }) {
  const axios = useAxios();
  const queryClient = useQueryClient();
  const [previewImage, setPreviewImage] = useState(false);
  const [selectedReviewImg, setSelectedReviewImg] = useState<string[]>([]);
  const [selectedImg, setSelectedImg] = useState(0);
  const plugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: false }));

  const imaggeChangeController = (x: string[], index: number) => {
    const reorderedImages = [...x.slice(index), ...x.slice(0, index)];
    setSelectedReviewImg(reorderedImages);
    setSelectedImg(0);
    setPreviewImage(true);
  };
  // review
  const {
    data: reviewData,
    refetch,
    isLoading: isLoadingReview,
  } = useQuery({
    queryKey: ['review', slug, 'products'],
    queryFn: async () => {
      const res = await axios.get(`${env.BACKEND_URL}/review/public/${slug}`, {
        params: {
          page: 1,
          limit: 30,
          listingType: 'BProductListing',
          sortBy: ['createdAt', 'desc'],
        },
      });
      return res.data.data as TReviews;
    },
    staleTime: 1000 * 60 * 60,
  });

  const { data: overviewData, isLoading: isLoadingOverView } = useQuery({
    queryKey: ['overviewData'],
    queryFn: async () => {
      const res = await axios.get(
        `${env.BACKEND_URL}/review/public/${slug}/overview`,
        {
          params: {
            listingType: 'BProductListing',
          },
        }
      );
      return res.data.data as TOverview;
    },
  });

  const postReaction = useMutation({
    mutationFn: async (data: { reaction: string; reviewId: string }) => {
      const res = await axios.post(
        `${env.BACKEND_URL}/review/${data.reviewId}/reaction`,
        { reaction: data.reaction }
      );
      return res.data;
    },
    onSuccess: (updatedReview) => {
      queryClient.setQueryData(
        ['review', slug],
        (prevData: TReviews | undefined) => {
          if (!prevData) return prevData;
          return {
            ...prevData,
            reviews: prevData.reviews.map((review) =>
              review._id === updatedReview._id ? updatedReview : review
            ),
          };
        }
      );
    },
  });

  const [reactedReviews, setReactedReviews] = useState<Record<string, string>>(
    () => {
      if (typeof window !== 'undefined') {
        const savedReactions = localStorage.getItem('reactedReviews');
        return savedReactions ? JSON.parse(savedReactions) : {};
      }
      return {};
    }
  );

  const handleReaction = (reviewId: string, reaction: string) => {
    if (!reactedReviews[reviewId]) {
      postReaction.mutate({ reaction, reviewId });
      const updatedReactions = { ...reactedReviews, [reviewId]: reaction };
      setReactedReviews(updatedReactions);
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'reactedReviews',
          JSON.stringify(updatedReactions)
        );
      }
    }
  };

  useEffect(() => {
    if (postReaction.isSuccess) {
      refetch();
    }
  }, [postReaction.isSuccess, refetch]);

  if (isLoadingReview || isLoadingOverView) {
    <Loading />;
  }

  return (
    <main className='mb-28 flex flex-col gap-4 p-6 pt-20'>
      <h1 className='text-lg font-bold'>Listing Name : Products </h1>
      <section className='grid grid-cols-2 gap-6'>
        <div className='flex flex-col items-center gap-2 rounded-sm bg-background p-2 drop-shadow'>
          <h1 className='text-4xl font-bold'>
            {overviewData?.averageRatings.avgRating.toFixed(1)}
          </h1>
          <div className='flex'>
            {Array.from([1, 2, 3, 4, 5]).map((index) => (
              <IoMdStar
                key={index}
                className={`text-2xl ${index <= Math.round(overviewData?.averageRatings?.avgRating ?? 0) ? 'text-yellow-400' : 'text-muted-foreground'}`}
              />
            ))}
          </div>
          <h2 className='font-semibold'>
            {overviewData?.totalReviews} Reviews
          </h2>
        </div>

        <div className='flex flex-col items-center gap-2 text-xs font-semibold'>
          <h1 className='text-4xl font-bold'>
            {overviewData?.totalReviews && overviewData?.recommendedCount
              ? (
                  (overviewData.recommendedCount / overviewData.totalReviews) *
                  100
                ).toFixed(0)
              : 0}
            %
          </h1>
          <h1 className='text-muted-foreground'>Would Recommend</h1>
          <h2>{overviewData?.recommendedCount} Recommendations</h2>
        </div>
      </section>

      <section className='grid grid-cols-2 gap-6'>
        {[
          {
            label: 'Professionalism',
            value: overviewData?.averageRatings.avgProfessionalism,
          },
          {
            label: 'Timeliness',
            value: overviewData?.averageRatings.avgTimeliness,
          },
          {
            label: 'Service/Product',
            value: overviewData?.averageRatings.avgServiceQuality,
          },
          {
            label: 'Value for Money',
            value: overviewData?.averageRatings.avgValueForMoney,
          },
        ].map(({ label, value }, index) => {
          const roundedValue = Math.round((value ?? 0) * 2) / 2;

          return (
            <div
              key={index}
              className='flex flex-col gap-2 text-sm font-normal text-muted-foreground'
            >
              <h3>
                {label} {roundedValue}/5
              </h3>
              <Progress value={(roundedValue / 5) * 100} />
            </div>
          );
        })}
      </section>

      <section className='my-6 flex flex-col gap-2'>
        {Object.keys(overviewData?.starCounts ?? {}).map((star, index) => {
          const starKey = star as keyof StarCounts;

          return (
            <ProgressCard
              key={index}
              title={`${starKey} Star`}
              value={
                ((overviewData?.starCounts[starKey] ?? 0) /
                  (overviewData?.totalReviews ?? 1)) *
                100
              }
              total={overviewData?.starCounts[starKey] ?? 0}
            />
          );
        })}
      </section>

      {reviewData?.reviews?.length === 0 && (
        <Link
          href={`/listing/products/${slug}/reviews/create`}
          className='mx-auto flex !h-10 w-1/2 items-center  justify-center !rounded-full bg-destructive px-5 text-primary-foreground'
        >
          Write Review
        </Link>
      )}

      {reviewData?.reviews.map((x) => (
        <Accordion type='multiple' key={x._id}>
          <AccordionItem
            value={x._id}
            className='flex flex-col rounded-2xl bg-background px-2 drop-shadow'
          >
            <>
              <AccordionTrigger key={x._id} className='!text-start !text-sm'>
                {x.subject}
              </AccordionTrigger>

              <AccordionContent className='flex flex-col gap-4'>
                {x.images.length > 0 && (
                  <section className='flex flex-col items-center justify-center gap-5'>
                    <div className='flex w-full items-center gap-2 font-semibold text-muted-foreground'>
                      <CiSquareCheck className='text-lg text-destructive' />
                      <h2>With Photos </h2>
                    </div>
                    <h1 className='px-5 text-lg font-bold text-muted-foreground'>
                      Guest Review Image
                    </h1>
                    <div className='grid grid-cols-2 gap-4 px-5'>
                      {x.images.slice(0, 4).map((innerX, index) => (
                        <img
                          key={x._id + index}
                          className='h-40 w-full cursor-pointer object-cover'
                          alt={innerX.meta.fileName}
                          src={`${env.CDN_URL}${innerX.src}`}
                          onClick={() =>
                            imaggeChangeController(
                              x.images.map((img) => `${env.CDN_URL}${img.src}`),
                              index
                            )
                          }
                        />
                      ))}
                    </div>
                  </section>
                )}

                <section className='flex flex-col items-center justify-center  gap-4'>
                  <h1 className='px-5 text-sm font-bold text-muted-foreground'>
                    We found {reviewData.total} matching reviews
                  </h1>
                  <Link
                    href={`/listing/products/${slug}/reviews/create`}
                    className='flex  !h-10 w-1/2 items-center  justify-center !rounded-full bg-destructive px-5 text-primary-foreground'
                  >
                    Write Review
                  </Link>
                </section>

                <section className='flex flex-col gap-1 text-sm font-normal'>
                  <h1>{x.subject}</h1>
                  <div className='flex items-center justify-between'>
                    <div className='flex'>
                      {Array.from({ length: 5 }, (_, index) => (
                        <IoMdStar
                          key={index}
                          className={`text-2xl ${
                            index < x.rating
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <h1>{new Date(x.createdAt).toLocaleDateString()}</h1>
                  </div>
                </section>

                <h3 className='text-sm font-medium text-foreground/80'>
                  {x.comment}
                </h3>

                {x.images.length > 0 && (
                  <section className='flex flex-col items-center justify-center gap-5'>
                    <h1 className='text-lg font-bold text-muted-foreground'>
                      Guest Review Image
                    </h1>
                    <div className='flex flex-shrink-0 gap-4 overflow-x-auto'>
                      <Carousel
                        opts={{ loop: false, dragFree: false, align: 'start' }}
                        plugins={[plugin.current]}
                      >
                        <CarouselContent>
                          {x.images.map((innerX, index) => (
                            <CarouselItem key={x._id} className='basis-1/2'>
                              <img
                                className='h-40 w-full cursor-pointer object-cover'
                                alt={innerX.meta.fileName}
                                src={`${env.CDN_URL}${innerX.src}`}
                                onClick={() =>
                                  imaggeChangeController(
                                    x.images.map(
                                      (img) => `${env.CDN_URL}${img.src}`
                                    ),
                                    index
                                  )
                                }
                              />
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                      </Carousel>
                    </div>
                  </section>
                )}

                <section className='grid grid-cols-2 gap-6'>
                  {[
                    { title: 'Professionalism', value: x.professionalism },
                    { title: 'Timeliness', value: x.timeliness },
                    { title: 'Service/Quality', value: x.serviceOuality },
                    { title: 'Value for Money', value: x.valueForMoney },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className='flex flex-col gap-2 text-sm font-normal text-muted-foreground'
                    >
                      <h3>
                        {item.title} {item.value}/5{' '}
                      </h3>
                      <Progress value={(item.value / 5) * 100} />
                    </div>
                  ))}
                </section>

                <section className='flex flex-col gap-4 text-muted-foreground'>
                  <h1>Comment Response Reactions</h1>
                  <div className='flex w-full items-center justify-between gap-1'>
                    {[
                      { title: 'Helpful', key: 'HELPFUL', count: x.HELPFUL },
                      { title: 'Thanks', key: 'THANKS', count: x.THANKS },
                      { title: 'Great', key: 'GREAT', count: x.GREAT },
                      { title: 'Oh No', key: 'OH_NO', count: x.OH_NO },
                    ].map((reaction, i) => (
                      <button
                        key={i}
                        className={cn(
                          'w-full rounded-sm bg-destructive/10 p-2 text-center text-[10px]',
                          {
                            'bg-muted ': reactedReviews[x._id] === reaction.key,
                          }
                        )}
                        onClick={() => handleReaction(x._id, reaction.key)}
                        disabled={reactedReviews[x._id] === reaction.key}
                      >
                        {reaction.title} {reaction.count || 0}
                      </button>
                    ))}
                  </div>
                </section>
                <h1 className='text-xs text-foreground'>
                  Review by:{x.account?.fullName}
                </h1>
                <p className='h-1 w-full bg-muted' />
                {previewImage && (
                  <PreviewImageDialoge
                    previewImage={previewImage}
                    setPreviewImage={setPreviewImage}
                    images={selectedReviewImg}
                    selectedImg={selectedImg}
                    setSelectedImg={setSelectedImg}
                  />
                )}
              </AccordionContent>
            </>
          </AccordionItem>
        </Accordion>
      ))}
    </main>
  );
}

interface IProgress {
  title: string;
  value: number;
  total: number;
}

function ProgressCard({ title, value, total }: IProgress) {
  return (
    <div className='flex items-center gap-4 text-muted-foreground'>
      <Button variant={'outline'} className='!h-8 !rounded-full'>
        {title} Star
      </Button>
      <Progress value={value} />
      {total}
    </div>
  );
}

interface IPreview {
  previewImage: boolean;
  setPreviewImage: (previewImage: boolean) => void;
  images: string[];
  selectedImg: number;
  setSelectedImg: (index: number) => void;
}

function PreviewImageDialoge({
  previewImage,
  setPreviewImage,
  images,
  selectedImg,
  setSelectedImg,
}: IPreview) {
  const handlePrev = () => {
    const newIndex = (selectedImg - 1 + images.length) % images.length;
    setSelectedImg(newIndex);
  };

  const handleNext = () => {
    const newIndex = (selectedImg + 1) % images.length;
    setSelectedImg(newIndex);
  };

  return (
    <Dialog open={previewImage} onOpenChange={setPreviewImage}>
      <DialogContent className='!h-full !w-[100vw] border-none bg-secondary/0 p-0'>
        <DialogHeader>
          <DialogTitle className='flex items-center justify-between bg-primary px-2 py-3 text-start text-xl font-semibold text-primary-foreground'>
            <p>Image Preview</p>
            <IoClose
              className='cursor-pointer rounded-full p-1 text-3xl'
              onClick={() => setPreviewImage(false)}
            />
          </DialogTitle>
          <DialogDescription className='flex !h-full flex-col items-center justify-center gap-3 p-0'>
            <div className='relative h-[70%] w-full'>
              <img
                alt={`Preview ${selectedImg}`}
                src={images[selectedImg]}
                className='h-full w-full object-cover'
              />
              <MdArrowBack
                className='absolute left-5 top-1/2 -translate-y-1/2 transform cursor-pointer rounded-full bg-background p-2 text-3xl text-primary'
                onClick={handlePrev}
              />
              <MdArrowForward
                className='absolute right-5 top-1/2 -translate-y-1/2 transform cursor-pointer rounded-full bg-background p-2 text-3xl text-primary'
                onClick={handleNext}
              />
            </div>
            <div className='mt-5 flex h-[10%] w-[80%] items-center gap-2 overflow-x-auto px-5'>
              {images.map((src, index) => (
                <img
                  key={index}
                  alt={`Thumbnail ${index}`}
                  src={src}
                  className={`h-20 w-20 cursor-pointer object-contain ${
                    selectedImg === index ? 'border-2 border-primary' : ''
                  }`}
                  onClick={() => setSelectedImg(index)}
                />
              ))}
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
