import { createFileRoute, useParams } from '@tanstack/react-router';
import { BusinessProfileForm } from './-components/business-form';
import PageHeader from '@/components/global/PageHeader';
import {
  ApprovedStoreKycDialog,
  RejectedStoreKycDialog,
  RevalidateStoreKycDialog,
} from './-components/business-action-dialogs';
import StoreTabs from '../-components/StoreTabs';

export const Route = createFileRoute(
  '/_dashboard/dashboard/users/stores/$id/business-profile'
)({
  component: BusinessProfile,
});

function BusinessProfile() {
  const storeId = useParams({
    from: '/_dashboard/dashboard/users/stores/$id/business-profile',
  }).id;
  return (
    <main className='space-y-5'>
      <PageHeader breadcrumbs={[{ label: 'Business Profile', link: null }]} />
      <StoreTabs storeId={storeId} currentTab='profile' />
      <BusinessProfileForm />
      <div className='flex justify-end gap-5'>
        <ApprovedStoreKycDialog storeId={storeId} />
        <RejectedStoreKycDialog storeId={storeId} />
        <RevalidateStoreKycDialog storeId={storeId} />
      </div>
    </main>
  );
}
