import React from 'react';
import PropTypes from 'prop-types';
import Option from './Option';

  function InfoPoint(props) {


    function renderPoint(key) {
      return (
        <li className="InfoPoint">
          <p>{key}</p>
        </li>
      );
    }

    function deleteMe() {
      props.deleteFunc(props.title[0]);
    }

    return (
      <div className="infoBox">
        <h3>{props.title}</h3>
        {props.page == "Personalised" &&
          <Option symbol="fa fa-close fa-2x" side="option challenge2" change= {() => {deleteMe()}}/>
        }
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
