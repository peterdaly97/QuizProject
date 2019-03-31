import React, { Component } from 'react';
import Option from './Option';
import Challenge from './Challenges';
import Report from './Reports';
import Popup from "reactjs-popup";
import Search from './Search';

class SocialHub extends Component {

    constructor() {
        super();

        this.state = {
            page: 'Social Hub',
            challenges: [],
            reports: [],
            searchName: '',
            errorMessage: '',
            fail: false,
            questionArray: []
        };

        this.reactToChallenge = this.reactToChallenge.bind(this);
        this.deleteReport = this.deleteReport.bind(this);
        this.renderChallenges = this.renderChallenges.bind(this);
        this.renderReports = this.renderReports.bind(this);
        this.search = this.search.bind(this);
        this.startChallenge = this.startChallenge.bind(this);
        this.leaveSocialHub = this.leaveSocialHub.bind(this);
    }

    componentWillMount() {
        this.reportIndex = -1;
        this.callApi();
    }

    async callApi() {
        const response = await fetch('/get_challenges/' + this.props.username);
        this.challenges = await response.json();   

        this.setState({
            challenges : this.challenges
        });  

        const reportResponse = await fetch('/get_reports/' + this.props.username);
        this.reports = await reportResponse.json();   

        this.setState({
            reports : this.reports
        });  
    }

    deleteReport(id) {
        var array = []
        array = this.state.reports;
        
        for(var i = 0; i < array.length; i++) {
            if(array[i].id === id) {
                array.splice(i, 1);
                break;
            }
        }

        this.setState({
            reports : array
        });
        this.delReportsAPI(id)
    }

    async delReportsAPI(id) {
        
        const response = await fetch('/discard_report', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: id
            })
          });
    }

    reactToChallenge(username, accept) {
        var array = []
        array = this.state.challenges;
        
        var selectedChallenge = {};
        
        for(var i = 0; i < array.length; i++) {
            if(array[i].challenger === username) {
                selectedChallenge = array[i].questions;
                if(!accept) {
                    array.splice(i, 1);
                    break;
                }
                
            }
        }

        this.setState({
            challenges : array
        });

        if(!accept) {
            
            this.delChallengeAPI(username);
        }
        else {
            this.acceptChallenge(username, selectedChallenge);
        }
        
    }

    acceptChallenge(username, selectedChallenge) {
        var arrayOfQuestions = []

        arrayOfQuestions = selectedChallenge.split(",").map(Number);
        arrayOfQuestions.pop();
        this.props.updateCount("Leave Social Hub", "Start Quiz", this.props.username);
        this.props.acceptChallenge(username, arrayOfQuestions);
    } 

    async delChallengeAPI(username) {
        
        const response = await fetch('/reject_challenge', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              challenger: username
            })
          });
    }

    renderChallenges(key) {
        return (
            <Challenge
                username={key.challenger}
                deleteChallenge={this.reactToChallenge}
            />
        );
    }

    renderReports(key) {
        return (
            <Report
                result={key.response}
                id={key.id}
                username={key.challenged}
                deleteReport={this.deleteReport}
            />
        );
    }

    search(value) {
        this.setState({
            searchName: value
        });
    }

    async startChallenge() {
        if(this.state.searchName.length <= 0) {
            this.setState({
                errorMessage: "No user with that username",
                fail: true
            });
        }
        else if(this.state.searchName !== this.props.username) {
            
            const response = await fetch('/check_username/' + this.state.searchName + '/challenged_by/' + this.props.username);
            this.userExists = await response.json(); 
            
            if(this.userExists.message.length > 0) {
                this.setState({
                    errorMessage: this.userExists.message,
                    fail: true
                });
            }
            else if(this.userExists.exist) {
                this.props.updateCount("Leave Social Hub", "Start Quiz", this.props.username);
                this.props.challengeBTN(this.state.searchName);
                
            }
            else {
                this.setState({
                    errorMessage: "No user with that username",
                    fail: true
                });
            }
        }
        else {
            this.setState({
                errorMessage: "Can't challenge yourself",
                fail: true
            });
        }
        
    }

    leaveSocialHub() {
        this.props.button("Leave Social Hub");
    }

    render() {
        return (
            <div>
                <Option symbol="fa fa-home fa-3x" side="option top" change={this.leaveSocialHub}/>
                <Popup trigger={<button className="option challengeBTN">Issue Challenge</button>} modal>
                    {close => (
                        <div className="modal">
                            <a className="closePopUp" onClick={close}>
                                &times;
                            </a>
                            <div className="titlePopUp">Find Challenger</div>
                            <Search onChange={this.search} class="challengeSearch"/>
                            { this.state.fail && 
                                <h5 className="errorPopUp">{this.state.errorMessage}</h5>
                            }
                            <div className="actions">
                                <button
                                    className="popUpOption"
                                    onClick={() => {
                                        this.startChallenge();
                                    
                                    }}
                                >
                                Challenge
                                </button>
                            </div>
                        </div>
                    )}
                </Popup>
                <div className="challenges">
                    <h2 className="SocialTitle">Challenges</h2>
                    {this.state.challenges.length > 0 ? (
                        <ul>
                            {this.state.challenges.map(this.renderChallenges)}
                        </ul>
                        ) : (
                        <h4>No challenges at the moment!</h4>
                     )}
                    
                </div>
                <div className="challenges">
                    <h2 className="SocialTitle">Reports</h2>
                    {this.state.reports.length > 0 ? (
                        <ul>
                            {this.state.reports.map(this.renderReports)}
                        </ul>
                        ) : (
                        <h4>No reports at the moment!</h4>
                     )}
                </div>
            </div>
        );
        
    }
}

export default SocialHub;