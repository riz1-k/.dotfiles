'use client';
import Link from 'next/link';
import React from 'react';
import { FaSearch } from 'react-icons/fa';
import { FiMenu } from 'react-icons/fi';
import { IoIosArrowBack } from 'react-icons/io';

import { Input } from '~/components/ui/input';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
} from '~/components/ui/sheet';

import CategorySheet from '../category/_components/CategorySheet';

export default function HomeNavbar() {
  return (
    <nav className='sticky -top-0.5 z-50 flex h-fit flex-col gap-3 bg-[url("/common/header-bg.png")] bg-cover bg-no-repeat px-4 py-2 text-primary-foreground '>
      <section className='flex items-center justify-between'>
        <img
          src='/common/logo_business_white.png'
          className='h-9 object-cover'
          alt='cartbuy-business-logo'
        />
        <Sheet>
          <SheetTrigger>
            <FiMenu className='rounded-full bg-popover p-1.5 text-[32px]' />
          </SheetTrigger>
          <SheetContent
            side={'right'}
            className='m-0 h-full w-full overflow-y-auto p-0'
          >
            <SheetHeader>
              <SheetDescription className='!m-0 !p-0'>
                <nav className='fixed left-0 top-0 z-50 flex w-full items-center  bg-background p-4 '>
                  <SheetClose>
                    <IoIosArrowBack className='mr-2 text-3xl' />
                  </SheetClose>
                  <Link
                    href={'/common-search'}
                    className='relative h-9 w-full rounded-full border px-4 text-foreground'
                  >
                    <FaSearch className='absolute left-0 top-0 h-9 w-9 rounded-full bg-primary p-2 text-primary-foreground' />
                    <Input
                      type='search'
                      placeholder='Search what do you need help with...'
                      className='ml-4 !h-full w-full border-0 !bg-transparent px-5 font-medium placeholder:text-xs'
                    />
                  </Link>
                </nav>
                <CategorySheet />
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </section>
    </nav>
  );
}
