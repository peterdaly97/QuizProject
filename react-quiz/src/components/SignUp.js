import React, { Component } from 'react';

class SignUp extends  Component {

    constructor() {
      super();
      this.state = {
        username: '',
        password: '',
        fail: false,
        errorMessage: ''
      };

      this.handleUChange = this.handleUChange.bind(this);
      this.handlePChange = this.handlePChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.logIn = this.logIn.bind(this);
    }

    componentWillMount() {
      
    }

    async callApi() {
        const accept = await fetch('/SignUp', {
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
            this.props.button(this.state.username);
        }
        else {
            this.setState({
                fail: true,
                errorMessage: "Username already taken"
              });
        }
    }

    logIn(event) {
        this.props.change();
      }

    handleSubmit(event) {
        event.preventDefault();
        
        if(this.state.username.length < 5) {
            this.setState({
                fail: true,
                errorMessage: "Username must be 5 or more characters"
            });
        }
        else if(this.state.password.length < 5) {
            this.setState({
                fail: true,
                errorMessage: "Password must be 5 or more characters"
            });
        }
        else {
            this.callApi();
        }
        
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
            { !this.state.fail && 
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
                    <a href='javascript:void(0)' onClick={this.logIn}>Already have an account?</a>
                    <input className="SubmitForm" type="submit" value="Submit" />
                </form>
            }
            { this.state.fail &&
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
                <h5>{this.state.errorMessage}</h5>
                <a href='javascript:void(0)' onClick={this.logIn}>Already Have Account? Log In</a>
                <input className="SubmitForm" type="submit" value="Submit" />
            </form>

            }
        </div>
      );
    }
  }

  export default SignUp;
