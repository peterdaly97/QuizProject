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
                <div className="challenges">
                    <h2>Challenges</h2>
                    <ul>
                        {this.state.challenges.map(this.renderChallenges)}
                    </ul>
                </div>
                <div className="challenges">
                    <h2>Reports</h2>
                    <ul>
                        {this.state.reports.map(this.renderReports)}
                    </ul>
                </div>
            </div>
        );
        
    }
}

export default SocialHub;