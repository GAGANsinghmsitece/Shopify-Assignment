import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  LegacyCard,
  ResourceList,
  Avatar,
  ResourceItem,
  Text,
  Listbox,
  DataTable,
} from '@shopify/polaris';

const ProductList = ({ products }) => {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    let currentProducts = [];
    for (let i = 0; i < products.length; ++i) {
      const { node } = products[i];
      const { id, title } = node;
      const price = products[i]?.node?.variants?.edges[0]?.node?.price;
      console.log(price);
      let currentProduct = [];
      currentProduct.push(title);
      currentProduct.push(price);
      currentProducts.push(currentProduct);
    }
    setRows(currentProducts);
  }, [products]);
  return (
    <DataTable
      columnContentTypes={[
        'text',
        'numeric'
      ]}
      headings={[
        'Product',
        'Price'
      ]}
      rows={rows}
    />
  );
};

ProductList.propTypes = {};

ProductList.defaultProps = {};

export default ProductList;
