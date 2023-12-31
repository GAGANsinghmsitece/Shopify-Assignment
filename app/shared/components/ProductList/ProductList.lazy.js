import React, { lazy, Suspense } from 'react';

const LazyProductList = lazy(() => import('./ProductList'));

const ProductList = props => (
  <Suspense fallback={null}>
    <LazyProductList {...props} />
  </Suspense>
);

export default ProductList;
