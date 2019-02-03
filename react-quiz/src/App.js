import React, { Component } from 'react';
import Quiz from './components/Quiz';
import Info from './components/Info';
import Option from './components/Option';
import logo from './svg/coeliacLogo.png';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
     page: '',
     personalInfo: [],
     personalSave: []
    };

    this.changeToHome = this.changeToHome.bind(this);
    this.componentWillMount = this.componentWillMount.bind(this);
    this.changeToQuiz = this.changeToQuiz.bind(this);
    this.changeToInfo = this.changeToInfo.bind(this);
    this.appendToInfo = this.appendToInfo.bind(this);
  
    this.savedPersonals = [];
  }

  componentWillMount() {
    this.UserList();
    

    this.setState({
      page: "Home"
    });

    
  }

  UserList() {
    this.callApi();
  }

  async callApi() {
    const response = await fetch('/info');
    this.infoReceived = await response.json();   

   this.setState({
      info : this.infoReceived,
      infoSaved: this.infoReceived
    });  
  }

  appendToInfo(category) {
    var array = this.state.personalInfo;

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

  renderQuiz() {
      return (
          <div>
            <Quiz
              button={this.componentWillMount}
              info={this.changeToInfo}
              append={this.appendToInfo}
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
