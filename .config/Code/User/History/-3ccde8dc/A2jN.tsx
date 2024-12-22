'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { IoIosArrowBack } from 'react-icons/io';

import { Input } from '~/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { cn } from '~/lib/utils';
import {
  type ServiceChildren,
  type TProductCategory,
  type TServiceCategory,
  type TServiceData,
} from '~/types/TCategory';

interface CategoryProps {
  serviceData: TServiceCategory;
  productData: TProductCategory;
  isSidebarSheer?: boolean;
}

export default function Category({
  serviceData,
  productData,
  isSidebarSheer,
}: CategoryProps) {
  const router = useRouter();
  const [active, setActive] = useState('BServiceListing');
  const [childrenCat, setChildrenCat] = useState<ServiceChildren[]>([]);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);

  const divideArrintoThreeRow = (array: TServiceData[], size: number) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };

  const serviceRows = serviceData ? divideArrintoThreeRow(serviceData, 3) : [];
  const productRows = productData ? divideArrintoThreeRow(productData, 3) : [];

  const categoryHandler = (children: ServiceChildren[], rowIndex: number) => {
    if (selectedRow === rowIndex && childrenCat === children) {
      setChildrenCat([]);
      setSelectedRow(null);
    } else {
      setChildrenCat(children);
      setSelectedRow(rowIndex);
    }
  };

  return (
    <section className='flex flex-col pb-44'>
      {!isSidebarSheer && (
        <nav className='sticky top-0 z-50 flex w-full items-center bg-background p-4'>
          <IoIosArrowBack
            onClick={() => router.back()}
            className='mr-2 text-3xl'
          />
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
      )}

      <Tabs
        onValueChange={(value) => {
          setActive(value);
          setChildrenCat([]);
          setSelectedRow(null);
        }}
        defaultValue='BServiceListing'
      >
        <TabsContent
          value='BServiceListing'
          className='flex !w-full flex-col gap-4 p-4'
        >
          {serviceRows.length === 0 ? (
            <p className='flex h-[70vh] items-center justify-center text-xl'>
              Data not found for services.
            </p>
          ) : (
            serviceRows.map((row, rowIndex) => (
              <React.Fragment key={rowIndex}>
                <main className='grid w-full grid-cols-3 gap-2'>
                  {row.map((x) => (
                    <CategoryCard
                      key={x._id}
                      category={x}
                      categoryHandler={() =>
                        categoryHandler(x.children, rowIndex)
                      }
                      isSelected={
                        selectedRow === rowIndex &&
                        childrenCat.length > 0 &&
                        childrenCat === x.children
                      }
                    />
                  ))}
                </main>
                {childrenCat.length > 0 && selectedRow === rowIndex && (
                  <section className='mt-5 flex w-full flex-col gap-4 rounded-lg border border-foreground/30 p-4'>
                    <div
                      className={cn('transition-all duration-300', {
                        ' opacity-100': childrenCat.length > 0,
                        'opacity-0': childrenCat.length === 0,
                      })}
                    >
                      {childrenCat.map((x) => (
                        <ChildrenCard
                          key={x._id}
                          child={x}
                          listingType='BServiceListing'
                        />
                      ))}
                    </div>
                  </section>
                )}
              </React.Fragment>
            ))
          )}
        </TabsContent>

        <TabsContent
          value='BProductListing'
          className='-mt-4 flex !w-full flex-col gap-4 px-4'
        >
          {productRows.length === 0 ? (
            <p className='flex h-[70vh] items-center justify-center text-xl'>
              Data not found for products.
            </p>
          ) : (
            productRows.map((row, rowIndex) => (
              <React.Fragment key={rowIndex}>
                <main className='grid w-full grid-cols-3 gap-2'>
                  {row.map((x) => (
                    <CategoryCard
                      key={x._id}
                      category={x}
                      categoryHandler={() =>
                        categoryHandler(x.children, rowIndex)
                      }
                      isSelected={
                        selectedRow === rowIndex &&
                        childrenCat.length > 0 &&
                        childrenCat === x.children
                      }
                    />
                  ))}
                </main>
                {childrenCat.length > 0 && selectedRow === rowIndex && (
                  <section className='mt-5 flex w-full flex-col gap-4 rounded-lg border border-foreground/30 p-4'>
                    <div
                      className={cn('transition-all duration-300', {
                        'opacity-100': childrenCat.length > 0,
                        'opacity-0': childrenCat.length === 0,
                      })}
                    >
                      {childrenCat.map((x) => (
                        <ChildrenCard
                          key={x._id}
                          child={x}
                          listingType='BProductListing'
                        />
                      ))}
                    </div>
                  </section>
                )}
              </React.Fragment>
            ))
          )}
        </TabsContent>

        <div
          className={cn('fixed bottom-24 z-50 flex w-full md:bottom-32', {
            'bottom-10': isSidebarSheer,
          })}
        >
          <TabsList className='mx-auto flex h-10 !w-2/5 gap-3 !rounded-full border !bg-secondary !p-1 shadow md:h-14 md:!w-3/12'>
            <TabsTrigger
              value='BServiceListing'
              className={cn(
                '!border-none pl-2 !text-xs !font-bold !text-secondary-foreground',
                {
                  '!h-full w-full rounded-full bg-ring !text-primary-foreground':
                    active === 'BServiceListing',
                }
              )}
            >
              Service
            </TabsTrigger>
            <TabsTrigger
              value='BProductListing'
              className={cn(
                '!border-none pr-2 !text-xs !font-bold !text-secondary-foreground ',
                {
                  '!h-full w-full rounded-full bg-ring !text-primary-foreground':
                    active === 'BProductListing',
                }
              )}
            >
              Product
            </TabsTrigger>
          </TabsList>
        </div>
      </Tabs>
    </section>
  );
}

interface ICategory {
  category: TServiceData;
  categoryHandler: (children: ServiceChildren[]) => void;
  isSelected?: boolean;
}

function CategoryCard({
  category,
  categoryHandler,
  isSelected,
}: ICategory & { isSelected: boolean }) {
  const { title, children } = category;
  return (
    <section
      onClick={() => children.length > 0 && categoryHandler(children)}
      className={cn(
        'flex h-40 w-full flex-col overflow-hidden rounded-lg border transition-all duration-300 md:h-56',
        {
          'translate-y-4 transform border-2 border-ring': isSelected,
          'border-border': !isSelected,
        }
      )}
    >
      <h1 className='w-full break-words px-2 pt-3 text-sm font-semibold md:w-3/4 md:text-base'>
        {title}
      </h1>
      <div className='imgCurve h-1/2'></div>
    </section>
  );
}

interface IChild {
  child: ServiceChildren;
  listingType: 'BServiceListing' | 'BProductListing';
}
const ChildrenCard = ({ child, listingType }: IChild) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (child) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [child]);

  return (
    <Link
      href={
        listingType === 'BProductListing'
          ? '/category/product/' + child.slug
          : 'category/service/' + child.slug
      }
      className='grid w-full grid-cols-6 items-center gap-2 overflow-hidden'
    >
      <div className='col-span-1 my-2 h-11 w-11 rounded-full bg-foreground/20 md:h-16 md:w-16'></div>

      <div
        className={cn(
          'col-span-5 text-base font-semibold md:text-xl',
          'transition-all duration-300 ease-in-out',
          {
            'translate-y-4 opacity-0': !isVisible,
            'translate-y-0 opacity-100': isVisible,
          }
        )}
      >
        {child.title}
      </div>
    </Link>
  );
};
