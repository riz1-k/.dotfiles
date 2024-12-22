'use client';

import { useState } from 'react';

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '~/components/ui/drawer';

export default function WebsiteLinksDialog(props: {
  websiteLinks: string[];
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>{props.children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Website Links</DrawerTitle>
        </DrawerHeader>
        <section className='flex flex-col gap-4'>
          {props.websiteLinks.map((link, index) => (
            <div key={link} className='flex items-center justify-between'>
              <span className='text-sm font-semibold'>Website {index + 1}</span>
              <a
                href={link}
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-500 underline'
              >
                {link}
              </a>
            </div>
          ))}
        </section>
      </DrawerContent>
    </Drawer>
  );
}
