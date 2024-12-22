'use client';
import { FaWhatsapp } from 'react-icons/fa';
import { IoCallSharp } from 'react-icons/io5';
import { MdAddCall } from 'react-icons/md';

import { Button } from '~/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
} from '~/components/ui/sheet';
import { type TypeEvent } from '~/lib/hooks/useEventAnalytic';

interface IProps {
  isChat?: boolean;
  open: boolean;
  phone?: string;
  localWhatsapp?: string;
  isBotim?: any;
  internalWhatSapp?: string;
  setOpen: (open: boolean) => void;
  onClickingEvent: (
    entityType: 'BProductListing' | 'BServiceListing' | 'Store',
    event: TypeEvent
  ) => void;
  store: string;
  entityType: 'BProductListing' | 'BServiceListing' | 'Store';
  entity: string;
}
export function CallPopupModal({
  isChat,
  open,
  setOpen,
  phone,
  localWhatsapp,
  internalWhatSapp,
  isBotim,
  onClickingEvent,
  store,
  entity,
  entityType,
}: IProps) {
  console.log('whatsapp', localWhatsapp, internalWhatSapp);
  console.log('phone', phone);
  console.log('isbotim', isBotim);

  console.log('erntt', entityType);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side='bottom'
        className='rounded-t-[2rem] !border-0 bg-[#1d1b1ba3] !p-3 !outline-none'
      >
        <SheetHeader>
          <SheetDescription className='flex w-full flex-col items-center gap-6 text-xl font-semibold !text-primary-foreground'>
            <h1 className='h-1 w-10 rounded-full bg-secondary' />
            <h1 className='!text-base font-normal'>
              {!isChat ? 'Connect by Calling' : 'Connecting by Chatting'}
            </h1>

            <div className='flex !w-full items-center justify-between'>
              <div className='flex items-center gap-4'>
                <FaWhatsapp className='whatsapp-color rounded-full p-1.5 text-4xl' />
                <h1 className='text-lg font-medium'>Whatsapp</h1>
              </div>

              {!isChat ? (
                <div className='flex items-center gap-4'>
                  <Button
                    onClick={() => {
                      if (localWhatsapp) {
                        window.open(`https://wa.me/${localWhatsapp}`);
                      } else {
                        window.open(`https://wa.me/${internalWhatSapp}`);
                      }
                      onClickingEvent(entityType, {
                        event: 'CALL_CLICK',
                        entityType,
                        entity,
                        store,
                        subEvent: 'WHATSAPP',
                      });
                    }}
                    className='whatsapp-color flex !h-6 items-center justify-between gap-2 !rounded-md !text-[9px]'
                  >
                    <MdAddCall className='text-sm' />
                    <span>VOICE</span>
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => {
                    if (localWhatsapp) {
                      window.open(`https://wa.me/${localWhatsapp}`);
                    } else {
                      window.open(`https://wa.me/${internalWhatSapp}`);
                    }
                    onClickingEvent(entityType, {
                      event: 'CHAT_CLICK',
                      entityType,
                      entity,
                      store,
                      subEvent: 'WHATSAPP',
                    });
                  }}
                  className='whatsapp-color flex !h-6 items-center justify-between gap-2 !rounded-md !text-[9px]'
                >
                  <img src='/common/message.png' alt='msg' />
                  <span>MESSAGE</span>
                </Button>
              )}
            </div>

            <h1 className='h-0.5 w-full rounded-full bg-primary-foreground/40' />

            <div className='flex !w-full items-center justify-between'>
              <div className='flex items-center gap-4'>
                <IoCallSharp className='whatsapp-color rounded-full p-1.5 text-4xl' />
                <h1 className='text-lg font-medium'>
                  {!isChat ? 'Direct Call' : 'Text Message'}
                </h1>
              </div>

              {!isChat ? (
                <div className='flex items-center gap-4'>
                  <Button
                    onClick={() => {
                      window.open(`tel:${phone}`);
                      onClickingEvent(entityType, {
                        event: 'CALL_CLICK',
                        entityType,
                        entity,
                        store,
                        subEvent: 'PHONE',
                      });
                    }}
                    className='whatsapp-color flex !h-6 items-center justify-between gap-2 !rounded-md !text-[9px]'
                  >
                    <MdAddCall className='text-sm' />
                    <span>VOICE</span>
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => {
                    window.open(`sms:${phone}`);
                    onClickingEvent(entityType, {
                      event: 'CHAT_CLICK',
                      entityType,
                      entity,
                      store,
                      subEvent: 'WHATSAPP',
                    });
                  }}
                  className='whatsapp-color flex !h-6 items-center justify-between gap-2 !rounded-md !text-[9px]'
                >
                  <img src='/common/message.png' alt='msg' />
                  <span>MESSAGE</span>
                </Button>
              )}
            </div>
            <h1 className='h-0.5 w-full rounded-full bg-primary-foreground/40' />

            {isBotim && (
              <div className='flex !w-full items-center justify-between'>
                <div className='flex items-center gap-4'>
                  <img
                    src='/common/botim.png'
                    alt='bottim'
                    className='h-10 w-10 rounded-md'
                  />
                  <h1 className='text-lg font-medium'>Bottim</h1>
                </div>

                {!isChat ? (
                  <div className='flex items-center gap-4'>
                    <Button
                      onClick={() => {
                        window.open(`https://bottim.com/${isBotim}`);
                        onClickingEvent(entityType, {
                          event: 'CALL_CLICK',
                          entityType,
                          entity,
                          store,
                          subEvent: 'PHONE',
                        });
                      }}
                      className='whatsapp-color flex !h-6 items-center justify-between gap-2 !rounded-md !text-[9px]'
                    >
                      <MdAddCall className='text-sm' />
                      <span>VOICE</span>
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => {
                      window.open(`https://bottim.com/${isBotim}`);
                      onClickingEvent(entityType, {
                        event: 'CHAT_CLICK',
                        entityType,
                        entity,
                        store,
                        subEvent: 'WHATSAPP',
                      });
                    }}
                    className='whatsapp-color flex !h-6 items-center justify-between gap-2 !rounded-md !text-[9px]'
                  >
                    <img src='/common/message.png' alt='msg' />
                    <span>MESSAGE</span>
                  </Button>
                )}
              </div>
            )}
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
