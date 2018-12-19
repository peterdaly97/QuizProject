import React from 'react';
import PropTypes from 'prop-types';

  function InfoPoint(props) {
    return (
      <li className="InfoPoint">
        <p>{props.content}</p>
      </li>
    );
  }

  InfoPoint.propTypes = {
    content: PropTypes.string.isRequired
  };

  export default InfoPoint;
