import React from 'react';
import PropTypes from 'prop-types';

  function Option(props) {
    return (
      <div>
        <button className={props.side} onClick={props.change}>{props.name}<i class={props.symbol}></i></button>
      </div>
    );
  }

  Option.propTypes = {
    name: PropTypes.string.isRequired,
    side: PropTypes.string.isRequired,
    change: PropTypes.func.isRequire,
    symbol: PropTypes.string
  };

  export default Option;
