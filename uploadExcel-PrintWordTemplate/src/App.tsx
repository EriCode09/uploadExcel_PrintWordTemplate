import { useEffect, useRef, useState } from 'react'
import { FileUploader } from "baseui/file-uploader";
import { Button } from "baseui/button";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import * as XLSX from "xlsx";

import { saveAs } from 'file-saver';
import JSZip from 'jszip';

// import * as Docxtemplater from 'docx-templates';
import Docxtemplater from 'docxtemplater';

// Styleron for BaseUI Components
import { Provider as StyletronProvider } from 'styletron-react';
import { Client as Styletron } from 'styletron-engine-atomic';
const engine = new Styletron();

// Asignamos tipado a los datos que sacamos del JSON
type Data = {
  Nombre: string,
  Apellido: string,
  Dirección: string,
  Telefono: number,
  Edad: number,
  Template: string,
}


function App() {

  // Subida excel
  const [file, setFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Estado donde se subirán los datos del excel en formato JSON.
  const [docData, setDocData] = useState<Data[]>([])
  const [template, setTemplate] = useState(null);


  // Manejamos la subida de datos y asignamos el primer archivo al estado 'File'
  const handleFileUpload = (acceptedfiles: File[], rejectedFiles: File[]) => {
    
    // console.log(acceptedfiles)
    // console.log("Rejected: " + rejectedFiles)
    
    if (acceptedfiles.length > 0) {
      const firstFile = acceptedfiles[0];
      setFile(firstFile);
      if (file !== null) convertToJson(file)
    } else {
      console.log("Documentos rechazados: " + rejectedFiles);
    }

  };

  // Convertimos los datos de Excel en JSON.
  const convertToJson = (file: File) => {

    if (file === null) {
      return;
    }

    try {
      console.log(file)
      const fileReader = new FileReader();
      fileReader.readAsBinaryString(file);
      fileReader.onload = (event: ProgressEvent<FileReader>) => {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json<Data>(worksheet);
        setDocData(jsonData);
        console.log(docData);
      };

    } catch (error) {
      
      console.log("No se ha podido convertir la información a JSON: " + error);

    }

  };

  const modifyTemplateAndDowload = async () => {
    const response = await fetch('templateData.docx')
    // const response = await axios.get('/templateData.docx')
    console.log(response)
    const buffer = await response.arrayBuffer();
    console.log(buffer)
    const zip = await JSZip.loadAsync(buffer);
    const doc = new Docxtemplater();
    doc.loadZip(zip);
    doc.setData(docData);
    doc.render();
    console.log(doc)
    const output = doc.getZip().generate({ type: 'blob' });
    saveAs(output, 'documento.docx');
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

        <Button onClick={modifyTemplateAndDowload}>Descargar Doc</Button>

      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </StyletronProvider>
  )
}

export default App
