import React from "react";
import Popup from "reactjs-popup";

const contentStyle = {
  maxWidth: "1200px",
  width: "90%"
};

const CustomModal = (props) => {
    return (
        <Popup
        trigger={props.trigger}
        disabled = {props.disabled}
        modal
        contentStyle={contentStyle} >
        {close => (
        <div className="modal">
            <button className="close" onClick={close}>
            &times;
            </button>
            <div className="header"> MOVE INSTRUCTIONS </div>
            <div className="content">
                <br/>
                {props.instructionsFiles}
                <br/><br/>
                <a onClick={props.onClick1} href="#">Move Instructions.txt</a>
                <br/><br/>
            </div>
            <div className="header"> ROLLBACK INSTRUCTIONS </div>
            <div className="content">
                <br/>
                {props.rollbackFiles}
                <br/><br/>
                <a onClick={props.onClick2} href="#">Rollback Instructions.txt</a>
                <br/><br/>
            </div>
            <div className="header"></div>
            <div className="content">
                <br/>
                Please, download the files and upload them to this bitbucket <a target="_blank" rel="noopener noreferrer" href="https://bitbucket.es.ad.adp.com/projects/PID/repos/deploy-scripts/browse/Client_Version_Upgrades">folder</a>.
                After uploading the files in bitbucket, remember to update the Deployment Plan with the instruction file location.
                <br/><br/>
            </div>
        </div>
        )}
      </Popup>
    )
};

export default CustomModal;
