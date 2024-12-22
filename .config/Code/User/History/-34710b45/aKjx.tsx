'use client';
import { SlidersHorizontal } from 'lucide-react';
import React from 'react';
import { FaSearch } from 'react-icons/fa';
import { FiMenu } from 'react-icons/fi';

import { SearchSheets } from '~/components/common/navbar/SearhSheets';
import { Input } from '~/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '~/components/ui/sheet';

export default function HomeNavbar() {
  const [show, setShow] = React.useState(false);
  return (
    <nav className='sticky -top-0.5 z-50 flex min-h-[24vh] flex-col gap-6 bg-[url("/common/login.png")] bg-cover bg-no-repeat p-3 text-primary-foreground'>
      <div className='flex items-center justify-between'>
        <img
          src='/common/white-nav-logo.png'
          alt='cartibuy-business-logo'
          className='h-10 object-cover'
        />
        <FiMenu className='rounded-full bg-popover p-1.5 text-4xl' />
      </div>
      <h1 className='px-10 text-3xl font-semibold'>
        Search Business, <br /> Services or Products
      </h1>
      <form className='relative mx-5 rounded-full border-2 border-chart-1 bg-background px-4 text-ring'>
        <FaSearch className='absolute top-2' size={24} />
        <Input
          type='search'
          placeholder='Search what do you need help with...'
          icon={
            <Sheet open={show} onOpenChange={setShow}>
              <SheetTrigger className='outline-none'>
                <SlidersHorizontal size={20} />
              </SheetTrigger>
              <SheetContent side='top' className='h-screen overflow-y-auto p-0'>
                <SearchSheets setShow={setShow} />
              </SheetContent>
            </Sheet>
          }
          className='w-full border-0 !bg-transparent px-10 placeholder:text-ring-foreground'
        />
      </form>
    </nav>
  );
}
