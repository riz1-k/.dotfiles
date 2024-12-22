/* eslint-disable jsx-a11y/alt-text */
'use client';
import { useQuery } from '@tanstack/react-query';
import Autoplay from 'embla-carousel-autoplay';
import Link from 'next/link';
import React, { useRef, useState } from 'react';
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaPinterest,
  FaSnapchat,
  FaTiktok,
  FaWhatsapp,
  FaYoutube,
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { MdOutlineReport } from 'react-icons/md';
import { PiInfo } from 'react-icons/pi';
import { TbClockHour3 } from 'react-icons/tb';

import { CallPopupModal } from '~/app/_components/CallPopupModal';
import RequestCallBackForm from '~/app/_components/RequestCallBackForm';
import ReportDialoge from '~/app/listing/_components/ReportDialoge';
import Navbar from '~/components/common/navbar/Navbar';
import ProductCard from '~/components/common/product-card/ProductCard';
import { Button } from '~/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '~/components/ui/carousel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { env } from '~/lib/config/env';
import { useAxios } from '~/lib/hooks/useAxios';
import { type TypeEvent, useEventAnalytic } from '~/lib/hooks/useEventAnalytic';
import { cn } from '~/lib/utils';
import { type TypeStore, type TypeStoreData } from '~/types/TStore';
import {
  type TStoreServiceCategory,
  type TStoreServiceData,
} from '~/types/TStoreServiceCategory';

import { CategoryCard } from './Catalog';

