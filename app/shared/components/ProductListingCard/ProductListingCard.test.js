import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ProductListingCard from './ProductListingCard';

describe('<ProductListingCard />', () => {
  test('it should mount', () => {
    render(<ProductListingCard />);
    
    const productListingCard = screen.getByTestId('ProductListingCard');

    expect(productListingCard).toBeInTheDocument();
  });
});