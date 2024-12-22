
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { FaStar } from 'react-icons/fa';
import { z } from 'zod';

import Navbar from '~/components/common/navbar/Navbar';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { env } from '~/lib/config/env';
import { useAxios } from '~/lib/hooks/useAxios';
import { cn } from '~/lib/utils';
import plainAxios from 'axios';


export const FILE_TYPE = [
    'application/pdf',
    'image/jpg',
    'image/png',
    'image/jpeg',
    'image/webp',
] as const;

export const imageFileSchema = z.object(
    {
        _id: z.string().length(24, 'File is required'),
        src: z.string(),
        fileType: z.enum(FILE_TYPE, {
            errorMap: () => ({
                message: `Only the following file types are supported: ${FILE_TYPE.join(
                    ', '
                )}`,
            }),
        }),
        meta: z.object({
            fileName: z.string(),
            fileSize: z.coerce.number(),
        }),
    },
    {
        message: 'File is required',
    }
);

export type TFile = z.infer<typeof imageFileSchema>;

const reviewSchema = z.object({
    listing: z.string().length(24),
    listingType: z.enum(['BProductListing', 'BServiceListing']),
    email: z.string().email().optional(),
    name: z.string().min(3).max(255).optional(),
    subject: z.string().min(3).max(500),
    rating: z.number().min(1).max(5),
    professionalism: z.number().min(1).max(5),
    timeliness: z.number().min(1).max(5),
    valueForMoney: z.number().min(1).max(5),
    serviceOuality: z.number().min(1).max(5),
    isRecommended: z.boolean(),
    comment: z.string().min(20).max(5000).optional(),
    images: z.array(imageFileSchema).optional(),
});

type ReviewType = z.infer<typeof reviewSchema>;

