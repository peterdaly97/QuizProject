import React from 'react';
import PropTypes from 'prop-types';
import Option from './Option';

function Report(props) {

    return (
        <div className="">
            <h4 className="challengeText">{props.result}</h4>
       
            <Option symbol="fa fa-close fa-2x" side="option challenge2" change={props.deleteReport}/>
     
        </div>
    );
}

Report.propTypes = {
    username: PropTypes.string,
    result: PropTypes.string.isRequired,
    deleteReport: PropTypes.func
};

export default Report;