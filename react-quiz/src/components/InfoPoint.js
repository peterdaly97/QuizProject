import React from 'react';
import PropTypes from 'prop-types';

  function InfoPoint(props) {


    function renderPoint(key) {
      return (
        <li className="InfoPoint">
          <p>{key}</p>
        </li>
      );
    }

    return (
      <div className="infoBox">
        <h3>{props.title}</h3>
        <ul className="InfoPoint">
          {props.content.map(renderPoint)}
        </ul>
      </div>
    );
  }

  InfoPoint.propTypes = {
    title: PropTypes.string.isRequired,
    content: PropTypes.array.isRequired
  };

  export default InfoPoint;
