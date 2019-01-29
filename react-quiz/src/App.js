import React, { Component } from 'react';
import quizQuestions from './api/quizQuestions';
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
    this.search = this.search.bind(this);
    this.tick = this.tick.bind(this);
    this.switch = this.switch.bind(this);

    this.correctColour = {r:0, g:255, b:0, a:180};
    this.incorrectColour = {r:255, g:0, b:0, a:180};
    this.colour = this.correctColour;

    this.savedPersonals = [];
  }

  componentWillMount() {
    clearInterval(this.intervalHandle);
    const shuffledAnswerOptions = quizQuestions.map((question) => this.shuffleArray(question.answers));

    this.setState({
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
      score: 0,
      response: ''
    });

    this.UserList();
  }

  UserList() {
    this.callApi();
  }

  async callApi() {
    const response = await fetch('/info');
    this.infoReceived = await response.json();      
    this.infoTitles = [];
    this.infoContent = [];

    for(var i = 0; i < this.infoReceived.length; i++) {

      if(!this.infoTitles.includes(this.infoReceived[i][1])) {

        this.infoTitles.push(this.infoReceived[i][1]);
        var newContentArray = [];

        for(var j = i; j < this.infoReceived.length && this.infoReceived[i][0] === this.infoReceived[j][0]; j++) {
          newContentArray.push(this.infoReceived[j][3]);
        }
        this.infoContent.push(newContentArray);
      }
    }

    this.wholeArray = [];
    for(var k = 0; k < this.infoTitles.length; k++) {
      var object = {};
      object.title = this.infoTitles[k];
      object.content = this.infoContent[k];
      this.wholeArray.push(object);
    }

    this.setState({
      info : this.wholeArray,
      infoSaved: this.wholeArray
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
      var array = this.state.personalInfo;
      var category = quizQuestions[this.state.counter].category;

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
          console.log(this.state.personalSave);
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

  switch() {
    if(this.state.page === "Info") {
      this.setState({ page: "Personalised" });
    }
    else {
      this.setState({ page: "Info" });
    }

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

  search(value) {
    value = value.toLowerCase();
    var array = [];
    var title = "";
    this.setState({ info: [] });
    this.setState({ personalInfo: [] });
    if(this.state.page === "Info") {
      for (var i = 0; i < this.state.infoSaved.length; i++){
        title = this.state.infoSaved[i].title;
        title = title.toLowerCase();
        if(title.includes(value)) {
          array.push(this.state.infoSaved[i]);
          this.setState({ info : array });
          this.setState({ personalInfo : this.state.personalSave });
        }
      }
    }
    else if(this.state.page === "Personalised") {
      for (var j = 0; j < this.state.personalSave.length; j++){
        title = this.state.personalSave[j].title;
        title = title.toLowerCase();
        if(title.includes(value)) {
          array.push(this.state.personalSave[j]);
          this.setState({ personalInfo : array });
          this.setState({ info : this.state.infoSaved });
        }
      }
    }
  }

  renderResult() {
    return (
      <Result
        quizScore={this.state.score}
        quizResult={this.state.result}
        button={this.componentWillMount}
        info={this.changeToInfo}/>
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

  renderPersonalisedContent() {
    return (
      <Info
        info={this.state.personalInfo}
        button={this.changeToHome}
        switch={this.switch}
        searchFunc={this.search}
      />
  );
}

  renderInfoContent() {
    return (
      <Info
        info={this.state.info}
        button={this.changeToHome}
        switch={this.switch}
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
