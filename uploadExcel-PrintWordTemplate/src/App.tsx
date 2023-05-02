import { ChangeEvent, useState } from 'react'
import { FileUploader } from "baseui/file-uploader";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import * as XLSX from "xlsx";


import { Provider as StyletronProvider } from 'styletron-react';
import { Client as Styletron } from 'styletron-engine-atomic';
const engine = new Styletron();

function App() {
  const [count, setCount] = useState(0)
  const [file, setFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileUpload = (acceptedfiles: File[], rejectedFiles: File[]) => {
    
    // console.log(acceptedfiles)
    // console.log("Rejected: " + rejectedFiles)
    
    if (acceptedfiles.length > 0) {
      const firstFile = acceptedfiles[0];
    setFile(firstFile);
    console.log(file)
      if (file !== null) {
        convertToJson(file)
      }
    } else {
      console.log("Documentos rechazados: " + rejectedFiles);
    }

  };

  const convertToJson = (file: File) => {

    if (!file) {
      return;
    }

    try {
      
      const fileReader = new FileReader();
      fileReader.readAsBinaryString(file);
      fileReader.onload = (event: ProgressEvent<FileReader>) => {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        console.log(jsonData);
      };

    } catch (error) {
      
      console.log("No se ha podido convertir la información a JSON: " + error);

    }

  };


  return (
    <StyletronProvider value={engine}>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <h1>Excel to Word Template</h1>

      <div className="card">
      <FileUploader 
      errorMessage={errorMessage} 
      accept='.xlsx' 
      onDrop={handleFileUpload}
      />

        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </StyletronProvider>
  )
}

export default App
