import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  AiFillCheckCircle,
  AiFillPlusCircle,
  AiOutlineHeart,
} from 'react-icons/ai';
import { FaRegHeart } from 'react-icons/fa';
import { IoStar } from 'react-icons/io5';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Input } from '~/components/ui/input';
import { env } from '~/lib/config/env';
import { useSession } from '~/lib/hooks/useSession';
import { useWishlist } from '~/lib/hooks/useWishlist';
import { cn } from '~/lib/utils';

import VerifiedSealCard from '../VerifiedSealCard';

interface IProductProps {
  _id: string;
  title: string;
  slug: string;
  description: string;
  images: string[];
  price: number;
  priceType: string;
  currency: string;
  avgRating?: number;
  reviews?: number;
  listingType: 'BProductListing' | 'BServiceListing' | 'Store';
  states?: string[];
  isRequstPage?: boolean;
  storeLogo?: string;
  storeName?: string;
  trustVerified?: boolean;
  storeURL?: string;
}

export default function ProductCard(props: IProductProps) {
  const {
    _id,
    title,
    description,
    avgRating,
    reviews,
    images,
    price,
    currency,
    listingType,
    states,
    priceType,
    slug,
    isRequstPage,
    storeLogo,
    storeName,
    trustVerified,
    storeURL,
  } = props;

  const [open, setOpen] = useState(false);

  const productUrl: any = useMemo(() => {
    if (listingType === 'BServiceListing') {
      return `/listing/services/${slug}`;
    } else if (listingType === 'BProductListing') {
      return `/listing/products/${slug}`;
    }
  }, [listingType, slug]);

  const { getWishlists, addListingToWishlist, removeListingFromWishlist } =
    useWishlist();
  const wishlists = getWishlists.data;

  const { data: session } = useSession();
  const [showCreateNewList, setShowCreateNewList] = useState(false);

  const [selectedWishlistId, setSelectedWishlistId] = useState<string | null>(
    null
  );

  const isItemInWishlist = useMemo(() => {
    if (wishlists) {
      const itemInWishlist = wishlists.some((wishlist) =>
        wishlist.savedListings.some((listing) => listing.listing._id === _id)
      );
      return itemInWishlist;
    }
    return false;
  }, [wishlists, _id]);

  const handleAddToWishlist = (
    wishlistId: string,
    action: 'add' | 'remove'
  ) => {
    if (!session) {
      toast.error('Please login to add to wishlists');
      return;
    }
    if (action === 'add') {
      addListingToWishlist.mutate({ wishlistId, listingId: _id, listingType });
    } else {
      removeListingFromWishlist.mutate({ wishlistId, listingId: _id });
    }
  };

  const handleWishlistAction = (wishlistId: string) => {
    setSelectedWishlistId(wishlistId);

    const isItemAlreadyInWishlist = wishlists?.some(
      (wishlist) =>
        wishlist._id === wishlistId &&
        wishlist.savedListings.some((item) => item.listing._id === _id)
    );

    if (isItemAlreadyInWishlist) {
      handleAddToWishlist(wishlistId, 'remove');
    } else {
      handleAddToWishlist(wishlistId, 'add');
    }
  };

  return (
    <main className='flex flex-col bg-background p-2'>
      <section className='relative h-[165px] w-full md:h-[280px]'>
        <Link href={productUrl}>
          <img
            alt='card'
            src={`${env.CDN_URL}${images[1]}`}
            className='h-full w-full object-cover'
          />
        </Link>

        <div className='absolute top-0 flex h-full w-full flex-col p-2'>
          <section className='flex h-8 w-full justify-between'>
            {storeLogo && (
              <div className='flex items-center gap-2 text-[9px] text-foreground'>
                <img
                  alt='logo'
                  src={`${env.CDN_URL}${storeLogo}`}
                  className='h-5 w-5 rounded-full bg-muted p-0.5'
                />
                <span className='text-[8px] font-semibold'>
                  {storeName?.split(' ')[0]}
                </span>
              </div>
            )}
            {trustVerified && (
              <section
                onClick={() => setOpen(true)}
                className='flex flex-col items-center justify-center text-[6px] font-semibold'
              >
                <img
                  alt='logo'
                  src='/common/verified-logo.svg'
                  className='h-8 w-8 rounded-full'
                />
                <span className='-mt-1 rounded-full bg-green-400 px-0.5 text-primary-foreground'>
                  Verified Profile
                </span>
              </section>
            )}
          </section>

          {open && (
            <VerifiedSealCard
              open={open}
              setOpen={setOpen}
              storeURL={storeURL}
            />
          )}

          <section className='-mr-4 mt-auto flex items-end justify-end px-4'>
            <DropdownMenu>
              <DropdownMenuTrigger className='focus:outline-none'>
                {!isItemInWishlist ? (
                  <AiOutlineHeart className='rounded-full bg-destructive p-1.5 text-3xl text-primary-foreground' />
                ) : (
                  <FaRegHeart className='rounded-full bg-destructive p-1.5 text-3xl text-primary-foreground' />
                )}
              </DropdownMenuTrigger>

              <DropdownMenuContent className='max-h-40 overflow-y-auto bg-input'>
                {wishlists?.map((x) => (
                  <DropdownMenuItem
                    key={x._id}
                    onClick={() => handleWishlistAction(x._id)}
                    className='flex items-center justify-between gap-x-3'
                  >
                    <span>{x.title}</span>
                    {x._id === selectedWishlistId && isItemInWishlist ? (
                      <AiFillCheckCircle className='text-green-500' />
                    ) : (
                      <AiFillPlusCircle className='text-blue-500' />
                    )}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem
                  onClick={() => setShowCreateNewList(true)}
                  className='flex items-center justify-between gap-x-3'
                >
                  <span>Create New List</span>
                  <Plus className='h-4 w-4' />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </section>
        </div>
      </section>

      <Dialog open={showCreateNewList} onOpenChange={setShowCreateNewList}>
        <CreateListDialog
          _id={_id}
          listingType={listingType}
          setShowCreateNewList={setShowCreateNewList}
        />
      </Dialog>

      <Link
        href={productUrl}
        className='mt-2 flex flex-col gap-0.5 text-foreground'
      >
        <div className='flex items-center'>
          <h1 className='line-clamp-1 text-clip text-sm font-bold md:text-lg'>
            {title}
          </h1>
          {isRequstPage && (
            <h2
              className={cn(
                'flex items-end justify-end text-[8px] font-semibold',
                {
                  'text-ring': listingType === 'BProductListing',
                  'text-destructive': listingType !== 'BProductListing',
                }
              )}
            >
              {listingType === 'BProductListing' ? 'Product' : 'Service'}
            </h2>
          )}
        </div>

        {!isRequstPage && (
          <div className='my-1 flex items-center'>
            {Array.from({ length: 5 }).map((_, index) => (
              <IoStar
                key={index}
                className={`text-xs ${avgRating && index < avgRating ? 'text-yellow-400' : 'text-gray-300'}`}
              />
            ))}
            <span className='ml-2 text-[9px] text-secondary-foreground md:text-sm'>
              {avgRating?.toFixed(1)} ({reviews} reviews)
            </span>
          </div>
        )}
        {states && (
          <h3 className='text-[10px] font-semibold md:text-sm'>
            Areas Served:{states[0]}
          </h3>
        )}
        <h3 className='text-[10px] font-bold text-destructive md:text-sm'>
          {currency} {price} {priceType}
        </h3>
        <h3 className='line-clamp-2 text-[10px] font-medium text-secondary-foreground md:text-sm'>
          {description}
        </h3>
      </Link>
    </main>
  );
}

interface ICreate {
  _id: string;
  listingType: string;
  setShowCreateNewList: (value: boolean) => void;
}

const CreateListDialog = ({
  _id,
  listingType,
  setShowCreateNewList,
}: ICreate) => {
  const { createWishlist, getWishlists } = useWishlist();
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: { title: '' },
    resolver: zodResolver(
      z.object({
        title: z.string().min(1, 'minimum 3 and maximum 20 characters'),
      })
    ),
  });

  const onSubmit = form.handleSubmit((data) => {
    createWishlist.mutate({
      title: data.title,
      listing: { listingId: _id, listingType },
    });
    queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    getWishlists.refetch();
    setShowCreateNewList(false);
  });

  return (
    <DialogContent className='w-11/12 rounded-md'>
      <DialogHeader>
        <DialogTitle>Create a New Wishlist</DialogTitle>
      </DialogHeader>
      <form onSubmit={onSubmit} className='space-y-4'>
        <Input
          {...form.register('title')}
          placeholder='Wishlist Name'
          error={form.formState.errors.title?.message}
        />
        <Button type='submit' variant={'ghost'}>
          Create
        </Button>
      </form>
    </DialogContent>
  );
};
