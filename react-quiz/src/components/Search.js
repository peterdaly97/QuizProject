import React from 'react';
import PropTypes from 'prop-types';

function Search(props) {

  function onChange(e) {
    props.onChange(e.target.value);
  }

 return (
    <input
      placeholder="Search for..."
      onChange={onChange}
    />
  )
}

Search.propTypes = {
  onChange : PropTypes.func.isRequired
};

export default Search;
