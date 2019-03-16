import React from 'react';
import PropTypes from 'prop-types';
import Option from './Option';

function Report(props) {

    function deleteMe() {
        props.deleteReport(props.id)
    }

    return (
        <div className="">
            <h4 className="challengeText"><u>Name</u>: {props.username} &nbsp; <u>Result</u>: {props.result}</h4>
       
            <Option symbol="fa fa-close fa-2x" side="option challenge2" change={deleteMe}/>
     
        </div>
    );
}

Report.propTypes = {
    username: PropTypes.string,
    id: PropTypes.number.isRequired,
    result: PropTypes.string.isRequired,
    deleteReport: PropTypes.func
};

export default Report;