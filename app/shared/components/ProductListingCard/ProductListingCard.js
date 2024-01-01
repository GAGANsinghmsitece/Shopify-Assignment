import React from 'react';
import PropTypes from 'prop-types';
import { BlockStack, Card, Layout, Text } from '@shopify/polaris';
import Preloader from '../Preloader/Preloader';
import ProductList from '../ProductList/ProductList';

const ProductListingCard = ({ products }) => (
  <Layout.Section>
    <Card>
      <BlockStack gap={500}>
        <BlockStack gap={200}>
          <Text as="h2" variant="headingMd">
            Existing Products
          </Text>
        </BlockStack>
        <BlockStack gap={200}>
          {products === null ?
            <Preloader /> : <ProductList products={products} />}
        </BlockStack>
      </BlockStack>
    </Card>
  </Layout.Section>
);

ProductListingCard.propTypes = {};

ProductListingCard.defaultProps = {};

export const links = () => [
  { rel: "stylesheet", href: styles }
]


export default ProductListingCard;
