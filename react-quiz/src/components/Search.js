import React from 'react';
import PropTypes from 'prop-types';

function Search(props) {

  function onChange(e) {
    props.onChange(e.target.value);
  }

 return (
    <input
      className={props.class}
      placeholder="Search for..."
      onChange={onChange}
    />
  )
}

Search.propTypes = {
  onChange : PropTypes.func.isRequired,
  class : PropTypes.string.isRequired
};

export default Search;
