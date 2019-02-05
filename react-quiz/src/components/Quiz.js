import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Question from '../components/Question';
import QuestionCount from '../components/QuestionCount';
import AnswerOption from '../components/AnswerOption';
import Option from '../components/Option';
import Timer from '../components/Timer';
import Result from '../components/Result';
import Confirm from '../components/Confirm';
import Particle from '../components/Particles';

import { CSSTransitionGroup } from 'react-transition-group';

class Quiz extends Component {

  constructor() {
    super();

    this.state = {
      counter: 0,
      questionId: 1,
      question: '',
      correct: '',
      answerOptions: [],
      answer: '',
      answersCount: 0,
      result: -1,
      page: 'Confirm',
      timer: 10,
      particles: false,
      score: 0
     };

    this.renderAnswerOptions = this.renderAnswerOptions.bind(this);
    this.returnToHome = this.returnToHome.bind(this);
    this.tick = this.tick.bind(this);
    this.handleAnswerSelected = this.handleAnswerSelected.bind(this);
    this.changeToQuiz = this.changeToQuiz.bind(this);

    this.correctColour = {r:0, g:255, b:0, a:180};
    this.incorrectColour = {r:255, g:0, b:0, a:180};
    this.colour = this.correctColour;

    this.quizReceived = [];
  }

  componentWillMount() {
    this.callApi();
  }

  async callApi() {
    const quizResponse = await fetch('/quiz');
    this.quizReceived = await quizResponse.json(); 

    const shuffledAnswerOptions = this.quizReceived.map(
      (question) => this.shuffleArray(this.quizReceived[0].answers)
    );

    this.setState({
      question: this.quizReceived[0].question,
      correct: this.quizReceived[0].correct,
      answerOptions: shuffledAnswerOptions[0]
    });
  }

  tick() {
    var time = this.state.timer;
    time--;
    this.setState({
      timer: time
    })
    if(time <= 0) {
      this.timeout();
      this.setState({
        timer: 10
      })
    }

  }

  shuffleArray(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  };

  changeToQuiz() {
    this.intervalHandle = setInterval(this.tick, 1000);
    this.setState((state) => ({
      page: 'Quiz'
    }));
  }

  changeToResult() {
    this.setState((state) => ({
      page: 'Result'
    }));
  }

  setUserAnswer(answer) {
    this.setState((state) => ({
      answer: answer
    }));
    if(answer === this.state.correct) {
      this.colour = this.correctColour;
      this.setState((state) => ({
        answersCount: state.answersCount + 1,
        score: state.score + (10 * state.timer)
      }));
    }
    else {
      this.colour = this.incorrectColour;
      var array = this.state.personalInfo;
      var category = this.quizReceived[this.state.counter].category;

      this.props.append(category);
    }
  }

  setNextQuestion() {
    const counter = this.state.counter + 1;
    const questionId = this.state.questionId + 1;
    this.setState({
      counter: counter,
      questionId: questionId,
      question: this.quizReceived[counter].question,
      correct: this.quizReceived[counter].correct,
      answerOptions: this.quizReceived[counter].answers,
      answer: '',
      particles: false
    });
  }

  getResults() {
    var amount = this.state.answersCount;
    return amount;
  }

  setResults (result) {
    this.setState({ result: result });
    this.changeToResult();
  }

  timeout() {
    this.setUserAnswer("-1");
    this.nextSet();
  }

  handleAnswerSelected(event) {
    this.setUserAnswer(event.currentTarget.value);
    this.nextSet();
    this.setState({
       timer: 10,
       particles: true
      });

  }

  nextSet() {
    clearInterval(this.intervalHandle);
    this.intervalHandle = setInterval(this.tick, 1000);
    if (this.state.questionId < this.quizReceived.length) {
        setTimeout(() => this.setNextQuestion(), 300);
      } else {
        setTimeout(() => this.setResults(this.getResults()), 300);
      }
  }

  renderAnswerOptions(key) {
    return (
      <AnswerOption
        key={key}
        answerContent={key}
        answerType={key}
        answer={this.state.answer}
        questionId={this.state.questionId}
        onAnswerSelected={this.handleAnswerSelected}
      />
    );
  }

  returnToHome() {
    this.props.button();
  }

  render() {
    if(this.state.page === 'Confirm') {
      return (
        <Confirm
          home={this.returnToHome}
          confirm={this.changeToQuiz}
        />
      );
    }
    else if(this.state.page === 'Quiz') {
      return (
        <div>
          {this.state.particles && this.state.result === -1 &&
              <Particle
                particleAmount={400}
                particleSpeed={1.0}
                particleRadius={1.0}
                colour={this.colour}
              />
            }
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
            <div key={this.state.questionId}>
            <Timer time={this.state.timer}/>
              <QuestionCount counter={this.state.questionId} total={this.quizReceived.length} />
              <Question content={this.state.question}/>
      
              <ul className="answerOptions">
                {this.state.answerOptions.map(this.renderAnswerOptions)}
              </ul>
            </div>
          </CSSTransitionGroup>
        </div>
        );
    }
    else if(this.state.page === 'Result') {
      return (
        <Result
          quizScore={this.state.score}
          quizResult={this.state.result}
          button={this.props.button}
          info={this.props.info}
          username={this.props.username}
          />
      );
    }
  }
  
}

  export default Quiz;