export default function CreateReview({ slug }: { slug: string }) {
    const axios = useAxios();

    const reviewForm = useForm<ReviewType>({
        defaultValues: {
            listing: slug,
            listingType: 'BProductListing',
            subject: '',
            rating: 1,
            professionalism: 1,
            timeliness: 1,
            valueForMoney: 1,
            serviceOuality: 1,
            isRecommended: false,
            comment: '',
            images: [],
        },
        resolver: zodResolver(reviewSchema),
    });

    const { register, setValue, watch, formState, getValues } = reviewForm;

    const onSubmitReview = useMutation({
        mutationFn: async (data: ReviewType) => { try {
                const res = await axios.post(`${env.BACKEND_URL}/review`, transformPayload(data));
                console.log('Review submitted successfully:', res.data);
            } catch (error) {
                console.error('Error submitting review:', error);
            }
        },
    });

    const starsArray = Array.from({ length: 5 }, (_, i) => i + 1);
    console.log('watch', watch());

    const fileInputRef = useRef<HTMLInputElement>(null);
    const imageUploader = async (files: File[]) => {
        try {
            const uploadPromises = files.map(async (file) => {
                const { data } = await axios.post<{
                    data: TFileUploadResponse;
                }>(
                    `${env.BACKEND_URL}/file/review/${slug}`,
                    {
                        fileName: file.name,
                        fileSize: file.size,
                        fileType: file.type,
                    },
                    {
                        params: {
                            listingType: 'BProductListing',
                        },
                    }
                );
                const imageUrl = data.data.url;

                await plainAxios.put(imageUrl, file, {
                    headers: {
                        contentType: file.type,
                    },
                    withCredentials: false,
                });

                return data.data.file
            });

            const uploadedFiles = await Promise.all(uploadPromises);
            setValue('images', [...(getValues('images') ?? []), ...uploadedFiles]);

        } catch (error) {
            console.log('Error uploading images:', error);
        }
    };

    return (
        <form
            className="py-16"
            onSubmit={(e) => {
                e.preventDefault();
                const formData = reviewForm.getValues();
                console.log('Submitting Review Data:', formData);
                onSubmitReview.mutate(formData);
            }}
        >
            <Navbar title="Back" />
            <section className="flex flex-col gap-6 p-4">
                <div>
                    <Input
                        placeholder="Enter a subject for your review"
                        className="bg-background shadow"
                        {...register('subject')}
                    />
                    {formState.errors.subject && (
                        <p className="text-destructive text-sm">{formState.errors.subject.message}</p>
                    )}
                </div>
                <div className="flex items-center justify-between">
                    <h1 className="text-lg font-semibold">Overall Rating</h1>
                    <div className="flex">
                        {starsArray.map((value) => (
                            <FaStar
                                key={value}
                                className={cn(
                                    'text-lg cursor-pointer',
                                    watch('rating') >= value ? 'text-ring' : 'text-gray-300'
                                )}
                                onClick={() => setValue('rating', value)}
                            />
                        ))}
                    </div>
                </div>

                <h1 className="text-lg font-semibold">Detailed Rating</h1>
                {['professionalism', 'timeliness', 'valueForMoney', 'serviceOuality'].map((field) => (
                    <div key={field} className="flex items-center justify-between">
                        <h1 className="capitalize">{field.replace(/([A-Z])/g, ' $1')}</h1>
                        <div className="flex">
                            {starsArray.map((value) => (
                                <FaStar
                                    key={value}
                                    className={cn(
                                        'text-lg cursor-pointer',
                                        watch(field) >= value ? 'text-ring' : 'text-gray-300'
                                    )}
                                    onClick={() => setValue(field as keyof ReviewType, value)}
                                />
                            ))}
                        </div>
                        {formState.errors[field as keyof ReviewType] && (
                            <p className="text-destructive text-sm">
                                {formState.errors[field as keyof ReviewType]?.message}
                            </p>
                        )}
                    </div>
                ))}


                <div className="flex flex-col gap-2">
                    <h1 className="font-normal">Review</h1>
                    <Textarea
                        placeholder="Write your review here"
                        className="!h-[15vh] text-lg shadow placeholder:text-foreground"
                        {...register('comment')}
                    />
                    {formState.errors.comment && (
                        <p className="text-destructive text-sm">{formState.errors.comment.message}</p>
                    )}
                </div>

                <section className="min-h-[15vh] rounded-xl bg-background p-6 shadow">
                    <section className="relative flex flex-col items-center gap-5">
                        <img src="/common/upload-file.png" alt="Upload" className="h-8 w-8 object-contain" />
                        <p className="text-xs text-secondary-foreground">
                            Drag and drop or choose <br /> a file from your computer
                        </p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/*"
                            disabled={watch('images')?.length === 5}
                            className="absolute inset-0 opacity-0"
                            onChange={async (e) => {
                                if (e.target.files) {
                                    const limitedFiles = Array.from(e.target.files).slice(0, 5 - (watch('images')?.length ?? 0));
                                    await imageUploader(limitedFiles);
                                }
                                e.target.value = '';
                            }}
                        />
                        <button
                            type="button"
                            disabled={5 - (watch('images')?.length ?? 0) === 0}
                            onClick={() => fileInputRef.current?.click()}
                            className="flex h-10 items-center justify-center !rounded-md bg-ring px-4 text-primary-foreground"
                        >
                            Upload Images (up to 5)
                        </button>
                    </section>
                </section>

                {
                    (watch('images')?.length ?? 0) > 0 && (
                        <section className="flex flex-wrap gap-2">
                            {watch('images')?.map((image) => (
                                <img
                                    key={image._id}
                                    src={env.CDN_URL + image.src}
                                    alt={image.fileType}
                                    className="h-20 w-20 rounded-md object-cover"
                                />
                            ))}
                        </section>
                    )
                }

                <h1 className="text-lg font-bold">Recommendation</h1>
                <section className="flex items-center justify-between text-lg">
                    <h2>Would you recommend this service?</h2>
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            className={cn('!h-8 !rounded-full', !watch('isRecommended') && 'bg-red-200')}
                            onClick={() => setValue('isRecommended', false)}
                        >
                            No
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            className={cn('!h-8 !rounded-full', watch('isRecommended') && 'bg-green-200')}
                            onClick={() => setValue('isRecommended', true)}
                        >
                            Yes
                        </Button>
                    </div>
                </section>

                <section className="w-full pt-8">
                    <Button
                        type="submit"
                        className="w-full"
                    >
                        Submit
                    </Button>
                </section>
            </section>
        </form>
    );
}

type TFileUploadResponse = {
    file: TFile;
    url: string;
    viewUrl: string;
}