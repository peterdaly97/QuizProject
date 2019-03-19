import React from 'react';
import PropTypes from 'prop-types';
import Option from './Option';

function Challenge(props) {

    function deleteMe(challenge) {
        props.deleteChallenge(props.username, challenge)
    }

    return (
        <div className="">
            <h4 className="challengeText">{props.username}</h4>
       
            <Option symbol="fa fa-check fa-2x" side="option challenge1" change ={() => {deleteMe(true)}}/>
            <Option symbol="fa fa-close fa-2x" side="option challenge2" change= {() => {deleteMe(false)}}/>
     
        </div>
    );
}

Challenge.propTypes = {
    username: PropTypes.string.isRequired,
    deleteChallenge: PropTypes.func
};

export default Challenge;