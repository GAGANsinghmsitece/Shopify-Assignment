import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ProductList from './ProductList';

describe('<ProductList />', () => {
  test('it should mount', () => {
    render(<ProductList />);
    
    const productList = screen.getByTestId('ProductList');

    expect(productList).toBeInTheDocument();
  });
});