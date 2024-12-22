import Navbar from '~/components/common/navbar/Navbar';
import ServiceReviewPage from './_components/ServiceReviewPage';


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
            <ServiceReviewPage slug={slug} />
        </div>
    );
}
