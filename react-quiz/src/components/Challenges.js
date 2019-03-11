import React from 'react';
import PropTypes from 'prop-types';
import Option from './Option';

function Challenge(props) {

    return (
        <div className="challengeBox">
            <h4 className="challengeText">{props.username}</h4>
       
            <Option symbol="fa fa-check fa-3x" side="option challenge1"/>
            <Option symbol="fa fa-close fa-3x" side="option challenge2"/>
     
        </div>
    );
}

Challenge.propTypes = {
    username: PropTypes.string.isRequired
};

export default Challenge;