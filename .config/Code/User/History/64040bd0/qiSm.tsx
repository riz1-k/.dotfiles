import { Link, useSearch } from '@tanstack/react-router';
import { useCatalog } from '../-hooks/useCatalog';

export function CatalogList() {
  const search = useSearch({ from: '/dashboard/catalog/' });
  const { data: catalog } = useCatalog();
  return (
    <ul>
      {catalog?.map((listing) => (
        <Link
          to={
            search.listType === 'product'
              ? '/dashboard/catalog/product-listing/edit/$id'
              : '/dashboard/catalog/service-listing/edit/$id'
          }
          key={listing._id}
          params={{ id: listing._id }}
          search={{
            step: 'main-info',
          }}
        >
          <li>{listing.title}</li>
        </Link>
      ))}
    </ul>
  );
}
