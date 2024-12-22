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

import { IoIosNotifications } from 'react-icons/io';

import { useSession } from '@/lib/hooks/useSession';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

export default function ProfileDash() {
  const session = useSession();
  if (!session.isLoading && !session.data) {
    return <Navigate to='/login' />;
  }

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
    icon: <BsCollectionPlayFill size={24} />,
    title: 'Get Verified Seal',
    path: '/dashboard/account/profile',
  },
  {
    icon: <TbSettingsCheck size={24} />,
    title: 'My Trust Cert',
    path: '/dashboard/account/profile',
  },
  {
    icon: <IoIosNotifications size={24} />,
    title: 'Notifications',
    path: '/dashboard/account/profile',
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
