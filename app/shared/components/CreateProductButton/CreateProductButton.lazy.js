import React, { lazy, Suspense } from 'react';

const LazyCreateProductButton = lazy(() => import('./CreateProductButton'));

const CreateProductButton = props => (
  <Suspense fallback={null}>
    <LazyCreateProductButton {...props} />
  </Suspense>
);

export default CreateProductButton;
