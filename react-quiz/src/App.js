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
     challenger: '',
     quizQuestions: []
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
    this.leaveHome = this.leaveHome.bind(this);

    this.deleteFromPersonalisedInfo = this.deleteFromPersonalisedInfo.bind(this);
  
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

    var quizQuestions = []

    var id = 1;
    for(var i = 0; i < this.infoReceived.length; i++) {

      for(var j = 0; j < this.infoReceived[i].quizContent.length; j++) {
        
        var object = {
          "id" : id,
          "question" : this.infoReceived[i].quizContent[j].question, 
          "category" : this.infoReceived[i].title,
          "correct" : this.infoReceived[i].quizContent[j].correct,
          "answers" : this.infoReceived[i].quizContent[j].answers
        }
        quizQuestions.push(object);
        id++;
      }
      
    }

    this.setState({
        info : this.infoReceived,
        infoSaved: this.infoReceived,
        quizQuestions: quizQuestions
    }); 

    
  }

  async updatePageCount(event1, event2, username) {
    const response = await fetch('/update_user_info', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: username,
        event1: event1,
        event2: event2
      })
    });
  }

  async getInfoPoint() {
    const response = await fetch('/get_personalised_points/' + this.state.username);
    this.infoReceived = await response.json(); 
    if(this.infoReceived.length > 0) {
      var titles = this.infoReceived[0].split(",");
      for(var i = 0; i < titles.length; i++) {
        this.appendToInfo(titles[i], false);
      }
    }
    
   
  }

  async postInfoPoint(title) {
    const response = await fetch('/post_personal_info', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: this.state.username,
        title: title[0]
      })
    });
  }

  appendToInfo(category, newTitle) {
    
    var array = this.state.personalInfo;

    if(!this.savedPersonals.includes(category)) {
      this.savedPersonals.push(category);
      for (var j = 0; j < this.state.infoSaved.length; j++){
        var title = this.state.infoSaved[j].title;
        
        if(title == category) {
          if(newTitle) {
            this.postInfoPoint(title);
          }
          array.push(this.state.infoSaved[j]);
          this.setState((state) => ({
            personalSave: array
          }));
        }
      }
    }
  }

  deleteFromPersonalisedInfo(title) {
    
    if(this.savedPersonals.includes(title)) {
      var array = this.state.personalSave;
      for (var j = 0; j < array.length; j++){
        var category = array[j].title;
        
        if(title == category) {
          
          array.splice(j, 1);
          this.setState((state) => ({
            personalSave: array,
            personalInfo: array
          }));
        }
      }
      this.deletePersonalInfoApi(title);
    }

    
  }

  async deletePersonalInfoApi(title) {
    const response = await fetch('/remove_personalised_point', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: this.state.username,
        title: title
      })
    });
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
              questions={this.state.quizQuestions}
              updateCount={this.updatePageCount}
            />
          </div>
      );
  }

  startChallenge(name) {
    this.setState({ 
      challenge: true,
      challengeName: name
    });
    console.log(this.state.challenge);
    this.changeToQuiz();
  }

  startChallenged(challenger, questions) {
    this.setState({ 
      challenger: challenger,
      challenged: true,
      challengedQs: questions
    }, function () {
      this.changeToQuiz();
    });
  }

  renderSocialHub() {
    return (
      <div>
        <SocialHub
          button={this.changeToHome}
          username={this.state.username}
          challengeBTN={this.startChallenge}
          acceptChallenge={this.startChallenged}
          updateCount={this.updatePageCount}
        />
      </div>
    )
  }

  changeToSocialHub(event) {
    this.setState({ 
      page: "SocialHub",
      title: "Social Hub" 
    });
    this.updatePageCount("Leave Home Page", "Enter Social Hub", this.state.username);
  }

  changeToHome(messageEvent) {
    this.setState({ 
      page: "Home",
      title: "Home",
      challenge: false
    });

    this.updatePageCount(messageEvent, "Enter Home Page", this.state.username);
  }

  logIn(message, username) {
    
    this.setState({ 
      page: "Home",
      username: username 
    });
    this.getInfoPoint();
  }

  changeToQuiz(event) {
    this.setState({ 
      page: "Quiz", 
      title: "Quiz"
    });
    
    if(!this.state.challenge && !this.state.challenged) {
      this.updatePageCount("Leave Home Page", "Start Quiz", this.state.username);
    }
    
    this.intervalHandle = setInterval(this.tick, 1000);
  }

  changeToInfo(messageEvent) {
    
    this.setState({ 
      page: "Info",
      title: "Information",
      challenge: false
    });
    console.log(this.state.page);
    this.updatePageCount(messageEvent, "Enter Info Page ", this.state.username);
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
        username={this.state.username}
        infoSaved={this.state.infoSaved}
        personalSave={this.state.personalSave}
        button={this.changeToHome}
        searchFunc={this.search}
        deleteFunc={this.deleteFromPersonalisedInfo}
        updateCount={this.updatePageCount}
      />
    );
  }

  leaveHome(event) {
    this.changeToInfo("Leave Home Page");
  }

  renderHome() {
    return (
      <div>
        <Option symbol="fa fa-address-book fa-3x" side="option top" change={this.changeToSocialHub}/>

        <Option name=" Quiz" symbol="fa fa-gamepad" side="option right" change={this.changeToQuiz}/>
        <Option name=" Info" symbol="fa fa-info" side="option left" change={this.leaveHome}/>
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
