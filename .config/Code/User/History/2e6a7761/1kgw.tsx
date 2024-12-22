import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  AiFillCheckCircle,
  AiFillPlusCircle,
  AiOutlineHeart,
} from 'react-icons/ai';
import { FaHeart } from 'react-icons/fa';
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
import { type Hit } from '~/types/TSearch';

export default function ProductCard({ props }: { props: Hit }) {
  const { _source: source, _id } = props;

  const {
    title,
    description,
    avgRating,
    reviews,
    images,
    price,
    currency,
    storeLogo,
    storeName,
    listingType,
    states,
    priceType,
    slug,
  } = source;

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
  const [isItemInWishlist, setIsItemInWishlist] = useState(false);

  useEffect(() => {
    if (wishlists) {
      const itemInWishlist = wishlists.some((wishlist) =>
        wishlist.savedListings.some((listing) => listing.listing._id === _id)
      );
      setIsItemInWishlist(itemInWishlist);
    }
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
      setIsItemInWishlist(true);
    } else {
      removeListingFromWishlist.mutate({ wishlistId, listingId: _id });
      setIsItemInWishlist(false);
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

        <div className='absolute -top-2 flex h-full w-full flex-col'>
          <div className='flex h-8 w-full justify-between'>
            <div className='flex items-center gap-2 text-[9px] text-foreground'>
              <img
                alt='logo'
                src={`${env.CDN_URL}${storeLogo}`}
                className='h-5 w-5 rounded-full'
              />
              <span>{storeName}</span>
            </div>
          </div>
          <div className='mt-auto flex items-end justify-end px-4'>
            <DropdownMenu>
              <DropdownMenuTrigger className='focus:outline-none'>
                {!isItemInWishlist ? (
                  <AiOutlineHeart className='rounded-full bg-destructive p-1.5 text-3xl text-primary-foreground' />
                ) : (
                  <FaHeart className='rounded-full bg-destructive p-1.5 text-3xl text-primary-foreground' />
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
          </div>
        </div>
      </section>

      <Dialog open={showCreateNewList} onOpenChange={setShowCreateNewList}>
        <CreateListDialog
          selectedVariant={props}
          listingType={listingType}
          setShowCreateNewList={setShowCreateNewList}
        />
      </Dialog>

      <Link
        href={productUrl}
        className='mt-2 flex flex-col gap-0.5 text-foreground'
      >
        <h1 className='line-clamp-1 text-clip text-sm font-bold md:text-lg'>
          {title}
        </h1>
        <div className='my-1 flex items-center'>
          {Array.from({ length: 5 }).map((_, index) => (
            <IoStar
              key={index}
              className={`text-xs ${index < avgRating ? 'text-yellow-400' : 'text-gray-300'}`}
            />
          ))}
          <span className='ml-2 text-[9px] text-secondary-foreground md:text-sm'>
            {avgRating.toFixed(1)} ({reviews} reviews)
          </span>
        </div>
        <h3 className='text-[10px] font-semibold md:text-sm'>
          Areas Served:{states[0]}
        </h3>
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

const CreateListDialog = ({
  selectedVariant,
  listingType,
  setShowCreateNewList,
}: {
  listingType: string;
  selectedVariant: Hit;
  setShowCreateNewList: (value: boolean) => void;
}) => {
  const { createWishlist } = useWishlist();
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
      listing: { listingId: selectedVariant._id, listingType },
    });
    queryClient.invalidateQueries({ queryKey: ['wishlist'] });
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
