import React from 'react';

const ImportFromFileBodyComponent = (props) => {
    
    const handleFileChosen = (file) => {
        if (file != null) {
            let fileReader;
            fileReader = new FileReader();
            fileReader.onloadend = props.handleFileRead.bind(this, fileReader);
            fileReader.readAsText(file);
        }
    };

    return <div className='upload-expense'>
        <strong>Batch Migration</strong>
        <button className="buttonTooltip" data-tooltip="For batch migrations select a text file with the clientOids (one clientOid per line)">?</button>
        <br/>
        <input type='file'
            id='file'
            className='input-file'
            accept='.txt'
            onChange={e => handleFileChosen(e.target.files[0])}
            />
    </div>;
};

export default ImportFromFileBodyComponent;