interface IStore {
  stores: TypeStoreData;
  allStore: TypeStore;
}
export default function StorePage({ stores, allStore }: IStore) {
  console.log('stores', stores);
  // console.log('allStore', allStore);

  const axios = useAxios();
  const [openRequstForm, setRequestForm] = useState(false);
  const [openCallPopup, setOpenCallPopup] = useState(false);
  const [openChatPopup, setOpenChatPopup] = useState(false);
  const plugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: false }));

  const currentYear = new Date().getFullYear();
  const experience =
    currentYear - stores.storeData.highlights.establishmentYear;

  const highlights = Object.entries(stores.storeData.highlights)
    .filter(([_, value]) => value)
    .map(([key]) => {
      const highlightsMap: Record<string, { label: string; imgSrc: string }> = {
        flexiblePricing: {
          label: 'Flexible Pricing',
          imgSrc: '/images/store/flexible.png',
        },
        emergencyService: {
          label: 'Emergency Services',
          imgSrc: '/images/store/emergency.png',
        },
        matchPrice: {
          label: 'Best of Match Price',
          imgSrc: '/images/store/beat.png',
        },
        establishmentYear: {
          label: `Establishment in ${stores.storeData.highlights.establishmentYear}`,
          imgSrc: '/images/store/emergency.png',
        },
        workGuarantee: {
          label: 'Service & Work Guaranteed',
          imgSrc: '/images/store/service.png',
        },
        smse: { label: 'Small Business', imgSrc: '/images/store/small.png' },
      };
      return highlightsMap[key];
    })
    .filter(Boolean);

  const { createAnalytic } = useEventAnalytic();

  const onClickingEvent = (
    entityType: 'BProductListing' | 'BServiceListing' | 'Store',
    event: TypeEvent
  ) => {
    const payload = {
      entity: stores._id,
      entityType,
      event: event.event,
      store: stores._id,
      subEvent: event.subEvent ?? undefined,
    };

    if (event.subEvent) {
      payload.subEvent = event.subEvent;
    }
    createAnalytic.mutate(payload);
  };

  const { data: serviceCategory } = useQuery({
    queryKey: ['serviceCategory'],
    queryFn: async () => {
      const res = await axios.get(`${env.BACKEND_URL}/listing/public/service`, {
        params: {
          page: 1,
          limit: 30,
          store: stores._id,
        },
      });
      return res.data.data as TStoreServiceCategory;
    },
  });

  const { data: productCategory } = useQuery({
    queryKey: ['productCategory'],
    queryFn: async () => {
      const res = await axios.get(`${env.BACKEND_URL}/listing/public/product`, {
        params: {
          page: 1,
          limit: 30,
          store: stores._id,
        },
      });
      return res.data.data as TStoreServiceCategory;
    },
  });

  return (
    <main className='flex h-full flex-col gap-5 bg-card pb-32 pt-16'>
      <Navbar
        title='back to listing'
        isShareIcons={true}
        onNavbarShareEvent={() => {
          onClickingEvent('Store', {
            event: 'SHARE_LISTING',
            subEvent: undefined,
            store: stores._id,
            entityType: 'Store',
            entity: stores._id,
          });
        }}
      />
      <section className='mt-2 flex flex-col gap-8 px-5'>
        <section className='flex flex-col gap-5'>
          <section className='flex w-full flex-shrink-0 gap-4 overflow-x-auto'>
            <div className='h-56 w-56 flex-shrink-0 bg-background'>
              <img
                src={`${env.CDN_URL}${stores.banner?.src}`}
                className='h-full w-full object-cover'
              />
            </div>
            <div className='h-56 w-56 flex-shrink-0 bg-background'>
              <img
                src={`${env.CDN_URL}${stores.logo.src}`}
                className='h-full w-full object-cover'
              />
            </div>
          </section>

          <h1 className='text-3xl font-bold'>{stores.storeName}</h1>

          <div className='flex items-center gap-2'>
            <img
              alt='store'
              src={`${env.CDN_URL}${stores.logo.src}`}
              className='h-8 w-8 rounded-full'
            />
            <h2 className='text-sm font-semibold'>Professional</h2>
          </div>
        </section>

        <section className='flex flex-col gap-3'>
          <h1 className='text-xl font-bold'>About</h1>
          <span className='text-sm text-secondary-foreground'>
            {stores.storeData?.about}
          </span>
        </section>

        <section className='flex flex-col gap-3'>
          <h1 className='text-xl font-bold'>How can i help?</h1>
          {stores.storeData.howCanWeHelp.map((x, i) => (
            <span key={i} className='text-sm text-secondary-foreground'>
              {x}
            </span>
          ))}
        </section>

        <section className='flex flex-col gap-4'>
          {stores.storeData.businessPhone && (
            <Button
              onClick={() => setOpenCallPopup(true)}
              variant={'ghost'}
              className='!h-12 !rounded-full !text-base'
            >
              Call
            </Button>
          )}
          {stores.storeData.contactInfo.map((x, i) => (
            <React.Fragment key={i}>
              {x.fieldType === 'NUMBER' && (
                <>
                  {x.type === 'Local Whatsapp' ||
                  x.type === 'International Whatsapp' ? (
                    <Button
                      onClick={() => setOpenCallPopup(true)}
                      variant={'ghost'}
                      className='!h-12 !rounded-full !text-base'
                    >
                      Call
                    </Button>
                  ) : null}
                </>
              )}
            </React.Fragment>
          ))}

          <Button
            onClick={() => setRequestForm(true)}
            variant={'ghost'}
            className='!h-12 !rounded-full !text-base'
          >
            Request Call Back
          </Button>

          <Button
            onClick={() => setOpenChatPopup(true)}
            variant={'ghost'}
            className='!h-12 !rounded-full !text-base'
          >
            Chat
          </Button>

          {stores.storeData.businessEmail && (
            <Link
              href={`mailto:${stores.storeData.businessEmail}`}
              className='flex !h-12 items-center justify-center !rounded-full !bg-ring !text-primary-foreground'
              onClick={() => {
                onClickingEvent('Store', {
                  event: 'EMAIL_CLICK',
                  entityType: 'Store',
                  entity: stores._id,
                  store: stores._id,
                  subEvent: undefined,
                });
              }}
            >
              Email
            </Link>
          )}

          {openCallPopup && (
            <CallPopupModal
              open={openCallPopup}
              setOpen={setOpenCallPopup}
              phone={stores.storeData.businessPhone}
              isChat={false}
              isBotim={
                stores.storeData.contactInfo.some((x) => x.type === 'Bdum')
                  ? stores.storeData.contactInfo
                      .filter((x) => x.type === 'Bdum')
                      .map((x) => x.value)
                  : null
              }
              onClickingEvent={onClickingEvent}
              store={stores._id}
              entityType='Store'
              entity={stores._id}
            />
          )}

          {openChatPopup && (
            <CallPopupModal
              isChat={true}
              isBotim={
                stores.storeData.contactInfo.some((x) => x.type === 'Bdum')
                  ? stores.storeData.contactInfo
                      .filter((x) => x.type === 'Bdum')
                      .map((x) => x.value)
                  : null
              }
              open={openChatPopup}
              setOpen={setOpenChatPopup}
              localWhatsapp={
                stores.storeData.contactInfo.find(
                  (x) => x.type === 'Local Whatsapp'
                )?.value
              }
              internalWhatSapp={
                stores.storeData.contactInfo.find(
                  (x) => x.type === 'International Whatsapp'
                )?.value
              }
              onClickingEvent={onClickingEvent}
              store={stores._id}
              entityType='Store'
              entity={stores._id}
            />
          )}
          {openRequstForm && (
            <RequestCallBackForm
              open={openRequstForm}
              setOpen={setRequestForm}
              entity={stores._id}
              store={stores.storeData._id}
              entityType={'Store'}
            />
          )}

          {stores.storeData.contactInfo.map((x, i) => {
            if (x.fieldType === null) {
              return (
                <Link
                  key={i}
                  href={x.value}
                  target='_blank'
                  className='flex !h-12 items-center justify-center !rounded-full !bg-ring !text-primary-foreground'
                  onClick={() => {
                    onClickingEvent('Store', {
                      event: 'WEBSITE_CLICK',
                      entityType: 'Store',
                      entity: stores._id,
                      store: stores._id,
                      subEvent: undefined,
                    });
                  }}
                >
                  Website
                </Link>
              );
            }
            return null;
          })}
        </section>

        {stores.storeData.contactInfo.filter((x) => x.fieldType === 'SOCIAL')
          .length > 0 && (
          <section className='mx-auto flex w-fit flex-wrap gap-5 rounded-3xl bg-background p-4'>
            {stores.storeData.contactInfo
              .filter((x) => x.fieldType === 'SOCIAL')
              .map((x, i) => {
                const socialMedia: Record<string, JSX.Element> = {
                  Facebook: (
                    <FaFacebook size={20} className='text-foreground' />
                  ),
                  Snapchat: (
                    <FaSnapchat size={20} className='text-foreground' />
                  ),
                  Instagram: (
                    <FaInstagram size={20} className='text-foreground' />
                  ),
                  LinkedIn: (
                    <FaLinkedin size={20} className='text-foreground' />
                  ),
                  Whatsapp: (
                    <FaWhatsapp size={20} className='text-foreground' />
                  ),
                  Twitter: <FaXTwitter size={20} className='text-foreground' />,
                  Pinterest: (
                    <FaPinterest size={20} className='text-foreground' />
                  ),
                  Youtube: <FaYoutube size={20} className='text-foreground' />,
                  'TikTok (For Non-Indian Sellers Only)': (
                    <FaTiktok size={20} className='text-foreground' />
                  ),
                };

                return (
                  x.type in socialMedia && (
                    <Link
                      href={x.value}
                      target='_blank'
                      key={i}
                      onClick={() => {
                        onClickingEvent('Store', {
                          event: 'SOCIAL_CLICK',
                          subEvent: undefined,
                          store: stores._id,
                          entityType: 'Store',
                          entity: stores._id,
                        });
                      }}
                    >
                      {socialMedia[x.type]}
                    </Link>
                  )
                );
              })}
          </section>
        )}

        <section className='flex flex-col gap-4 rounded-xl bg-background p-4'>
          <h1 className='flex gap-1 text-xl font-bold'>
            Highlights from the Business <PiInfo className='mt-3 text-base' />
          </h1>
          <div className='grid grid-cols-6 gap-2'>
            {highlights.map((x, index) => (
              <div key={index} className='flex flex-col items-center gap-2'>
                <img
                  src={x.imgSrc}
                  alt={x.label}
                  className='h-5 w-5 object-contain'
                />
                <p className='text-center text-[6px] font-normal'>{x.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className='flex flex-col gap-2 text-sm font-normal text-secondary-foreground '>
          <h1 className='text-xl font-bold text-foreground'>Specialties</h1>
          {stores.storeData.specialities.map((x, i) => (
            <li key={i}>{x}</li>
          ))}
        </section>

        <section className='flex flex-col gap-2 text-sm font-normal text-secondary-foreground '>
          <h1 className='text-xl font-bold text-foreground'>Experience</h1>
          <span>{experience} years</span>
        </section>

        <section className='flex flex-col gap-4 rounded-xl bg-background p-6'>
          <div className='flex items-center gap-1'>
            <TbClockHour3 className='text-2xl' />
            <h1 className='text-xl font-bold text-foreground'>
              Hours of Operation
            </h1>
          </div>
          <div className='flex flex-col gap-4'>
            <div className='flex items-center justify-between text-lg font-bold'>
              <h1 className='w-2/5'>Day</h1>
              <div className='w-3/5 text-start'>Opening Hours</div>
            </div>
            {Object.entries(stores.storeData.timings).map(
              ([day, time], index) => (
                <div
                  key={index}
                  className='flex items-center justify-between text-sm font-normal'
                >
                  <h1 className='w-2/5 capitalize'>{day}</h1>
                  <div
                    className={cn(
                      'w-3/5 rounded-full border border-border px-4 py-2 text-start text-base shadow',
                      {
                        'text-center': time === 'Closed',
                      }
                    )}
                  >
                    {time === null || time === 'Closed' ? 'Closed' : time}
                  </div>
                </div>
              )
            )}
          </div>
        </section>

        <section className='flex flex-col gap-4'>
          <h1 className='text-xl font-bold'>Catalog</h1>
          <Tabs defaultValue='category' className='w-full'>
            <TabsList className='!flex items-center justify-between !rounded-none !border-b border-b-primary'>
              <TabsTrigger value='category'>Category</TabsTrigger>
              <TabsTrigger value='service'>Service</TabsTrigger>
              <TabsTrigger value='product'>Product</TabsTrigger>
            </TabsList>
            <TabsContent value='category' className='!mt-5 flex flex-col gap-8'>
              {allStore.subCategories.map((x) => {
                console.log('slug', x.slug);
                return (
                  <section key={x._id} className='flex flex-col gap-4'>
                    <h1 className='text-lg font-bold'>{x.title}</h1>
                    <CategoryCard
                      subCategory={x.slug}
                      country={stores.country}
                    />
                  </section>
                );
              })}
            </TabsContent>
            <TabsContent value='service' className='flex flex-col gap-8'>
              <Carousel
                opts={{ loop: false, dragFree: false, align: 'start' }}
                plugins={[plugin.current]}
              >
                <CarouselContent>
                  {serviceCategory?.map((x: TStoreServiceData) => (
                    <CarouselItem key={x._id} className='basis-1/2'>
                      <ProductCard
                        key={x._id}
                        title={x.title}
                        description={x.description}
                        avgRating={x.avgRating}
                        reviews={x.reviews}
                        images={x.images.map((img) => img.src)}
                        price={x.price}
                        currency={x.currency ?? 'INR'}
                        listingType={'BServiceListing'}
                        priceType={x.pricingType}
                        slug={x.slug}
                        _id={x._id}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </TabsContent>
            <TabsContent value='product' className='flex flex-col gap-8'>
              <Carousel
                opts={{ loop: false, dragFree: false, align: 'start' }}
                plugins={[plugin.current]}
              >
                <CarouselContent>
                  {productCategory?.map((x: TStoreServiceData) => (
                    <CarouselItem key={x._id} className='basis-1/2'>
                      <ProductCard
                        key={x._id}
                        title={x.title}
                        description={x.description}
                        avgRating={x.avgRating}
                        reviews={x.reviews}
                        images={x.images.map((img) => img.src)}
                        price={x.price}
                        currency={x.currency ?? 'INR'}
                        listingType={'BServiceListing'}
                        priceType={x.pricingType}
                        slug={x.slug}
                        _id={x._id}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </TabsContent>
          </Tabs>
          <ReportDialoge entity={stores._id} entityType='Store'>
            <p className='flex items-center justify-center gap-1 text-foreground/50'>
              <MdOutlineReport className='text-2xl text-foreground/50 ' />
              Report
            </p>
          </ReportDialoge>
        </section>
      </section>
    </main>
  );
}
