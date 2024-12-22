/* eslint-disable jsx-a11y/alt-text */
'use client';
import Autoplay from 'embla-carousel-autoplay';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { MdArrowBack, MdArrowForward } from 'react-icons/md';

import Navbar from '~/components/common/navbar/Navbar';
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
import { env } from '~/lib/config/env';
import { type TypeEvent, useEventAnalytic } from '~/lib/hooks/useEventAnalytic';
import formatFileSize from '~/lib/utils';
import { type TService } from '~/types/TService';

import { CallPopupModal } from '../../_components/CallPopupModal';
import RequestCallBackForm from '../../_components/RequestCallBackForm';
import RatingCard from './RatingCard';

interface IProp {
  services: TService;
  slug: string;
}
export default function ServiceListing({ services, slug }: IProp) {
  console.log('services', services);
  const [openCallPopup, setOpenCallPopup] = useState(false);
  const [openChatPopup, setOpenChatPopup] = useState(false);
  const [openRequstForm, setRequestForm] = useState(false);
  const plugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: false }));

  const currentYear = new Date().getFullYear();
  const experience =
    currentYear - services.store.storeData.highlights.establishmentYear;

  const [previewImage, setPreviewImage] = useState(false);
  const [selectedProjectImg, setSelectedProjectImg] = useState<string[]>([]);
  const [selectedImg, setSelectedImg] = useState(0);

  const imageClickHandler = (images: string[], index: number) => {
    setSelectedProjectImg(images);
    setSelectedImg(index);
    setPreviewImage(true);
  };

  const { createAnalytic } = useEventAnalytic();

  const onClickingEvent = (
    entityType: 'BProductListing' | 'BServiceListing' | 'Store',
    event: TypeEvent
  ) => {
    const payload: {
      entity: string;
      entityType: 'BProductListing' | 'BServiceListing' | 'Store';
      event:
      | 'SEARCH_APPEARANCE'
      | 'LISTING_CLICK'
      | 'SHARE_LISTING'
      | 'FAQ_CLICK'
      | 'FEATURED_PROJECT_CLICK'
      | 'CALL_CLICK'
      | 'CHAT_CLICK'
      | 'EMAIL_CLICK'
      | 'WEBSITE_CLICK'
      | 'SOCIAL_CLICK'
      | 'RATE_LISTING';
      subEvent?:
      | 'WHATSAPP'
      | 'PHONE'
      | 'EXCELLENT'
      | 'GOOD'
      | 'AVERAGE'
      | 'POOR'
      | 'BAD';
      store: string;
      additionalInfo: string;
    } = {
      entity: services._id,
      entityType,
      event: event.event,
      store: services.store._id,
      subEvent: event.subEvent ?? undefined,
      additionalInfo: event.additionalInfo,
    };

    if (event.subEvent) {
      payload.subEvent = event.subEvent;
    }
    createAnalytic.mutate(payload);
  };

  return (
    <main className='flex h-full flex-col gap-5 bg-card pb-20 pt-16'>
      <Navbar
        title='back to search'
        isShareIcons={true}
        isHeartIcons={true}
        onNavbarShareEvent={() => {
          onClickingEvent('BServiceListing', {
            event: 'SHARE_LISTING',
            subEvent: undefined,
            store: services.store._id,
            entityType: 'BServiceListing',
            entity: services._id,
          });
        }}
      />
      <section className='mt-2 flex flex-col gap-8 px-5'>
        <section className='flex flex-col gap-5'>
          <div className='flex w-full flex-shrink-0 gap-4 overflow-x-auto'>
            {services.images.map((item, i) => (
              <div
                key={i}
                className='verflow-x-auto relative h-56 w-56 flex-shrink-0 bg-background'
              >
                <img
                  src={`${env.CDN_URL}${item.src}`}
                  className='h-full w-full object-cover'
                />
              </div>
            ))}
          </div>
          <h1 className='text-3xl font-bold'>{services.title}</h1>
          <div className='flex flex-col gap-1'>
            <Link
              href={`/listing/services/${slug}/reviews`}
              className='mb-1 flex items-center'
            >
              <div className='flex'>
                {Array.from([1, 2, 3, 4, 5]).map((_, index) => (
                  <FaStar key={index} className='text-lg text-chart-1/40' />
                ))}
              </div>
              <span className='pl-2 text-sm text-secondary-foreground'>
                5.0 (12345 reviews)
              </span>
            </Link>
            <span className='font-bold text-destructive-foreground'>
              $ {services.price} {services.pricingType}
            </span>
          </div>
        </section>

        <section className='flex flex-col gap-3'>
          <h1 className='text-xl font-bold'>Description</h1>
          <span className='text-sm text-secondary-foreground'>
            {services.description}
          </span>
        </section>

        <section className='flex flex-col gap-3 text-sm font-normal text-secondary-foreground '>
          <h1 className='text-xl font-bold text-foreground'>Hightlights</h1>
          {services.highlights.map((x, i) => (
            <div key={i} className='flex items-center gap-2'>
              <span className='h-1 w-1 rounded-full bg-foreground/50'></span>
              <span className='w-[95%]'>{x}</span>
            </div>
          ))}
        </section>

        <section className='flex flex-col gap-4'>
          <h1 className='text-xl font-bold text-foreground'>Payment Methods</h1>
          {services.paymentMethods.map((x, i) => (
            <Button
              key={i}
              variant={'ghost'}
              className='flex !h-12 justify-start !rounded-full !bg-background  text-foreground/50'
            >
              {x}
            </Button>
          ))}
        </section>

        <section className='flex flex-col gap-4'>
          {services.store.storeData.contactInfo.map((x, i) => (
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
          {services.store.storeData.businessEmail && (
            <Link
              href={`mailto:${services.store.storeData.businessEmail}`}
              className='flex !h-12 items-center justify-center !rounded-full !bg-ring !text-primary-foreground'
              onClick={() => {
                onClickingEvent('BProductListing', {
                  event: 'EMAIL_CLICK',
                  entityType: 'BServiceListing',
                  entity: services._id,
                  store: services.store._id,
                  subEvent: undefined,
                });
              }}
            >
              Email
            </Link>
          )}
        </section>

        {openRequstForm && (
          <RequestCallBackForm
            open={openRequstForm}
            setOpen={setRequestForm}
            entity={services._id}
            store={services.store._id}
            entityType={'BServiceListing'}
          />
        )}
        {openCallPopup && (
          <CallPopupModal
            open={openCallPopup}
            setOpen={setOpenCallPopup}
            phone={services.store.storeData.businessPhone}
            isChat={false}
            isBotim={
              services.store.storeData.contactInfo.some(
                (x) => x.type === 'Bdum'
              )
                ? services.store.storeData.contactInfo
                  .filter((x) => x.type === 'Bdum')
                  .map((x) => x.value)
                : null
            }
            onClickingEvent={onClickingEvent}
            store={services.store._id}
            entityType='BServiceListing'
            entity={services._id}
          />
        )}

        {openChatPopup && (
          <CallPopupModal
            isChat={true}
            isBotim={
              services.store.storeData.contactInfo.some(
                (x) => x.type === 'Bdum'
              )
                ? services.store.storeData.contactInfo
                  .filter((x) => x.type === 'Bdum')
                  .map((x) => x.value)
                : null
            }
            open={openChatPopup}
            setOpen={setOpenChatPopup}
            localWhatsapp={
              services.store.storeData.contactInfo.find(
                (x) => x.type === 'Local Whatsapp'
              )?.value
            }
            internalWhatSapp={
              services.store.storeData.contactInfo.find(
                (x) => x.type === 'International Whatsapp'
              )?.value
            }
            onClickingEvent={onClickingEvent}
            store={services.store._id}
            entityType='BServiceListing'
            entity={services._id}
          />
        )}

        <section className='flex flex-col gap-3'>
          <h1 className='text-xl font-bold text-foreground'>
            Featured Projects
          </h1>
          <Carousel
            opts={{ loop: false, dragFree: false, align: 'start' }}
            plugins={[plugin.current]}
          >
            <CarouselContent>
              {services.featuredProjects.map((x) => (
                <CarouselItem
                  onClick={() => {
                    onClickingEvent('BServiceListing', {
                      event: 'FEATURED_PROJECT_CLICK',
                      subEvent: undefined,
                      store: services.store._id,
                      entityType: 'BServiceListing',
                      entity: services._id,
                      additionalInfo: x.projectName,
                    });
                  }}
                  key={x._id}
                  className='basis-1/2'
                >
                  <span className='text-sm font-normal text-foreground/50'>
                    {x.projectName}
                  </span>
                  <img
                    className='h-40 w-full cursor-pointer object-cover'
                    alt={x.projectMedia[0].meta.fileName}
                    src={`${env.CDN_URL}${x.projectMedia[0].src}`}
                    onClick={() =>
                      imageClickHandler(
                        x.projectMedia.map(
                          (media) => `${env.CDN_URL}${media.src}`
                        ),
                        0
                      )
                    }
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </section>
        {previewImage && (
          <PreviewImageDialoge
            previewImage={previewImage}
            setPreviewImage={setPreviewImage}
            images={selectedProjectImg}
            selectedImg={selectedImg}
            setSelectedImg={setSelectedImg}
          />
        )}

        <section className='flex flex-col gap-3 text-sm font-normal text-secondary-foreground '>
          <h1 className='text-xl font-bold text-foreground'>Specialities</h1>
          {services.store.storeData.specialities.map((x, i) => (
            <li key={i}>{x}</li>
          ))}
        </section>

        <section className='flex flex-col gap-3 text-sm font-normal text-secondary-foreground '>
          <h1 className='text-xl font-bold text-foreground'>Experience</h1>
          <span>{experience} Years</span>
        </section>

        {services.faqs.length > 0 && (
          <section className='flex flex-col gap-3'>
            <h1 className='text-xl font-bold text-foreground'>FAQs</h1>
            <Accordion
              type='single'
              collapsible
              className='flex flex-col gap-4'
              onClick={() => {
                onClickingEvent('BServiceListing', {
                  event: 'FAQ_CLICK',
                  subEvent: undefined,
                  store: services.store._id,
                  entityType: 'BServiceListing',
                  entity: services._id,
                });
              }}
            >
              {services.faqs.map((x, i) => (
                <AccordionItem
                  value={x.question}
                  key={i}
                  className='rounded-3xl bg-background px-4'
                >
                  <AccordionTrigger className='text-lg font-bold text-foreground'>
                    {x.question}
                  </AccordionTrigger>
                  <AccordionContent className='!text-lg !font-normal'>
                    {x.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        )}

        <section className='flex flex-col gap-3'>
          <h1 className='text-xl font-bold text-foreground'>Media Documents</h1>
          {services.catalogs.map((x) => (
            <div
              key={x._id}
              className='flex items-center gap-2 rounded-xl bg-background p-4'
            >
              <img
                src={`${env.CDN_URL}${x.catalogMedia?.src}`}
                alt={x.catalogType}
                className='h-9 w-9 rounded-full object-contain'
              />
              <div className='flex flex-col gap-1'>
                <h2 className='text-xs font-semibold'>
                  {x.catalogMedia?.meta.fileName}
                </h2>
                <span className='text-xs text-foreground/50'>
                  {formatFileSize(x?.catalogMedia?.meta?.fileSize ?? 0)}
                </span>
              </div>
            </div>
          ))}
        </section>

        <RatingCard
          entityType={'BServiceListing'}
          ratingId={services?._id}
          ratingStoreId={services?.store?._id}
        />

        <section className='flex flex-col gap-5'>
          <h1 className='text-3xl font-bold'>{services.store.storeName} </h1>
          <div className='mb-1 flex items-center'>
            <div className='flex'>
              {Array.from([1, 2, 3, 4, 5]).map((_, index) => (
                <FaStar key={index} className='text-lg text-chart-1/40' />
              ))}
            </div>
            <span className='pl-2 text-sm text-secondary-foreground'>
              5.0 (12345 reviews)
            </span>
          </div>
          <div className='flex items-center gap-2'>
            <img
              src={`${env.CDN_URL}${services.store.logo.src}`}
              alt='logo'
              className='h-8 w-8 rounded-full'
            />
            <h2 className='text-sm font-semibold'>Professional</h2>
          </div>
          <section className='flex flex-col gap-3'>
            <h1 className='text-xl font-bold'>About</h1>
            <span className='text-sm text-secondary-foreground'>
              {services.store.storeData.about}
            </span>
            <Link
              href={`/store/${services.store.storeURL}`}
              className='!ml-auto flex !h-10 items-center !rounded-full bg-ring px-5 text-primary-foreground'
            >
              View Store
            </Link>
          </section>
        </section>
      </section>
    </main >
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
                  className={`h-20 w-20 cursor-pointer object-contain ${selectedImg === index ? 'border-2 border-primary' : ''
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
