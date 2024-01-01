import React from 'react';
import PropTypes from 'prop-types';
import { Spinner } from '@shopify/polaris';

const CreateProductButton = ({ isDisabled, text }) => {
  return (
    <>
      {isDisabled === true ? <button
        disabled={true}
        className="CreateProductButton"
        type="submit">  <Spinner size="small" /></button> : <button
          className="CreateProductButton"
          type="submit">{text}</button>}
    </>
  );
}

export const links = () => [
  { rel: "stylesheet", href: styles }
]

CreateProductButton.propTypes = {};

CreateProductButton.defaultProps = {};

export default CreateProductButton;
