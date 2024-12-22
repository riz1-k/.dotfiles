'use client';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { CiSquareCheck } from 'react-icons/ci';
import { IoMdStar } from 'react-icons/io';
import { MdFlag } from 'react-icons/md';
import { z } from 'zod';

import { Button } from '~/components/ui/button';
import { Progress } from '~/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { env } from '~/lib/config/env';
import { useAxios } from '~/lib/hooks/useAxios';




const reviewSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
  listingType: z.enum(["BServiceListing"]),
  sortBy: z.tuple([
    z.enum(["createdAt", "rating"]),
    z.enum(["asc", "desc"]).default("desc"),
  ])
})


export default function ServiceReviewPage({ slug }: { slug: string }) {
  console.log('slug', slug);
  const axios = useAxios()

  //overview
  const { data: overviewData } = useQuery({
    queryKey: ['overviewData'],
    queryFn: async () => {
      const res = await axios.get(`${env.BACKEND_URL}/review/public/${slug}/overview`, {
        params: {
          listingType: "BServiceListing"
        }
      })
      console.log('overview', res)
      return res.data
    }
  })
  console.log('overviewData', overviewData);


  const { data: reviewData } = useQuery<z.infer<typeof reviewSchema>>({
    queryKey: ['review'],
    queryFn: async () => {
      const res = await axios.get(`${env.BACKEND_URL}/review/public/${slug}`, {
        params: {
          page: 1,
          limit: 30,
          listingType: "BServiceListing",
          sortBy: ,
        },
      });
      console.log('review', res);
      return res.data;
    },
  });
  console.log("reviewData", reviewData)

  return (
    <main className='flex flex-col gap-4 p-6'>
      <h1 className='text-lg font-bold'>Listing Name 1: Service </h1>

      <section className='grid grid-cols-2'>
        <div className='flex flex-col items-center gap-2 rounded-sm bg-background p-2 drop-shadow'>
          <h1 className='text-4xl font-bold'>3.7</h1>
          <div className='flex'>
            {Array.from(['5', '4', '3', '2', '1']).map((index) => (
              <IoMdStar key={index} className='text-2xl text-yellow-400' />
            ))}
          </div>
          <h2 className='font-semibold'>789 Reviews</h2>
        </div>
        <div className='flex flex-col items-center gap-2 text-xs font-semibold'>
          <h1 className='text-4xl font-bold'>61%</h1>
          <h1 className='text-muted-foreground'>Would Recommend</h1>
          <h2>18 Recommendations</h2>
        </div>
      </section>

      <section className='grid grid-cols-2 gap-6'>
        {Array.from([
          'Professionalism 5/4',
          'Timeliness 3/5',
          'Service/Product 5/5',
          'Value for Money 3/5',
        ]).map((item, index) => (
          <div
            key={index}
            className='flex flex-col gap-2 text-sm font-normal text-muted-foreground'
          >
            <h3>{item}</h3>
            <Progress value={65} />
          </div>
        ))}
      </section>

      <section className='my-6 flex flex-col gap-2'>
        <ProgressCard title='1' value={85} total={423} />
        <ProgressCard title='2' value={85} total={423} />
        <ProgressCard title='3' value={85} total={423} />
        <ProgressCard title='4' value={85} total={423} />
      </section>

      <Select>
        <SelectTrigger className='border-none bg-background !outline-none'>
          <SelectValue placeholder='Most Recent ' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='Plumbling Services for Leak' className='!text-lg'>
            Plumbling Services for Leak Analytics
          </SelectItem>
        </SelectContent>
      </Select>
      <div className='flex items-center gap-2 font-semibold text-muted-foreground'>
        <CiSquareCheck className='text-lg text-destructive' />
        <h2>With Photos </h2>
      </div>

      <section className='flex flex-col items-center justify-center gap-5'>
        <h1 className='text-lg font-bold text-muted-foreground'>
          Guest Review Image
        </h1>
        <div className='grid grid-cols-2 gap-4'>
          <img src='/common/review1.png' alt='review' />
          <img src='/common/review2.png' alt='review' />
          <img src='/common/review3.png' alt='review' />
          <div className='flex h-full w-full items-center justify-center border bg-secondary text-center text-muted-foreground'>
            See More <br /> review images
          </div>{' '}
        </div>
        <h1 className='text-sm font-bold text-muted-foreground'>
          We found 104 matching reviews{' '}
        </h1>
        <Link
          href={`/listing/services/${slug}/reviews/create`}
          className='!h-10  w-1/2 !rounded-full  bg-ring text-primary-foreground flex items-center justify-center'
        >
          Write Review
        </Link>
      </section>

      <section className='flex flex-col gap-1 text-sm font-normal'>
        <h1>Great Service</h1>
        <div className='flex items-center justify-between'>
          <div className='flex'>
            {Array.from(['5', '4', '3', '2', '1']).map((index) => (
              <IoMdStar key={index} className='text-2xl text-yellow-400' />
            ))}
          </div>
          <h1>18 January 2022</h1>
        </div>
      </section>
      <h3 className='text-sm font-medium'>
        Really easy to put together as long as there Lorem ipsum dolor sit amet,
        consectetur adipiscing elit. Nunc Lorem ipsum dolor sit amet consectetur
        adipisicing elit. Sapiente, unde?
      </h3>
      <section className='grid grid-cols-2 gap-6'>
        {Array.from([
          'Professionalism 5/4',
          'Timeliness 3/5',
          'Service/Product 5/5',
          'Value for Money 3/5',
        ]).map((item, index) => (
          <div
            key={index}
            className='flex flex-col gap-2 text-sm font-normal text-muted-foreground'
          >
            <h3>{item}</h3>
            <Progress value={65} />
          </div>
        ))}
      </section>
      <section className='flex flex-col gap-4 text-muted-foreground'>
        <h1>Comment Reponse Reactions</h1>
        <div className='flex w-full items-center justify-between gap-1'>
          {reactionArr.map((x, i) => (
            <React.Fragment key={i}>
              {x.title !== 'falg' ? (
                <div className='rounded-sm bg-destructive/5 p-2 text-center text-[10px]'>
                  {x.title} {x.total}
                </div>
              ) : (
                <MdFlag className='rounded-full bg-foreground/40 p-1 text-3xl text-primary-foreground' />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* <section className='mx-auto flex w-4/6 flex-wrap gap-5 rounded-3xl bg-background p-4'>
          {socialMediaArr.map((x, i) => (
            <span key={i}>{x.icons}</span>
          ))}
        </section> */}
      </section>
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

const reactionArr = [
  { title: 'Helpful', total: '200' },
  { title: 'Thanks', total: '14' },
  { title: 'Great', total: '14' },
  { title: 'Oh No', total: '14' },
  { title: 'falg', total: '' },
];
