import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate, useParams, useSearch } from '@tanstack/react-router';
import { useLeads } from '../-utils/useLeads';

export function LeadsToggle() {
  const search = useSearch({
    from: '/_dashboard/dashboard/stores/$id/leads/',
  });
  const navigate = useNavigate();
  const storeId = useParams({
    from: '/_dashboard/dashboard/stores/$id/leads/',
  }).id;
  const leadsQuery = useLeads();
  return (
    <Tabs
      value={search.leadType}
      onValueChange={(value) => {
        navigate({
          to: '/dashboard/stores/$id/leads',
          search: {
            ...search,
            leadType: value as typeof search.leadType,
          },
          params: { id: storeId },
        }).then(() => {
          leadsQuery.refetch();
        });
      }}
    >
      <TabsList>
        <TabsTrigger value='LISTING'>Listing Leads</TabsTrigger>
        <TabsTrigger value='STORE'>Store Leads</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
