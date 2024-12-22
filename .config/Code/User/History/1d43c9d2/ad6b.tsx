'use client';

import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

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
import { type ContactInfo } from '~/types/TProducts';

import { APP_URL } from './call-links-dialog';

export default function ChatLinksDialog(props: {
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

  console.log('contactInfoList', props.contactInfoList);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>{props.children}</DrawerTrigger>
      <DrawerContent className='rounded-t-3xl border-none bg-black/50 backdrop-blur-sm'>
        <span className='mx-auto mb-2 mt-6 h-2 w-[100px] rounded-full bg-muted' />
        <DrawerHeader>
          <DrawerTitle className='text-white'>Connect by Chatting</DrawerTitle>
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
                  height={30}
                  width={30}
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
                <img
                  src='/common/message.png'
                  alt='msg'
                  height={15}
                  width={15}
                />
                <span>MESSAGE</span>
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
