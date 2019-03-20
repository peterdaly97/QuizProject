import React, { Component } from 'react';
import Quiz from './components/Quiz';
import Info from './components/Info';
import Option from './components/Option';
import logo from './svg/coeliacLogo.png';
import LogIn from './components/LogIn';
import SignUp from './components/SignUp';
import SocialHub from './components/SocialHub';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
     page: '',
     personalInfo: [],
     personalSave: [],
     title: "Log In",
     username: "",
     challenge: false,
     challenged: false,
     challengeName: '',
     challengedQs: [],
     challenger: ''
    };

    this.changeToHome = this.changeToHome.bind(this);
    this.componentWillMount = this.componentWillMount.bind(this);
    this.changeToQuiz = this.changeToQuiz.bind(this);
    this.changeToInfo = this.changeToInfo.bind(this);
    this.changeToSignUp = this.changeToSignUp.bind(this);
    this.changeToLogIn = this.changeToLogIn.bind(this);
    this.changeToSocialHub = this.changeToSocialHub.bind(this);

    this.startChallenge = this.startChallenge.bind(this);
    this.startChallenged = this.startChallenged.bind(this);

    this.appendToInfo = this.appendToInfo.bind(this);

    this.logIn = this.logIn.bind(this);
  
    this.savedPersonals = [];
  }

  componentWillMount() {
    this.UserList();
    
    this.setState({
      page: "LogIn"
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
        
        if(title == category) {
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
              button={this.changeToHome}
              info={this.changeToInfo}
              append={this.appendToInfo}
              username={this.state.username}
              challenge={this.state.challenge}
              challenged={this.state.challenged}
              challengedQuestions={this.state.challengedQs}
              challenger={this.state.challenger}
              challengeName={this.state.challengeName}
            />
          </div>
      );
  }

  startChallenge(name) {
    this.setState({ 
      challenge: true,
      challengeName: name
    });
    this.changeToQuiz();
  }

  startChallenged(challenger, questions) {
    this.setState({ 
      challenger: challenger,
      challenged: true,
      challengedQs: questions
    });
    this.changeToQuiz();
  }

  renderSocialHub() {
    return (
      <div>
        <SocialHub
          button={this.changeToHome}
          username={this.state.username}
          challengeBTN={this.startChallenge}
          acceptChallenge={this.startChallenged}
        />
      </div>
    )
  }

  changeToSocialHub(event) {
    this.setState({ 
      page: "SocialHub",
      title: "Social Hub" 
    });
  }

  changeToHome(event) {
    this.setState({ 
      page: "Home",
      title: "Home",
      challenge: false
    });
  }

  logIn(username) {
    this.setState({ 
      page: "Home",
      username: username 
    });
  }

  changeToQuiz(event) {
    this.setState({ 
      page: "Quiz", 
      title: "Quiz"
    });
    this.intervalHandle = setInterval(this.tick, 1000);
  }

  changeToInfo(event) {
    this.setState({ 
      page: "Info",
      title: "Information",
      challenge: false
    });
  }

  changeToLogIn(event) {
    this.setState({ 
      page: "LogIn",
      title: "Log In" 
    });
  }

  changeToSignUp(event) {
    this.setState({ 
      page: "SignUp",
      title: "Sign Up" 
    });
  }

  renderLogIn() {
    return (
      <LogIn
        button={this.logIn}
        change={this.changeToSignUp}
      />
    );
  }

  renderSignUp() {
    return (
      <SignUp
        button={this.logIn}
        change={this.changeToLogIn}
      />
    );
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
        <Option symbol="fa fa-address-book fa-3x" side="option top" change={this.changeToSocialHub}/>

        <Option name=" Quiz" symbol="fa fa-gamepad" side="option right" change={this.changeToQuiz}/>
        <Option name=" Info" symbol="fa fa-info" side="option left" change={this.changeToInfo}/>
      </div>
    );
  }

  renderPage() {
    if(this.state.page === "LogIn") {
      return this.renderLogIn();
    }
    if(this.state.page === "SignUp") {
      return this.renderSignUp();
    }
    else if(this.state.page === "Home") {
      return this.renderHome();
    }
    else if(this.state.page === "Quiz") {
      return this.renderQuiz();
    }
    else if(this.state.page === "Info") {
      return this.renderInfoContent();
    }
    else if(this.state.page === "SocialHub") {
      return this.renderSocialHub();
    }
  }


  render() {
    return (
      <div className="App">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/>

        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>{this.state.title}</h2>
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
