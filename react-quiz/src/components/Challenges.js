import React from 'react';
import PropTypes from 'prop-types';
import Option from './Option';

function Challenge(props) {

    function deleteMe() {
        props.deleteChallenge(props.username)
    }

    return (
        <div className="">
            <h4 className="challengeText">{props.username}</h4>
       
            <Option symbol="fa fa-check fa-2x" side="option challenge1"/>
            <Option symbol="fa fa-close fa-2x" side="option challenge2" change={deleteMe}/>
     
        </div>
    );
}

Challenge.propTypes = {
    username: PropTypes.string.isRequired,
    deleteChallenge: PropTypes.func
};

export default Challenge;