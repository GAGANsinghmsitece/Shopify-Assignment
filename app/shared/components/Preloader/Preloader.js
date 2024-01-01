import React from 'react';
import PropTypes from 'prop-types';
import { Spinner, Text } from '@shopify/polaris';

const Preloader = () => (
  <div className="FetchListPreloader">
    <Spinner accessibilityLabel="Spinner example" size="small" />
    <Text as="p">
      Fetching Products
    </Text>
  </div>
);

export const links = () => [
  { rel: "stylesheet", href: styles }
]


Preloader.propTypes = {};

Preloader.defaultProps = {};

export default Preloader;
