import React from 'react';
import PropTypes from 'prop-types';
import InfoPoint from '../components/InfoPoint';
import Option from '../components/Option';
import Search from '../components/Search'

function Info(props) {

  function renderInfoPoints(key) {
    return (
      <InfoPoint
        key={key}
        title={key.title}
        content={key.content}
      />
    );
  }

  return (
    <div>
      <Option name="Home" side="option top" change={props.button}/>
      <Search onChange={props.searchFunc}/>
      <ul className="info">
        {props.info.map(renderInfoPoints)}
      </ul>
    </div>
  );
}

Info.propTypes = {
  info : PropTypes.array.isRequired,
  button : PropTypes.func.isRequired,
  searchFunc : PropTypes.func.isRequired
};


export default Info;
