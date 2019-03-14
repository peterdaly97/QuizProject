import React, { Component } from 'react';
import Option from './Option';
import Challenge from './Challenges';
import Report from './Reports';

class SocialHub extends Component {

    constructor() {
        super();

        this.state = {
            page: 'Social Hub',
            challenges: [],
            reports: []
        };

        this.deleteChallenge = this.deleteChallenge.bind(this);
        this.deleteReport = this.deleteReport.bind(this);
        this.renderChallenges = this.renderChallenges.bind(this);
        this.renderReports = this.renderReports.bind(this);

        
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

    deleteReport(index) {
        this.deleteReport = -1;
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
        console.log(this.accepted);  
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
        this.reportIndex++;
        return (
            <Report
                result={key}
                index={this.reportIndex}
                deleteReport={this.deleteReport}
            />
        );
    }

    render() {
        return (
            <div>
                <Option symbol="fa fa-home fa-3x" side="option top" change={this.props.button}/>
                <Option  side="option challengeBTN" name="Issue Challenge" change={this.props.challengeBTN}/>
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