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
        // Make api calls
    }

    renderChallenges(key) {
        return (
            <Challenge
                username={key.username}
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
                    <h4>Challenges</h4>
                    <ul>
                        {this.state.challenges.map(this.renderChallenges)}
                    </ul>
                </div>
                <div className="challenges">
                    <h4>Reports</h4>
                    <ul>
                        {this.state.reports.map(this.renderReports)}
                    </ul>
                </div>
            </div>
        );
        
    }
}

export default SocialHub;