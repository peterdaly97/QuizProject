import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Question from '../components/Question';
import QuestionCount from '../components/QuestionCount';
import AnswerOption from '../components/AnswerOption';
import Option from '../components/Option';
import Timer from '../components/Timer';
import Result from '../components/Result';

import { CSSTransitionGroup } from 'react-transition-group';

class Quiz extends Component {

  constructor() {
    super();

    this.renderAnswerOptions = this.renderAnswerOptions.bind(this);
    this.returnToHome = this.returnToHome.bind(this);
  }

  renderAnswerOptions(key) {
    return (
      <AnswerOption
        key={key}
        answerContent={key}
        answerType={key}
        answer={this.props.answer}
        questionId={this.props.questionId}
        onAnswerSelected={this.props.onAnswerSelected}
      />
    );
  }

  returnToHome() {
    this.props.button();
  }

  render() {
    if(this.props.quizResult === -1) {
      return (
        <div>
      
          <Option symbol="fa fa-home fa-3x" side="option top" change={this.returnToHome}/>
          <CSSTransitionGroup
            className="container"
            component="div"
            transitionName="fade"
            transitionEnterTimeout={800}
            transitionLeaveTimeout={500}
            transitionAppear
            transitionAppearTimeout={500}
          >
            <div key={this.props.questionId}>
            <Timer time={this.props.timer}/>
              <QuestionCount counter={this.props.questionId} total={this.props.questionTotal} />
              <Question content={this.props.question}/>
      
              <ul className="answerOptions">
                {this.props.answerOptions.map(this.renderAnswerOptions)}
              </ul>
            </div>
          </CSSTransitionGroup>
        </div>
        );
    }
    else {
      return (
        <Result
          quizScore={this.props.quizScore}
          quizResult={this.props.quizResult}
          button={this.props.button}
          info={this.props.info}/>
      );
    }
  }
  
}

  export default Quiz;
