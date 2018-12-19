import React, { Component } from 'react';
import quizQuestions from './api/quizQuestions';
import infoContent from './api/infoContent';
import Quiz from './components/Quiz';
import Info from './components/Info';
import Result from './components/Result';
import Option from './components/Option';
import logo from './svg/coeliacLogo.png';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
     counter: 0,
     questionId: 1,
     question: '',
     correct: '',
     answerOptions: [],
     answer: '',
     answersCount: 0,
     result: 0,
     page: ''
    };

    this.handleAnswerSelected = this.handleAnswerSelected.bind(this);
    this.changeToHome = this.changeToHome.bind(this);
    this.componentWillMount = this.componentWillMount.bind(this);
    this.changeToQuiz = this.changeToQuiz.bind(this);
    this.changeToInfo = this.changeToInfo.bind(this);
  }

  componentWillMount() {
    const shuffledAnswerOptions = quizQuestions.map((question) => this.shuffleArray(question.answers));

    this.setState({
      info: infoContent[0].info,
      question: quizQuestions[0].question,
      correct: quizQuestions[0].correct,
      answerOptions: shuffledAnswerOptions[0],
      counter: 0,
      answer: '',
      questionId: 1,
      answersCount: 0,
      result: 0,
      page: "Home"
    });
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

  setUserAnswer(answer) {
    this.setState((state) => ({
      answer: answer
    }));
    if(answer === this.state.correct) {
      this.setState((state) => ({
        answersCount: state.answersCount + 1,
      }));
    }
  }

  setNextQuestion() {
    const counter = this.state.counter + 1;
    const questionId = this.state.questionId + 1;
    this.setState({
      counter: counter,
      questionId: questionId,
      question: quizQuestions[counter].question,
      correct: quizQuestions[counter].correct,
      answerOptions: quizQuestions[counter].answers,
      answer: ''
    });
  }

  getResults() {
    var amount = this.state.answersCount;
    return amount;
  }

  setResults (result) {
    this.setState({ result: result });
  }

  handleAnswerSelected(event) {
    this.setUserAnswer(event.currentTarget.value);
    if (this.state.questionId < quizQuestions.length) {
        setTimeout(() => this.setNextQuestion(), 300);
      } else {
        setTimeout(() => this.setResults(this.getResults()), 300);
      }
  }

  renderQuiz() {
    return (
      <Quiz
        answer={this.state.answer}
        answerOptions={this.state.answerOptions}
        questionId={this.state.questionId}
        question={this.state.question}
        questionTotal={quizQuestions.length}
        onAnswerSelected={this.handleAnswerSelected}
        button={this.componentWillMount}
      />
    );
  }

  changeToHome(event) {
    this.setState({ page: "Home" });
  }

  changeToQuiz(event) {
    this.setState({ page: "Quiz" });
  }

  changeToInfo(event) {
    this.setState({ page: "Info" });
  }

  renderResult() {
    return (
      <Result quizResult={this.state.result} button={this.componentWillMount}/>
    );
  }

  renderQuizContent() {
    if(this.state.result > 0) {
      return this.renderResult();
    }
    else {

      return this.renderQuiz();
    }
  }

  renderInfoContent() {
    return (
      <Info
        info={this.state.info}
        button={this.changeToHome}
      />
    );
  }

  renderHome() {
    return (
      <div>
        <Option name="Quiz" side="option right" change={this.changeToQuiz}/>
        <Option name="Info" side="option left" change={this.changeToInfo}/>
      </div>
    );
  }

  renderPage() {
    if(this.state.page === "Home") {
      return this.renderHome();
    }
    else if(this.state.page === "Quiz") {
      return this.renderQuizContent();
    }
    else if(this.state.page === "Info") {
      return this.renderInfoContent();
    }
  }


  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Info/Quiz</h2>
        </div>
        {this.renderPage()}
      </div>
    )
  }
}

export default App;
