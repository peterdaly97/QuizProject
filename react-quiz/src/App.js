import React, { Component } from 'react';
import quizQuestions from './api/quizQuestions';
import infoContent from './api/infoContent';
import Quiz from './components/Quiz';
import Info from './components/Info';
import Result from './components/Result';
import Option from './components/Option';
import Particle from './components/Particles';
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
     result: -1,
     page: '',
     timer: 10,
     particles: false,
     score: 0
    };

    this.handleAnswerSelected = this.handleAnswerSelected.bind(this);
    this.changeToHome = this.changeToHome.bind(this);
    this.componentWillMount = this.componentWillMount.bind(this);
    this.changeToQuiz = this.changeToQuiz.bind(this);
    this.changeToInfo = this.changeToInfo.bind(this);
    this.tick = this.tick.bind(this);
    this.correctColour = {r:0, g:255, b:0, a:180};
    this.incorrectColour = {r:255, g:0, b:0, a:180};
    this.colour = this.correctColour;
  }

  componentWillMount() {
    clearInterval(this.intervalHandle);
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
      result: -1,
      page: "Home",
      timer: 10,
      particles: false,
      score: 0
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
    if (this.state.questionId < quizQuestions.length) {
        setTimeout(() => this.setNextQuestion(), 300);
      } else {
        setTimeout(() => this.setResults(this.getResults()), 300);
      }
  }

  renderQuiz() {
      return (
          <div>
            {this.state.particles &&
              <Particle
                particleAmount={400}
                particleSpeed={1.0}
                particleRadius={1.0}
                colour={this.colour}
              />
            }
            <Quiz
              answer={this.state.answer}
              answerOptions={this.state.answerOptions}
              questionId={this.state.questionId}
              question={this.state.question}
              questionTotal={quizQuestions.length}
              onAnswerSelected={this.handleAnswerSelected}
              button={this.componentWillMount}
              timer={this.state.timer}
              tick={this.tick}
            />
          </div>

      );
  }

  changeToHome(event) {
    this.setState({ page: "Home" });
  }

  changeToQuiz(event) {
    this.setState({ page: "Quiz" });
    this.intervalHandle = setInterval(this.tick, 1000);
  }

  changeToInfo(event) {
    this.setState({ page: "Info" });
  }

  renderResult() {
    return (
      <Result
        quizScore={this.state.score}
        quizResult={this.state.result}
        button={this.componentWillMount}/>
    );
  }

  renderQuizContent() {
    if(this.state.result > -1) {
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
