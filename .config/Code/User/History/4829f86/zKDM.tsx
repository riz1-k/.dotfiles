import { FormField } from '@/components/global/FormField';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import useProductCategory, {
  TProductCategoryType,
} from '../-hooks/useProductCategory';
import {
  TCreateProductSchema,
  TProductListingUpdateSchema,
} from '../-utils/products-listing.schema';
import { TCreateServiceSchema } from '../service-listing/-utils/service-listing.schema';

interface Props {
  disabled?: boolean;
  form:
    | UseFormReturn<TProductListingUpdateSchema>
    | UseFormReturn<TCreateProductSchema>
    | UseFormReturn<TCreateServiceSchema>;
  categoryType: TProductCategoryType;
}

export default function CategorySelector(props: Props) {
  const { data: productCategories, isLoading } = useProductCategory({
    categoryType: props.categoryType,
  });
  const form = props.form;
  const liveValues = form.watch();

  const subCategoryList = useMemo(() => {
    if (!liveValues.category || !productCategories) return null;
    const categoryChildren = productCategories.find(
      (category) => category._id === liveValues.category
    )?.children;

    if (!categoryChildren) return null;

    return categoryChildren;
  }, [liveValues.category]);

  if (isLoading) return <Skeleton className='rounded-md w-full h-6' />;
  if (!productCategories)
    return (
      <div className='bg-destructive/10 border border-destructive px-4 rounded-md py-2 flex items-center'>
        <span className='text-destructive text-sm'>
          Error loading categories, Please try again later
        </span>
      </div>
    );

  const errors = form.formState.errors;

  return (
    <div className='flex flex-col gap-5'>
      <FormField
        label='Category'
        error={errors.category?.message}
        name='category'
      >
        <Select
          value={liveValues.category}
          onValueChange={(value) => {
            // @ts-expect-error It is what it is
            form.setValue('category', value);
            form.trigger('category');
          }}
        >
          {/* @ts-ignore */}
          <SelectTrigger {...form.register('category')}>
            <SelectValue placeholder='Select a category' />
          </SelectTrigger>
          <SelectContent>
            {productCategories.map((product) => (
              <SelectItem key={product._id} value={product._id}>
                {product.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>
      <FormField
        label='Sub-Category'
        error={errors.subCategory?.message}
        name='subCategory'
      >
        <Select
          value={liveValues.subCategory}
          onValueChange={(value) => {
            // @ts-expect-error It is what it is
            form.setValue('subCategory', value);
            form.trigger('subCategory');
          }}
        >
          <SelectTrigger
            disabled={!subCategoryList?.length}
            // @ts-ignore
            {...form.register('subCategory')}
          >
            <SelectValue placeholder='Select Sub Category' />
          </SelectTrigger>
          <SelectContent>
            {subCategoryList?.map((product) => (
              <SelectItem key={product._id} value={product._id}>
                {product.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>
    </div>
  );
}
