import React, { Component } from 'react';
import Select from 'react-select';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from '@material-ui/core/Button';
//import Popup from "reactjs-popup";
import ModalPopup from './Components/ModalPopup';
import './App.css';
import FileInput from "./Components/FileInput";
import Background from './IMGs/background31.jpg';

//npm lib for popups - https://www.npmjs.com/package/reactjs-popup
//import Popup from "reactjs-popup";

//import ModalPopup from './Popup/ModalPopup.js';
 
class App extends Component {
 
  state = {
    appidItems: [
      { label: "ADPTA", value: 1 },
      { label: "WFNPortal", value: 2 },
      { label: "HRIIPortal", value: 3 },
      { label: "TMS", value: 4 },
      { label: "ECE (ADPHC/ACA)", value: 5 },
    ],
    environmentItems: [],
    originItems: [
      { label: "CURR", value: 1 },
      { label: "NEXT", value: 2 },
    ],
    targetItems: [
      { label: "CURR", value: 1 },
      { label: "NEXT", value: 2 },
    ],
 
    selectedAppid: '',
    selectedEnvironment: '',
    selectedOrigin: '',
    selectedTarget: '',
    selectedDate: '',
    
    instructionsFile: '',
    rollbackFile: '',

    popUpDisabled: true,
  }
 
  handleAppId = (selectedOption) => {
 
    this.setState({selectedAppid: selectedOption}, this.setTextContent);
    this.setState({selectedEnvironment: ''});
 
    if (selectedOption.label === "WFNPortal"){
      this.setState(
        {environmentItems: [
          { label: "IAT1", value: 1 },
          { label: "UAT1", value: 2 },
          { label: "PROD2", value: 3 },
        ]}
      );
    }
    else {
      this.setState(
        {environmentItems: [
          { label: "IAT2", value: 1 },   
          { label: "UAT2", value: 2 },   
          { label: "PROD1", value: 3 }, 
        ]}
      );
    }
    console.log(selectedOption.label);
  }
 
  handleEnvironment = (selectedOption) => {
    this.setState({selectedEnvironment: selectedOption}, this.setTextContent);
    this.setState({resetButton: false});
 
    console.log(selectedOption.label);
  }
 
  handleOrigin = (selectedOption) => {
 
    this.setState({selectedOrigin: selectedOption});

    if (selectedOption.label === this.state.selectedTarget.label){
      this.setState({selectedTarget: ''});
    }
 
    if (selectedOption.label === "CURR"){
      this.setState({targetItems: [{ label: "NEXT", value: 2 }]});
    }
    else{
      this.setState({targetItems: [{ label: "CURR", value: 1 }]});
    }
    console.log(selectedOption.label);
  }
 
  handleTarget = (selectedOption) => {
 
    this.setState({selectedTarget: selectedOption}, this.setTextContent);
      
    console.log(selectedOption.label);
  }
 
  handleDate = (selectedDate) => {
 
    this.setState({selectedDate: selectedDate}, this.setTextContent);

    console.log(this.getFormattedDate(selectedDate));
    console.log(selectedDate);
  }
 
  getFormattedDate = (date) => {
 
    let year = date.getYear() - 100;
 
    let month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;
 
    let day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
   
    return month + day + year;
  }
 
