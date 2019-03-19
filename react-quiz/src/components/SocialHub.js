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
            fail: false
        };

        this.deleteChallenge = this.deleteChallenge.bind(this);
        this.deleteReport = this.deleteReport.bind(this);
        this.renderChallenges = this.renderChallenges.bind(this);
        this.renderReports = this.renderReports.bind(this);
        this.search = this.search.bind(this);
        this.startChallenge = this.startChallenge.bind(this);
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
            if(array[i].id == id) {
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
        this.accepted = await response.json(); 
        console.log(this.accepted);  
    }

    deleteChallenge(username) {
        
        var array = []
        array = this.state.challenges;
        
        for(var i = 0; i < array.length; i++) {
            if(array[i] == username) {
                array.splice(i, 1);
                break;
            }
        }

        this.setState({
            challenges : array
        });
        this.delChallengeAPI(username)
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
        this.accepted = await response.json(); 
    }

    renderChallenges(key) {
        return (
            <Challenge
                username={key}
                deleteChallenge={this.deleteChallenge}
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
        var errorMessage = ''
        var fail = false;
        if(this.state.searchName != this.props.username) {
            const response = await fetch('/check_username/' + this.state.searchName);
            this.userExists = await response.json(); 
            
            if(this.userExists) {
                this.props.challengeBTN(this.state.searchName);
                
            }
            else {
                errorMessage = "User doesn't exist";
                fail = true;
            }
        }
        else {
            console.log("Hello");
            errorMessage = "Can't challenge yourself";
            fail = true;
        }
        
        this.setState({
            errorMessage: errorMessage,
            fail: fail
        });
    }

    render() {
        return (
            <div>
                <Option symbol="fa fa-home fa-3x" side="option top" change={this.props.button}/>
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
                    <ul>
                        {this.state.challenges.map(this.renderChallenges)}
                    </ul>
                </div>
                <div className="challenges">
                    <h2 className="SocialTitle">Reports</h2>
                    <ul>
                        {this.state.reports.map(this.renderReports)}
                    </ul>
                </div>
            </div>
        );
        
    }
}

export default SocialHub;