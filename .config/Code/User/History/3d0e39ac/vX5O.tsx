import React from 'react'
import CreateServiceReview from '~/app/listing/services/[slug]/reviews/_components/CreateServiceReview';

interface TypeParamsProps {
    params: {
        slug: string;
    };
}
export default function Review({ params }: TypeParamsProps) {
    const { slug } = params
    return (<CreateServiceReview slug={slug} />)
}
