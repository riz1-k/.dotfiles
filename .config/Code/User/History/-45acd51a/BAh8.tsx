import React from 'react'
import CreateProductReview from '../_components/CreateProductReview';

interface TypeParamsProps {
    params: {
        slug: string;
    };
}
export default function Review({ params }: TypeParamsProps) {
    const { slug } = params
    return (<CreateProductReview slug={slug} />)
}
