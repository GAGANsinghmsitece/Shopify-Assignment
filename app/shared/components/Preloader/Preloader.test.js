import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Preloader from './Preloader';

describe('<Preloader />', () => {
  test('it should mount', () => {
    render(<Preloader />);
    
    const preloader = screen.getByTestId('Preloader');

    expect(preloader).toBeInTheDocument();
  });
});