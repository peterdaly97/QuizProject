import React from 'react';
import PropTypes from 'prop-types';
import InfoPoint from '../components/InfoPoint';
import Option from '../components/Option';

function Info(props) {

  function renderInfoPoints(key) {
    return (
      <InfoPoint
        key={key}
        content={key}
      />
    );
  }

  return (
    <div>
      <Option name="Home" side="option top" change={props.button}/>
      <ul className="info">
        {props.content.map(renderInfoPoints)}
      </ul>
    </div>
  );
}

Info.propTypes = {
  content: PropTypes.array.isRequired,
  button : PropTypes.func.isRequired
};


export default Info;
