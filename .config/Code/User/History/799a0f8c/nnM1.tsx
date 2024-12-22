'use client';

import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { MdAddCall } from 'react-icons/md';

import { Button, buttonVariants } from '~/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '~/components/ui/drawer';
import { type TSubEvent } from '~/lib/hooks/useEventAnalytic';
import { type TAPP_NAME } from '~/lib/utils';
import { type ContactInfo } from '~/types/TProducts';

export const APP_URL: Record<TAPP_NAME, string> = {
  'International Phone': '/images/social-logos/International Call.svg',
  'Business Phone': '/images/social-logos/International Call.svg',
  'International Whatsapp': '/images/social-logos/Whatsapp International.svg',
  Botim: '/images/social-logos/Botim.svg',
  IMO: '/images/social-logos/IMO.svg',
  Viber: '/images/social-logos/Viber.svg',
  Line: '/images/social-logos/Line.svg',
  Telegram: '/images/social-logos/Telegram.svg',
  Skype: '/images/social-logos/Skype.svg',
  Signal: '/images/social-logos/Signal.svg',
  Whatsapp: '/images/social-logos/Whatsapp.svg',
};

export default function CallLinksDialog(props: {
  contactInfoList: ContactInfo[];
  children: React.ReactNode;
  eventCall: ({ subEvent }: { subEvent: TSubEvent }) => Promise<void>;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const clickMutation = useMutation({
    mutationFn: async (link: { subEvent: TSubEvent; link: string }) => {
      await props.eventCall({ subEvent: link.subEvent });
      return link.link;
    },
    onSettled: (link) => {
      setIsOpen(false);
      window.open(link, '_blank', 'noopener,noreferrer');
    },
  });

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>{props.children}</DrawerTrigger>
      <DrawerContent className='rounded-t-3xl border-none bg-black/50 backdrop-blur-sm'>
        <span className='mx-auto mb-2 mt-6 h-2 w-[100px] rounded-full bg-muted' />
        <DrawerHeader>
          <DrawerTitle className='text-white'>Connect by Calling</DrawerTitle>
        </DrawerHeader>
        <section className='flex flex-col gap-4 p-5'>
          {props.contactInfoList.map((link) => (
            <div
              key={link.value}
              className='flex !w-full items-center justify-between'
            >
              <div className='flex items-center gap-4'>
                <img
                  src={APP_URL[link.type]}
                  alt={link.type}
                  height={26}
                  width={26}
                />
                <h6 className='text-lg font-medium text-white'>{link.type}</h6>
              </div>
              <Button
                onClick={() =>
                  clickMutation.mutate({
                    subEvent:
                      link.fieldType === 'Whatsapp' ? 'WHATSAPP' : 'PHONE',
                    link: link.value,
                  })
                }
                disabled={clickMutation.isPending}
                className='flex !h-6 items-center justify-between gap-2 !rounded-md bg-green-500 text-[11px] text-white'
              >
                <MdAddCall className='text-sm' />
                <span>VOICE</span>
              </Button>
            </div>
          ))}
        </section>
        <DrawerFooter>
          <DrawerClose className={buttonVariants({ variant: 'destructive' })}>
            Close
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
