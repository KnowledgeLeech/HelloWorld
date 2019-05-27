import React, { Component } from 'react';
import Select from 'react-select';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from '@material-ui/core/Button';
import ModalPopup from './Components/ModalPopup';
import './App.css';
import FileInput from "./Components/FileInput";
import Background from './IMGs/background4.jpg';
import RadioButton from "./Components/RadioButton";
 
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

    farmItems: [
      { label: "Farm 1", value: 1 },
      { label: "Farm 2", value: 2 },
      { label: "Farm 3", value: 3 },
      { label: "Farm 4", value: 4 },
      { label: "Farm 5", value: 5 },
      { label: "Farm 6", value: 6 },
    ],

    selectedAppid: '',
    selectedEnvironment: '',
    selectedOrigin: '',
    selectedTarget: '',
    selectedDate: '',
    selectedType: '',
    selectedFarms: '',
    
    instructionsFiles: '',
    rollbackFiles: '',

    popUpDisabled: true,

    envButton: 0,
    originButton: 0,
    targetButton: 0,
    dateButton: 0,
    typeButton: 0,
    fileInputButton: 0,
    datapodsButton: 0,
    farmsButton: 0,
    generateButton: 0,
  }
 
  handleAppId = (selectedOption) => {
 
    this.setState({selectedAppid: selectedOption});
    this.setState({selectedEnvironment: ''});
    this.setState({envButton: 1});
 
    if (selectedOption.label === "WFNPortal"){
      this.setState(
        {environmentItems: [
          { label: "IAT1", value: 1 },
          { label: "UAT1", value: 2 },
          { label: "PROD2", value: 3 },
        ],
        selectedType: '',
        farmsButton: 0,
        fileInputButton: 0,
        generateButton: 0,
        selectedFarms: [],
      });
    } else {
      this.setState(
        {environmentItems: [
          { label: "IAT2", value: 1 },   
          { label: "UAT2", value: 2 },   
          { label: "PROD1", value: 3 }, 
        ],
        selectedType: '',
        farmsButton: 0,
        fileInputButton: 0,
        generateButton: 0,
        selectedFarms: [],
      });
    }
    console.log(selectedOption.label);
    console.log(this.state.appIdButton);
  }
 
  handleEnvironment = (selectedOption) => {
    this.setState({selectedEnvironment: selectedOption});
    this.setState({resetButton: false});

    this.setState(
      {originButton: 1}
    );

    console.log(selectedOption.label);
    console.log(this.state.origindButton);

  }
 
  handleOrigin = (selectedOption) => {
 
    this.setState({selectedOrigin: selectedOption});

    this.setState(
      {targetButton: 1}
    );

    if (selectedOption.label === this.state.selectedTarget.label){
      this.setState({selectedTarget: '',});
    }
 
    if (selectedOption.label === "CURR"){
      this.setState({targetItems: [{ label: "NEXT", value: 2 }]});
    }
    else{
      this.setState({targetItems: [{ label: "CURR", value: 1 }]});
    }
    console.log(selectedOption.label);
    console.log(this.state.targetButton);
  }
 
  handleTarget = (selectedOption) => {
 
    this.setState({selectedTarget: selectedOption});

    this.setState({dateButton: 1});
      
    console.log(selectedOption.label);
    console.log(this.state.dateButton);
  }

  handleDate = (selectedDate) => {
 
    this.setState({selectedDate: selectedDate});

    this.setState({typeButton: 1});

    console.log(this.getFormattedDate(selectedDate));
    console.log(selectedDate);
    console.log(this.state.typeButton);
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

  manageFiles = (selectedType) => {
    console.log('manageFiles -> selectedType: ' + selectedType + ' - GenerateButton: ' + this.state.generateButton);
  
    if(this.state.selectedAppid.label === 'WFNPortal'){
      if(this.state.selectedType === 'GA'){
        this.generateFilesWFNGA();
      }
      if(this.state.selectedType === 'pilot'){
        this.generateFilesWFNPilot();
      }
    } else {
      if(selectedType === 'GA'){
        this.generateFilesOtherGA();
      }
      if(this.state.selectedType === 'pilot'){
        this.generateFilesOtherPilot();
      }
    }
  }
   
  generateFilesWFNGA = () => {


  }

  generateFilesWFNPilot = () => {

    
  }

  generateFilesOtherGA = () => {
    const appId = this.state.selectedAppid.label;
    const env = this.state.selectedEnvironment.label;
    const origin = this.state.selectedOrigin.label;
    const target = this.state.selectedTarget.label;
    const date = this.getFormattedDate(this.state.selectedDate);  
    
    const instructionsL1 = `Move all ${appId} clients to ${target}:`;
    const instructionsL2 = `Run the below curl command on a ${env}_${target} batch server to move all clients from ${env}_${origin} to ${env}_${target}.`;
    const instructionsL3 = `curl -v "http://localhost:8080/pod_manager_app/migrBatch?batchID=ALL_VERS-${env}_${origin}&migrID=${appId}_${env}_${origin}_TO_${target}_${date}&versChgAppID=${appId}"`;

    const instructions = instructionsL1 + "\n\n" + instructionsL2 + "\n" + instructionsL3;
    this.setState({instructionsFiles: instructions});
      
    const rollbackL1 = `Rollback for Move all ${appId} clients to ${target}`;
    const rollbackL2 = `1. Please run below script on ${env}(PSP2X01S_SVC1) by connecting either as user "COMMON" or DBA (sys/system).`;
    const rollbackL3 = `INSERT INTO common.mg_batch_client (batch_id, client_oid)`;
    const rollbackL4 = `SELECT '${date}_ROLLBK_${appId}_${env}' batch_id, acs_client_oid client_oid FROM common.mg_summary WHERE migration_id = '${appId}_${env}_${origin}_TO_${target}_${date}';`;
    const rollbackL5 = `2. Commit the transaction.`;
    const rollbackL6 = `3. Attach the logs.`;
    const rollbackL7 = `4. Run the CURL command below on IAT2_CURR batch server:`;
    const rollbackL8 = `curl -v "http://localhost:8080/pod_manager_app/migrBatch?batchID=${date}_ROLLBK_${appId}_${env}&migrID=ROLLBACK_${appId}_${env}_${origin}_TO_${target}_${date}&versChgAppID=${appId}"`;
  
    const rollback = `${rollbackL1}\n\n${rollbackL2}\n${rollbackL3}\n${rollbackL4}\n\n${rollbackL5}\n\n${rollbackL6}\n\n${rollbackL7}\n${rollbackL8}`;
    this.setState({rollbackFiles: rollback});

    console.log('generateFilesOtherGA -> ' + appId + ' - ' + env + ' - ' + origin + ' - ' + target + ' - ' + date);
  }

  generateFilesOtherPilot = () => {

    
  }

  handleInstructionDL = () => {

    const fileName = this.state.selectedAppid.label + "-EZ-instructions";
    const fileContent = this.state.instructionsFiles;
    
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
    const fileContent = this.state.rollbackFiles;
   
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
 
    this.setState({
      selectedAppid: '',
      selectedEnvironment: '',
      selectedOrigin: '',
      selectedTarget: '',
      selectedDate: '',
      selectedType: '',
      selectedFile: 'No File Chosen',
      environmentItems: [],
      originItems: [
        { label: "CURR", value: 1 },
        { label: "NEXT", value: 2 },
      ],
      targetItems: [
        { label: "CURR", value: 1 },
        { label: "NEXT", value: 2 },
      ],
      selectedFarms: [],
      envButton: 0,
      originButton: 0,
      targetButton: 0,
      dateButton: 0,
      typeButton: 0,
      fileInputButton: 0,
      datapodsButton: 0,
      generateButton: 0,
      farmsButton: 0,
      instructionsFiles: '',
      rollbackFiles: '',
    });
  }
 
  isAllSelected = () => {
 
    const appId = this.state.selectedAppid;
    const env = this.state.selectedEnvironment;
    const origin = this.state.selectedOrigin;
    const date = this.state.selectedDate;

    if (appId !== "" && env !== "" && origin !== "" && date !== ""){
      console.log (appId.label + ' - ' + env.label + ' - ' + origin.label + ' - ' + this.getFormattedDate(date))
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

    if(this.state.selectedAppid.label !== 'WFNPortal'){
      this.setState({generateButton: 1});
    } else {
      this.setState({farmsButton: 1});
    }

    console.log(l1 + body + l2 + l3);
  };

  handleType = (event) => {

    const selectedType = event.target.value;
    
    this.setState({selectedType: selectedType});

    if(this.state.selectedAppid.label !== 'WFNPortal'){
      if(selectedType === 'GA'){
        this.setState({generateButton: 1});
        this.setState({fileInputButton: 0}, this.manageFiles(selectedType));   
      }
      if(selectedType === 'pilot'){
        this.setState({
          fileInputButton: 1,
          generateButton: 0});
      }
    } else {
      if(selectedType === 'GA'){
        this.setState({
          farmsButton: 1,
          fileInputButton: 0,
          generateButton: 0,
          selectedFarms: [],});
      }
      if(selectedType === 'pilot'){
        this.setState({
          fileInputButton: 1,
          farmsButton: 0,
          generateButton: 0,
          selectedFarms: [],});
      }
    }
  };

  handleFarms = (selectedFarms) => {
    this.setState({selectedFarms: selectedFarms});

    if(this.state.selectedType === 'GA'){
      this.setState({generateButton: 1});
    }
    if(this.state.selectedType === 'pilot'){
      this.setState({generateButton: 1});
    }

    for(let i = 0; i < selectedFarms.length; i++){
      console.log(selectedFarms[i].label);
    }
  };
  
  render() {
 
    const appIdDropdown = (
      <div>
        <strong>AppID:</strong>
        <Select      
          options={this.state.appidItems}
          onChange={this.handleAppId}
          value={this.state.selectedAppid} />       
        <br/>
      </div>
    );
 
    let envDropdown = null;
    if(this.state.envButton === 1) {
      envDropdown = (
        <div>
          <strong>Environment:</strong> 
          <Select
            options={this.state.environmentItems}
            onChange={this.handleEnvironment}
            value={this.state.selectedEnvironment} />
          <br/>
        </div>
      );
    }
 
    let originDropdown = null;
    if(this.state.originButton === 1) {
      originDropdown = (
        <div>
          <strong>From:</strong>
          <Select
            options={this.state.originItems}
            onChange={this.handleOrigin}
            value={this.state.selectedOrigin} />
          <br/>
        </div>
      );
    }
 
    let targetDropdown = null;
    if(this.state.targetButton === 1) {
      targetDropdown = (
        <div>
          <strong>To:</strong>
          <Select
            options={this.state.targetItems}
            onChange={this.handleTarget}
            value={this.state.selectedTarget} /> 
          <br/>
        </div>
      );
    }
 
    let datePicker = null;
    if(this.state.dateButton === 1) {
      datePicker = (
        <div>
          <strong>Date:</strong>
          <div>
            <DatePicker
              minDate={new Date()}
              selected={this.state.selectedDate}
              onChange={this.handleDate} />
          </div>
          <br/>
        </div>
      );
    }
 
    let fileInput = null;
    if(this.state.fileInputButton === 1) {
      fileInput = (
        <div>
          <FileInput
            handleFileRead={this.handleFileRead} />
          <br/>
        </div>
      );
    }

    let typeRadioButton = null;
    if(this.state.typeButton === 1) {
      typeRadioButton = (
        <div>
          <RadioButton
            handleSelected={this.handleType}
            value={this.state.selectedType} />
          <br/>
        </div>
      );
    }

    let farmsMultiSelect = null;
    if(this.state.farmsButton === 1) {
      farmsMultiSelect =(
        <div>
          <strong>Farms:</strong>
          <Select        
            isMulti
            name="farms"
            options={this.state.farmItems}
            className="basic-multi-select"
            classNamePrefix="select"          
            value={this.state.selectedFarms}
            onChange={this.handleFarms}
          />
          <br/>
        </div>
      );
    }

    const resetButton = (    
      <Button          
        onClick={this.handleResetButton}
        variant="contained"
        color="default">
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

    let generateAndResetButtons = resetButton;
    if(this.state.generateButton === 1) {
      generateAndResetButtons = (           
        <div>
          <ModalPopup
          trigger = {genInstructionsButton}
          instructionsFiles = {this.state.instructionsFiles}
          rollbackFiles = {this.state.rollbackFiles}
          onClick1 = {this.handleInstructionDL}
          onClick2 = {this.handleRollBackDL}
          />
          &nbsp;
          {resetButton}
        </div>
      );
    }

    const sectionStyle = {
      width: "100%",
      height: "935px",
      backgroundImage: "url(" + Background + ")"
    };

    return (
      <section style={ sectionStyle }>
        <div>
          <br/><br/><br/><br/> 
          <div className="center">
          <div ><h1>Client Move</h1></div>
            <div className="row">
                {appIdDropdown}
                {envDropdown}
                {originDropdown}
                {targetDropdown}
                {datePicker}
                {typeRadioButton}
                {fileInput}
                {farmsMultiSelect}
                {generateAndResetButtons}
            </div>
          </div>
        </div>
      </section>
    );
  }
}
 
export default App;
