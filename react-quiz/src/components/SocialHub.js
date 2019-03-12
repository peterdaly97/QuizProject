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
    }

    componentWillMount() {
        this.callApi();
    }

    async callApi() {
        const response = await fetch('/get_challenges/' + this.props.username);
        this.challenges = await response.json();   

        this.setState({
            challenges : this.challenges
        });  
    }

    renderChallenges(key) {
        return (
            <Challenge
                username={key}
            />
        );
    }

    renderReports(key) {
        return (
            <Report
                username={key.username}
                result={key.result}
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