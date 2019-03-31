import React, { Component } from 'react';

class LogIn extends  Component {

    constructor() {
      super();
      this.state = {
        username: '',
        password: '',
        failedLogIn: false
      };

      this.handleUChange = this.handleUChange.bind(this);
      this.handlePChange = this.handlePChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.signUp = this.signUp.bind(this);
    }

    componentWillMount() {
      
    }

    async callApi() {
        const accept = await fetch('/LogIn', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: this.state.username,
              password: this.state.password
            })
          });

        var acceptJSON = await accept.json(); 
        
        
        if(acceptJSON === true) {
            this.props.button("Log In", this.state.username);
        }
        else {
            this.setState({
                failedLogIn: true
              });
        }
    }

    signUp(event) {
      this.props.change();
    }

    handleSubmit(event) {
        event.preventDefault();
        
        this.callApi();
        return false;
    }

    handleUChange(event) {
        this.setState({username: event.target.value});
    }

    handlePChange(event) {
        this.setState({password: event.target.value});
    }

    render() {
      return (
        <div>
            { !this.state.failedLogIn && 
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Username:  <br/>
                        <input className="LogIn" type="text" value={this.state.username} onChange={this.handleUChange} />
                    </label>
                    <br/>
                    <label>
                        Password:  <br/>
                        <input className="LogIn" type="password" value={this.state.password} onChange={this.handlePChange} />
                    </label>
                    <br/>
                    <a href='javascript:void(0)' onClick={this.signUp}>Sign Up</a>
                    <input className="SubmitForm" type="submit" value="Log In" />
                </form>
            }
            { this.state.failedLogIn &&
                <form onSubmit={this.handleSubmit}>
                <label>
                    Username:  <br/>
                    <input className="LogIn fail" type="text" value={this.state.username} onChange={this.handleUChange} />
                </label>
                <br/>
                <label>
                    Password:  <br/>
                    <input className="LogIn fail" type="password" value={this.state.password} onChange={this.handlePChange} />
                </label>
                <br/>
                <h5>Either your username or password was incorrect</h5>
                <a href='javascript:void(0)' onClick={this.signUp}>Sign Up</a>
                <input className="SubmitForm" type="submit" value="Log In" />
            </form>
            }
        </div>
      );
    }
  }

  export default LogIn;