  setTextContent = () => {
 
    if (this.isAllSelected()){
      const appId = this.state.selectedAppid.label;
      const env = this.state.selectedEnvironment.label;
      const origin = this.state.selectedOrigin.label;
      const target = this.state.selectedTarget.label;
      const date = this.getFormattedDate(this.state.selectedDate);  
      
      const instructionsL1 = `Move all ${appId} clients to ${target}:`;
      const instructionsL2 = `Run the below curl command on a ${env}_${target} batch server to move all clients from ${env}_${origin} to ${env}_${target}.`;
      const instructionsL3 = `curl -v "http://localhost:8080/pod_manager_app/migrBatch?batchID=ALL_VERS-${env}_${origin}&migrID=${appId}_${env}_${origin}_TO_${target}_${date}&versChgAppID=${appId}"`;

      const instructions = instructionsL1 + "\n\n" + instructionsL2 + "\n" + instructionsL3;
      this.setState({instructionsFile: instructions});
        
      const rollbackL1 = `Rollback for Move all ${appId} clients to ${target}`;
      const rollbackL2 = `1. Please run below script on ${env}(PSP2X01S_SVC1) by connecting either as user "COMMON" or DBA (sys/system).`;
      const rollbackL3 = `INSERT INTO common.mg_batch_client (batch_id, client_oid)`;
      const rollbackL4 = `SELECT '${date}_ROLLBK_${appId}_${env}' batch_id, acs_client_oid client_oid FROM common.mg_summary WHERE migration_id = '${appId}_${env}_${origin}_TO_${target}_${date}';`;
      const rollbackL5 = `2. Commit the transaction.`;
      const rollbackL6 = `3. Attach the logs.`;
      const rollbackL7 = `4. Run the CURL command below on IAT2_CURR batch server:`;
      const rollbackL8 = `curl -v "http://localhost:8080/pod_manager_app/migrBatch?batchID=${date}_ROLLBK_${appId}_${env}&migrID=ROLLBACK_${appId}_${env}_${origin}_TO_${target}_${date}&versChgAppID=${appId}"`;
    
      const rollback = `${rollbackL1}\n\n${rollbackL2}\n${rollbackL3}\n${rollbackL4}\n\n${rollbackL5}\n\n${rollbackL6}\n\n${rollbackL7}\n${rollbackL8}`;
      this.setState({rollbackFile: rollback});
    }
    console.log('clicked');
  }

  handleInstructionDL = () => {

    const fileName = this.state.selectedAppid.label + "-EZ-instructions";
    const fileContent = this.state.instructionsFile;
    
    var link = document.createElement("a");
    link.setAttribute("target","_blank");

    if(Blob !== undefined) {
        var blob = new Blob([fileContent], {type: "text/plain"});
        link.setAttribute("href", URL.createObjectURL(blob));
    } else {
        link.setAttribute("href","data:text/plain," + encodeURIComponent(fileContent));
    }

    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log('clicked');
  }

  handleRollBackDL = () => {

    const fileName = this.state.selectedAppid.label + "-EZ-rollback";
    const fileContent = this.state.rollbackFile;
   
    var link = document.createElement("a");
    link.setAttribute("target","_blank");

    if(Blob !== undefined) {
        var blob = new Blob([fileContent], {type: "text/plain"});
        link.setAttribute("href", URL.createObjectURL(blob));
    } else {
        link.setAttribute("href","data:text/plain," + encodeURIComponent(fileContent));
    }

    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log('clicked');
  }
 
  handleResetButton = () => {
 
    this.setState({selectedAppid: ''});
    this.setState({selectedEnvironment: ''});
    this.setState({selectedOrigin: ''});
    this.setState({selectedTarget: ''});
    this.setState({selectedDate: ''});
    this.setState({selectedFile: 'No File Chosen'});
    this.setState({environmentItems: []});
    this.setState({targetItems: [
      { label: "CURR", value: 1 },
      { label: "NEXT", value: 2 },
    ]});
    this.setState({targetItems: [
      { label: "CURR", value: 1 },
      { label: "NEXT", value: 2 },
    ]});
    this.setState({popUpDisabled: true});
  }
 
  isAllSelected = () => {
 
    const appId = this.state.selectedAppid;
    const env = this.state.selectedEnvironment;
    const origin = this.state.selectedOrigin;
    const date = this.state.selectedDate;

    if (appId !== "" && env !== "" && origin !== "" && date !== ""){
      console.log (appId.label + ' - ' + env.label + ' - ' + origin.label + ' - ' + date);
      this.setState({popUpDisabled: false});
      return true;
    }

    return false;
  }

