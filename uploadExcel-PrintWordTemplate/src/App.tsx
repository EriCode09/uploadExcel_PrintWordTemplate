import { useEffect, useRef, useState } from 'react'
import { FileUploader } from "baseui/file-uploader";
import { Button } from "baseui/button";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import * as XLSX from "xlsx";

import { TemplateHandler } from 'easy-template-x';

// Styleron for BaseUI Components
import { Provider as StyletronProvider } from 'styletron-react';
import { Client as Styletron } from 'styletron-engine-atomic';
const engine = new Styletron();

// Asignamos tipado a los datos que sacamos del JSON
type Data = {
  id: number,
  Nombre: string,
  Apellido: string,
  Dirección: string,
  Telefono: number,
  Edad: number,
  Template: string,
}

type DataObject = {
  [key: string]: Data;
}


function App() {

  // Subida excel
  const [file, setFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Estado donde se subirán los datos del excel en formato JSON.
  const [docData, setDocData] = useState<Data[]>([])


  // Manejamos la subida de datos y asignamos el primer archivo al estado 'File'
  const handleFileUpload = (acceptedfiles: File[], rejectedFiles: File[]) => {
    
    // console.log(acceptedfiles)
    // console.log("Rejected: " + rejectedFiles)
    
    if (acceptedfiles.length > 0) {
      const firstFile = acceptedfiles[0];
      setFile(firstFile);
    } else {
      console.log("Documentos rechazados: " + rejectedFiles);
    }

  };

  useEffect(() => {
    if (file !== null) {
      convertToJson(file);
    }
  }, [file]);

  // Convertimos los datos de Excel en JSON.
  const convertToJson = (file: File) => {

    // if (file !== null) {
    //   return;
    // }

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
        // Almacenamos en el estado todos los datos en JSON
        setDocData(jsonData);
      };

    } catch (error) {
      
      console.log("No se ha podido convertir la información a JSON: " + error);

    }

  };

  
  // Se utiliza reduce para pasar la información al formato necesario
  const dataObject: DataObject = docData.reduce((obj, item) => {
    obj[item.Nombre] = item;
    return obj;
  }, {} as DataObject);

  // Método 1 con easy-template-x

  // const [loading, setLoading] = useState(false);
  // const [url, setUrl] = useState<string | null>(null);


  // const generateReport = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await fetch('plantilla.docx');
  //     const templateFile =  await response.blob();
  //     const handler = new TemplateHandler();
  //     const result = await handler.process(templateFile, dataObject);
  //     const blob = new Blob([result], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
  //     const url = URL.createObjectURL(blob);
  //     console.log(url)
  //     setUrl(url);
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };


// Metodo 2 con easy-template-x

  async function DownloadNewDoc() {
    const response = await fetch('/plantilla.docx');
    console.log(dataObject);
    console.log(response);
    const templateFile = await response.blob();
    const handler = new TemplateHandler();
    const doc = await handler.process(templateFile, dataObject);
    saveFile('doc1.docx',doc);
  }

  function saveFile(filename: string, blob: Blob) {

    // see: https://stackoverflow.com/questions/19327749/javascript-blob-filename-without-link

    // get downloadable url from the blob
    const blobUrl = URL.createObjectURL(blob);

    // create temp link element
    let link: HTMLAnchorElement | null = document.createElement("a");
    link.download = filename;
    link.href = blobUrl;

    // use the link to invoke a download
    document.body.appendChild(link);
    link.click();

    // remove the link
    setTimeout(() => {

      if (link !== null) {
        link.remove();
        window.URL.revokeObjectURL(blobUrl);
        link = null;
      }

      else return;

    }, 0);
}

  // Método 1 con JSZip 

  // const modifyTemplateAndDowload = async () => {
  //   const response = await fetch('templateData.docx')
  //   // const response = await axios.get('/templateData.docx')
  //   console.log(response)
  //   const buffer = await response.arrayBuffer();
  //   console.log(buffer)
  //   const zip = await JSZip.loadAsync(buffer);
  //   const doc = new Docxtemplater();
  //   doc.loadZip(zip);
  //   doc.setData(docData);
  //   doc.render();
  //   console.log(doc)
  //   const output = doc.getZip().generate({ type: 'blob' });
  //   saveAs(output, 'documento.docx');
  // };

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

    {/* {loading && <p>Generando informe...</p>}
    {url && (
      <a href={url} download="informe.docx">
        Descargar informe
      </a>
    )}
    
    {!loading && !url && (
      <button onClick={generateReport}>Generar informe</button>
    )} */}

    <Button style={{marginTop: 20}} onClick={DownloadNewDoc}> Download Docx </Button>

      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </StyletronProvider>
  )
}

export default App
