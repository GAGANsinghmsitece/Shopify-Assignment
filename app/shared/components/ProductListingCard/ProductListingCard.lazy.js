import React, { lazy, Suspense } from 'react';

const LazyProductListingCard = lazy(() => import('./ProductListingCard'));

const ProductListingCard = props => (
  <Suspense fallback={null}>
    <LazyProductListingCard {...props} />
  </Suspense>
);

export default ProductListingCard;
