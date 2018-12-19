import React from 'react';
import PropTypes from 'prop-types';
import { CSSTransitionGroup } from 'react-transition-group';
import Option from '../components/Option';

  function Result(props) {
    return (
      <div>
        <CSSTransitionGroup
          className="container result"
          component="div"
          transitionName="fade"
          transitionEnterTimeout={800}
          transitionLeaveTimeout={500}
          transitionAppear
          transitionAppearTimeout={500}
        >
          <div>
            You got <strong>{props.quizResult}</strong> correct!

          </div>
        </CSSTransitionGroup>
        <Option name="Home" side="option bottom" change={props.button}/>
      </div>


    );
  }

  Result.propTypes = {
    quizResult: PropTypes.number.isRequired,
    button: PropTypes.func.isRequired
  };

  export default Result;
