import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CSSTransitionGroup } from 'react-transition-group';
import Option from '../components/Option';


  class Result extends  Component {

    constructor() {
      super();

      this.changeToInfo = this.changeToInfo.bind(this);

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
      // fetch('/highScore', {
      //   method: 'POST',
      //   headers: {
      //     'Accept': 'application/json',
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     score: this.props.quizScore
      //   })
      // })
      const scoreResponse = await fetch('/highScore', {
        method: 'GET'
      });
      this.scoreReceived = await scoreResponse.json(); 

      this.setState({
        score: this.props.quizScore,
        result: this.props.quizResult,
        highScore: this.scoreReceived[0][0]
      });

    }

    changeToInfo() {
      this.props.button();
      this.props.info();
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
            </div>
          </CSSTransitionGroup>
          <Option symbol="fa fa-home" name=" Home" side="option resultRight" change={this.props.button}/>
          <Option symbol="fa fa-info" name=" Info" side="option resultLeft" change={this.changeToInfo}/>
        </div>
      );
    }
  }

  export default Result;
