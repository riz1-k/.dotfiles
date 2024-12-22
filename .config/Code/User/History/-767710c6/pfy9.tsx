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
import {
  TCreateProductSchema,
  TProductListingUpdateSchema,
} from '../../-utils/product-schema';
import useProductCategories, {
  TProductCategoryType,
} from '../../-utils/useListings';

interface Props {
  disabled?: boolean;
  form:
    | UseFormReturn<TProductListingUpdateSchema>
    | UseFormReturn<TCreateProductSchema>;
  categoryType: TProductCategoryType;
}

export default function CategorySelector(props: Props) {
  const { data: productCategories, isLoading } = useProductCategories({
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
  }, [liveValues.category, productCategories]);

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

  console.log('category', liveValues.category);
  console.log('subCategory', liveValues.subCategory);
  console.log('productCategories', productCategories);
  console.log('subCategoryList', subCategoryList);

  return (
    <div className='flex flex-col gap-5'>
      {productCategories && (
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
            <SelectTrigger>
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
      )}
      {subCategoryList && (
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
            <SelectTrigger disabled={!subCategoryList?.length}>
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
      )}
    </div>
  );
}