  handleFileRead = (fileReader) => {
    //const clientList = fileReader.result;
    const clients = fileReader.result.split(' ').join('\n').split(',').join('\n').split('\n');

    const l1 = 'Select COID FROM (\n';
    let body = '';
    const l2 = 'Where COID NOT IN (\n';
    const l3 = 'Select A.client_oid FROM ADP_CLIENT.PORTAL_CLIENT A, ADP_CLIENT.ACS_CLIENT b, COMMON.CLIENT_POD_INFO c, ADP_CLIENT.ACS_CLIENT_APP d WHERE A.CLIENT_OID = b.CLIENT_OID AND A.CLIENT_OID = c.CLIENT_OID AND A.CLIENT_OID = d.CLIENT_OID AND d.app_id = \'' + this.state.selectedAppid.label + '\');';

    for(let i = 0; i < clients.length; i++){
      if ((i+1) === clients.length ){
        body = body + `Select '${clients[i]}' as COID FROM dual )\n`;
      } else {
        body = body + `Select '${clients[i]}' as COID FROM dual UNION\n`;
      }
    }

    const checkClientsIntegritySql = l1 + body + l2 + l3;

    //console.log(clientList);
    console.log(checkClientsIntegritySql);
  
    // … do something with the 'content' …
  };

  render() {
 
    const appIdDropdown = (
      <div>
        <strong>AppID:</strong>
        <Select      
          options={this.state.appidItems}
          onChange={this.handleAppId}
          value={this.state.selectedAppid} />       
        <p></p>
      </div>
    );
 
    const envDropdown = (
      <div>
        <strong>Environment:</strong> 
        <Select
          options={this.state.environmentItems}
          onChange={this.handleEnvironment}
          value={this.state.selectedEnvironment} />
        <p></p>
      </div>
    );
 
    const originDropdown = (
      <div>
        <strong>From:</strong>
        <Select
          options={this.state.originItems}
          onChange={this.handleOrigin}
          value={this.state.selectedOrigin} />
        <p></p>
      </div>
    );
 
    const targetDropdown = (
      <div>
        <strong>To:</strong>
        <Select
          options={this.state.targetItems}
          onChange={this.handleTarget}
          value={this.state.selectedTarget} /> 
        <p></p>
      </div>
    );
 
    const datePicker = (
      <div>
        <strong>Migration Date:</strong>
        <div>
          <DatePicker
            minDate={new Date()}
            selected={this.state.selectedDate}
            onChange={this.handleDate} />
        </div>
        <p></p>
      </div>
    );
 
    const fileInput = (
      <div>
        <FileInput
          handleFileRead = {this.handleFileRead}/>
        <br/>
      </div>
    );

    const resetButton = (            
      <Button          
        onClick={this.handleResetButton}
        variant="contained"
        color="secondary">
        Reset
      </Button>      
    );

    const genInstructionsButton = (           
      <Button
        variant="contained"
        color="primary">
        Generate Instructions
      </Button>
    );

    const InstructionsPopupButton = (           
      <ModalPopup
        trigger = {genInstructionsButton}
        disabled = {this.state.popUpDisabled}
        file1 = {this.state.instructionsFile}
        file2 = {this.state.rollbackFile}
        onClick1 = {this.handleInstructionDL}
        onClick2 = {this.handleRollBackDL}
      />         
    );

    const sectionStyle = {
      width: "100%",
      height: "935px",
      backgroundImage: "url(" + Background + ")"
    };

    return (
      <section style={ sectionStyle }>
        <div>
          <div className="container">
            <div className="row">
                <h1 text-align= "center">Client Move</h1>
                <br/>
                {appIdDropdown}
                {envDropdown}
                {originDropdown}
                {targetDropdown}
                {datePicker}
                {fileInput}
                {InstructionsPopupButton}
                &nbsp;
                {resetButton}
            </div>
          </div>
        </div>
      </section>
    );
  }
}
 
export default App;