import Navbar from '~/components/common/navbar/Navbar';
import ProductReviewPage from './_components/ProductReviewPage';


interface TypeParamsProps {
    params: {
        slug: string;
    };
}

export default function Review({ params }: TypeParamsProps) {
    const { slug } = params;
    return (
        <div className='flex flex-col'>
            <Navbar title='Back' />
            <ProductReviewPage slug={slug} />
        </div>
    );
}
