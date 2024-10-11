import { useState } from "react";
import logs from "../../utilities/console";
import { networkLogs } from '../../utilities/fetch.js';
require('../../utilities/console.js');


const ErrorPopup = ({isShown, setIsShown}) => {
    const [name, setName] = useState('')
    const [issue, setIssue] = useState('')
    const handleReportIssue = () => {
        console.group("Report Issue");
        console.log(logs)
        console.log(
            'user', {
                id: localStorage.getItem('id'),
                Recordedname: localStorage.getItem('userName'),
                name: name,
                issue: issue,
                email : localStorage.getItem('userEmail')
            }
        )
        console.log(networkLogs)
        console.groupEnd();
        setIsShown(false)
    }

    return (
        isShown&&
        <div className="error-container">
            <div className="error-popup">
                <div className="close" onClick={() => setIsShown(false)}>X</div>
                <h1 className="error-title">Report issue</h1>
                <input type="text" placeholder="أسمك ؟" style={{textAlign:'right'}} onChange={(e) => setName(e.target.value)}/>
                <textarea  className="error-input" type="textarea" placeholder="ايه اللي حصل" onChange={(e) => setIssue(e.target.value)} /> 
                <br />
                <button onClick={handleReportIssue}>Send</button>
            </div>
        </div>
    )
}

export default ErrorPopup