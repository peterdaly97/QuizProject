import React from 'react';
import PropTypes from 'prop-types';
import { CSSTransitionGroup } from 'react-transition-group';
import Option from '../components/Option';


  function Result(props) {

    function changeToInfo() {
      props.button();
      props.info();
    }

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
            Your score: <strong>{props.quizScore}</strong>
          </div>
        </CSSTransitionGroup>
        <Option symbol="fa fa-home" name=" Home" side="option right" change={props.button}/>
        <Option symbol="fa fa-info" name=" Info" side="option left" change={changeToInfo}/>
      </div>


    );
  }

  Result.propTypes = {
    quizScore: PropTypes.number.isRequired,
    quizResult: PropTypes.number.isRequired,
    button: PropTypes.func.isRequired,
    info: PropTypes.func.isRequired
  };

  export default Result;
