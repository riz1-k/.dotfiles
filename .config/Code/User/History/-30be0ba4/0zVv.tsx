import {
  createFileRoute,
  Link,
  LinkOptions,
  Navigate,
} from '@tanstack/react-router';

export const Route = createFileRoute('/_dashboard/dashboard/account/')({
  component: ProfileDash,
});

import { BiSolidBookmarkAlt } from 'react-icons/bi';
import { TbSettingsCheck } from 'react-icons/tb';

import { BsCollectionPlayFill, BsQuestionCircleFill } from 'react-icons/bs';
import { FaAngleRight, FaUser } from 'react-icons/fa6';
import { FiLogOut } from 'react-icons/fi';
import { MdOutlineSettingsSuggest } from 'react-icons/md';

import { useSession } from '@/lib/hooks/useSession';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { useActiveTrustSubscription } from '../trust-seal/-utils/useTrustSeal';

export default function ProfileDash() {
  const session = useSession();
  if (!session.isLoading && !session.data) {
    return <Navigate to='/login' />;
  }

  const trustCert = useActiveTrustSubscription();

  const profileArr: {
    icon: React.ReactNode;
    title: string;
    path: LinkOptions['to'];
  }[] = [
    {
      icon: <FaUser size={24} />,
      title: 'My Profile',
      path: '/dashboard/account/profile',
    },
    {
      icon: <FaUser size={24} />,
      title: 'Business Profile',
      path: '/dashboard/account/business',
    },
    {
      icon: <BsCollectionPlayFill size={24} />,
      title: 'My Subscription',
      path: '/dashboard/my-subscription',
    },
    {
      icon: <BiSolidBookmarkAlt size={24} />,
      title: 'My Billing',
      path: '/dashboard/account/profile',
    },
    {
      icon: trustCert.data ? (
        <TbSettingsCheck size={24} />
      ) : (
        <BsCollectionPlayFill size={24} />
      ),
      title: trustCert.data ? 'My Trust Cert' : 'Get Verified Seal',
      path: trustCert.data
        ? '/dashboard/trust-seal/get-verified-seal'
        : '/dashboard/trust-seal',
    },
    {
      icon: <MdOutlineSettingsSuggest size={24} />,
      title: 'My Reviews',
      path: '/dashboard/reviews/$id',
    },
    {
      icon: <BsQuestionCircleFill size={24} />,
      title: 'Help & Support',
      path: '/dashboard/account/profile',
    },
  ];

  return (
    <section className='flex flex-col gap-6 px-4 py-10 '>
      {profileArr.map((profileItem) => (
        <>
          <Link
            key={profileItem.path}
            to={profileItem.path}
            className={cn('flex items-center justify-between px-4')}
          >
            <span className='flex items-center gap-5'>
              {profileItem.icon}
              <span className='text-base font-bold'>{profileItem.title}</span>
            </span>
            <FaAngleRight size={12} />
          </Link>
          <Separator />
        </>
      ))}
      <button
        onClick={() => {
          session.signOut();
        }}
        className='flex items-center gap-5 px-4'
      >
        <FiLogOut size={24} />
        <span className='text-base font-bold'>Logout</span>
      </button>
    </section>
  );
}
