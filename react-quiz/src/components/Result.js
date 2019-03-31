import React, { Component } from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import Option from '../components/Option';


  class Result extends  Component {

    constructor() {
      super();

      this.changeToInfo = this.changeToInfo.bind(this);
      this.changeToHome = this.changeToHome.bind(this);

      this.state = {
        score: 0,
        result: 0,
        highScore: 0
      }
    }

    componentWillMount() {
      this.callApi();
    }

    async callApi() {
      const scoreResponse = await fetch('/score', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          score: this.props.quizScore,
          username: this.props.username
        })
      });
      
      this.scoreReceived = await scoreResponse.json(); 

      this.setState({
        score: this.props.quizScore,
        result: this.props.quizResult,
        highScore: this.scoreReceived[0][0]
      });

    }

    changeToInfo() {
      this.props.info("Leave Result Page");
    }

    changeToHome() {
      this.props.button("Leave Result Page");
    }

    render() {
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
              <h3>You got <strong>{this.state.result}</strong> correct!</h3>
              <h3>Your score: <strong>{this.state.score}</strong></h3>
              <h3>Your highScore: <strong>{this.state.highScore}</strong></h3>
              {this.props.challenged && 
                <h3><strong>{this.props.challengeResult}</strong> the challenge from <strong>{this.props.challenger}</strong></h3>
              }
            </div>
          </CSSTransitionGroup>
          <Option symbol="fa fa-home" name=" Home" side="option resultRight" change={this.changeToHome}/>
          <Option symbol="fa fa-info" name=" Info" side="option resultLeft" change={this.changeToInfo}/>
        </div>
      );
    }
  }

  export default Result;
