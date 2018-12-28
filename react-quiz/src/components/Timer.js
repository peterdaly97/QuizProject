import React from 'react';
import PropTypes from 'prop-types';

function Timer(props) {

  return (
    <div className="timer">
      <h3>{props.time}</h3>
    </div>
  )
}

Timer.propTypes = {
  time: PropTypes.number.isRequired
};

export default Timer;
