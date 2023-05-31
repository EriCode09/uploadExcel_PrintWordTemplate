import { useEffect, useState } from 'react'
import { FileUploader } from "baseui/file-uploader";
import { Button } from "baseui/button";
import wordLogo from '/word.png'
import excelLogo from '/excel.png'
import './App.css'
import * as XLSX from "xlsx";

import { TemplateData, TemplateHandler } from 'easy-template-x';

// Styleron for BaseUI Components
import { Provider as StyletronProvider } from 'styletron-react';
import { Client as Styletron } from 'styletron-engine-atomic';
const engine = new Styletron();

// Asignamos tipado a los datos que sacamos del JSON
type Data = {
  id: number,
  Nombre: string,
  Servicios: Array<{ servicio: string } | string>,
  Dirección: string,
  Telefono: number,
  Edad: number,
  Template: string,
  TransformarDocx: boolean,
  Horas: Array<{ horas: number } | number>,
  PreciosHora: Array<{ precio: number } | number>,
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

  async function DownloadNewDocs() {
  
  const newDocs = await Promise.all(
      docData.map( async (item) => {

        
        // Asignamos todos los datos del registro en un objeto JSON
        const data: any = {
          "data": [
            {
              "id": item.id,
              "Template": item.Template,
              "TransformarDocx": item.TransformarDocx,
              "Nombre": item.Nombre,
              "Servicios": [],
              "Edad": item.Edad,
              "Telefono": item.Telefono,
              "Dirección": item.Dirección,
              "Horas": [],
              "PreciosHora": [],
            }
          ]
        }
        
        const existingData = docData.map(data => data);
        const searchSameidData = existingData.filter(data => data.id === item.id);

        searchSameidData.forEach((datos: any) => {

          data.data[0].Servicios.push({servicio: datos.Servicios});
          data.data[0].Horas.push({horas : datos.Horas});
          data.data[0].PreciosHora.push({precio: datos.PreciosHora});

        })

        // const serviceArray = item.Apellido.split('\r\n')
        
        // serviceArray.forEach((service: any) => {
          //   data.data[0].Apellido.push({"service": service})  
        // })
        
        try {
          console.log(data);
          // Filtramos por los documentos que no quieren ser transformados a docx.
          if (item.TransformarDocx !== false) {
  
            // Seleccionamos la plantilla que deseamos
  
            if (item.Template === 'plantilla') {
              const response = await fetch('/plantilla.docx');
              console.log(response);
              const templateFile = await response.blob();
              const handler = new TemplateHandler();
              const doc = await handler.process(templateFile, data);
              saveFile(`Doc${item.id} - ${item.Nombre}.docx`,doc);
            }
  
            else if(item.Template === 'plantillaDatos') {
              const response = await fetch('/plantillaDatos.docx');
              console.log(response);
              const templateFile = await response.blob();
              const handler = new TemplateHandler();
              const doc = await handler.process(templateFile, data);
              saveFile(`Doc${item.id} - ${item.Nombre}.docx`,doc);
            }
  
          }
          
        } catch (error) {

          console.log('No se ha podido descargar el documento por el siguiente error: ' + error )
          
        }
      })
    )
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

  return (
    <StyletronProvider value={engine}>
      <div>
        <a href="" target="_blank">
          <img src={excelLogo} className="logo excel" alt="Excel logo" />
        </a>
        <a href="" target="_self">
          <img src={wordLogo} className="logo" alt="Word logo" />
        </a>
      </div>

      <h1>Excel to Word Template</h1>

      {docData && docData.length === 0 && (<p className='read-the-docs'> First, you need to upload an Excel file... </p>)}

      <div className="card">
      <FileUploader 
      errorMessage={errorMessage} 
      accept='.xlsx' 
      onDrop={handleFileUpload}
      />

    {docData && docData.length > 0 && (<Button style={{marginTop: 20}} onClick={DownloadNewDocs}> Download Docx </Button>)}
    {docData && docData.length > 0 && (<p className='read-the-docs'> Press the button to download transformed files! </p>)}

    
      </div>

    </StyletronProvider>
  )
}

export default App
