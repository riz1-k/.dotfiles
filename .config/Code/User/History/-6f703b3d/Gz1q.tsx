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

export default function WebsiteLinksDialog(props: {
  websiteLinks: string[];
  children: React.ReactNode;
  eventCall: () => Promise<void>;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const clickMutation = useMutation({
    mutationFn: async (link: string) => {
      await props.eventCall();
      return link;
    },
    onSettled: (link) => {
      setIsOpen(false);
      window.open(link, '_blank', 'noopener,noreferrer');
    },
  });

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>{props.children}</DrawerTrigger>
      <DrawerContent>
        <span className='mx-auto mb-2 mt-6 h-2 w-[100px] rounded-full bg-muted' />
        <DrawerHeader>
          <DrawerTitle>Website Links</DrawerTitle>
        </DrawerHeader>
        <section className='flex flex-col gap-4 p-5'>
          {props.websiteLinks.map((link, index) => (
            <div key={link} className='flex items-center justify-between'>
              <span className='text-sm font-semibold'>Website {index + 1}</span>
              <Button
                type='button'
                variant='outline'
                onClick={() => clickMutation.mutate('link')}
                isLoading={clickMutation.isPending}
                className='border-none text-blue-500 underline shadow-none'
              >
                {link}
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
