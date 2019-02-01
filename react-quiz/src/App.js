import React, { Component } from 'react';
import Quiz from './components/Quiz';
import Info from './components/Info';
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
     score: 0,
     personalInfo: [],
     personalSave: [],
     response: '',
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

    this.savedPersonals = [];
  }

  componentWillMount() {
    clearInterval(this.intervalHandle);
    this.UserList();
    

    this.setState({
      counter: 0,
      answer: '',
      questionId: 1,
      answersCount: 0,
      result: -1,
      page: "Home",
      timer: 10,
      particles: false,
      score: 0,
      response: ''
    });

    
  }

  UserList() {
    this.callApi();
  }

  async callApi() {
    const response = await fetch('/info');
    this.infoReceived = await response.json();   

    const quizResponse = await fetch('/quiz');
    this.quizReceived = await quizResponse.json(); 

    const shuffledAnswerOptions = this.quizReceived.map((question) => this.shuffleArray(this.quizReceived[0].answers));
    
    this.setState({
      info : this.infoReceived,
      infoSaved: this.infoReceived,
      question: this.quizReceived[0].question,
      correct: this.quizReceived[0].correct,
      answerOptions: shuffledAnswerOptions[0]
    });
    console.log(this.quizReceived);   
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
      var array = this.state.personalInfo;
      var category = this.quizReceived[this.state.counter].category;

      if(!this.savedPersonals.includes(category)) {
        this.savedPersonals.push(category);
        for (var j = 0; j < this.state.infoSaved.length; j++){
          var title = this.state.infoSaved[j].title;
          if(title === category) {
            array.push(this.state.infoSaved[j]);
            this.setState((state) => ({
              personalSave: array
            }));
          }
        }
      }
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

  renderQuiz() {
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
            <Quiz
              answer={this.state.answer}
              answerOptions={this.state.answerOptions}
              questionId={this.state.questionId}
              question={this.state.question}
              questionTotal={this.quizReceived.length}
              onAnswerSelected={this.handleAnswerSelected}
              button={this.componentWillMount}
              timer={this.state.timer}
              tick={this.tick}
              quizScore={this.state.score}
              quizResult={this.state.result}
              button={this.componentWillMount}
              info={this.changeToInfo}
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

  renderQuizContent() {
    return this.renderQuiz();
  }

  renderInfoContent() {
    return (
      <Info
        info={this.state.info}
        personalInfo={this.state.personalInfo}
        infoSaved={this.state.infoSaved}
        personalSave={this.state.personalSave}
        button={this.changeToHome}
        searchFunc={this.search}
      />
    );
  }

  renderHome() {
    return (
      <div>
        <Option name=" Quiz" symbol="fa fa-gamepad" side="option right" change={this.changeToQuiz}/>
        <Option name=" Info" symbol="fa fa-info" side="option left" change={this.changeToInfo}/>
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
    else if(this.state.page === "Personalised") {
      return this.renderPersonalisedContent();
    }
  }


  render() {
    return (
      <div className="App">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/>

        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Quiz</h2>
        </div>
        <div className="App-content">
          {this.renderPage()}
        </div>
        <div className="App-footer">
          <h2 className="footerName">Peter Daly</h2>
        </div>
      </div>
    )
  }
}




export default App;
