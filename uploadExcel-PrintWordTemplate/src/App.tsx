import { useEffect, useState } from "react";
import { FileUploader } from "baseui/file-uploader";
import { Button } from "baseui/button";
import * as XLSX from "xlsx";
import Waves from "./components/Waves";

// Imagenes y estilos
import wordLogo from "/word.png";
import excelLogo from "/excel.png";
import "./App.css";

// Manipular la conversión de datos
import { TemplateData, TemplateHandler } from "easy-template-x";

// Styleron for BaseUI Components
import { Provider as StyletronProvider } from "styletron-react";
import { Client as Styletron } from "styletron-engine-atomic";
import { Select } from "baseui/select";
const engine = new Styletron();

// Asignamos tipado a los datos que sacamos del JSON

// type Data2 = {
//   id: number;
//   Nombre: string;
//   Servicios: Array<{ servicio: string } | string>;
//   Dirección: string;
//   Telefono: number;
//   Edad: number;
//   Template: string;
//   TransformarDocx: boolean;
//   Horas: number;
//   PreciosHora: number;
//   DescuentoServicio: number;
//   PrecioServicio: number;
//   PrecioTotal: number;
// };

type Data = {
  id: number;
  Titulo_Servicio: string;
  Manager: string;
  Fecha_Preparación: number;
  Area_Soporte: string;
  Precio_Final: number;
  Fecha_Inicio: number;
  Fecha_Fin: number;
  AM: string;
  Teléfono: number;
  Mail: string;
  Posición_Manager: string;
  Teléfono_Manager: string;
  Mail_Manager: string;
  Descripción_Servicio: string;
  Servicios: Array<{ servicio: string } | string>;
  Perfil: string;
  Horas: number;
  Precio_Hora: number;
  PrecioHora_SinDescuento: number;
  Precio_Servicio: number;
  PrecioTotal_SinDescuento: number;
  Template: string;
  TransformarDocx: boolean;
  PrecioServicio_Total: number;
}

function App() {
  // Subida excel
  const [file, setFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Estado donde se subirán los datos del excel en formato JSON.
  const [docData, setDocData] = useState<Data[]>([]);

  // Handler para manejar el archivo seleccionado en el desplegable.
  const [selectedFile, setSelectedFile] = useState(null);

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
      console.log(docData);
    }
  }, [file]);

  // Convertimos los datos de Excel en JSON.
  const convertToJson = (file: File) => {
    try {
      console.log(file);
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
      docData.map(async (item) => {
        // Asignamos todos los datos del registro en un objeto JSON
        const data: any = {
          data: [
            {
              id: item.id,
              Template: item.Template,
              TransformarDocx: item.TransformarDocx,
              Servicios: [],
              Titulo_servicio: item.Titulo_Servicio,
              Manager: item.Manager,
              Fecha_preparacion: item.Fecha_Preparación,
              Area_soporte: item.Area_Soporte,
              Fecha_Inicio: item.Fecha_Inicio,
              Fecha_Fin: item.Fecha_Fin,
              AM: item.AM,
              Teléfono: item.Teléfono,
              Mail: item.Mail,
              Posicion_manager: item.Posición_Manager,
              Telefono_manager: item.Manager,
              Mail_manager: item.Mail_Manager,
              Descripcion_servicio: item.Descripción_Servicio,
              Perfil: item.Perfil,
              Horas: item.Horas,
              Precio_hora: item.Precio_Hora,
              PrecioHora_SinDescuento: item.PrecioHora_SinDescuento,
              PrecioTotal_SinDescuento: item.PrecioTotal_SinDescuento,
              Precio_Total: 0,
              Descuento_Total: 0,
            },
          ],
        };

        const existingData = docData.map((data) => data);
        const searchSameidData = existingData.filter(
          (data) => data.id === item.id
        );
        
        const ArrPrecioTotal: Array<number> = [];
        const ArrPrecioTotalSinDescuento: Array<number> = [];
        // const ArrDireccionesServi: Array<String> = [];

        const SumaPrecioServicio = (horas: number, precioHora: number) => {

          const total = precioHora * horas;

          const formattedTotal = total
          .toFixed(2)
          .replace(/\d(?=(\d{3})+\.)/g, '$&,')
          .concat('€');

          return formattedTotal;

        }

        const formatearNumero = (numero: number) => {

          const formattedTotal = numero          
          .toFixed(2)
          .replace(/\d(?=(\d{3})+\.)/g, '$&,')
          .concat('€');

          return formattedTotal;

        }

        searchSameidData.forEach((datos: any) => {
          

          const precioServicio = SumaPrecioServicio(datos.Horas, datos.Precio_Hora)
          ArrPrecioTotal.push(datos.Horas * datos.Precio_Hora);
          ArrPrecioTotalSinDescuento.push(datos.PrecioTotal_SinDescuento);
          // ArrDireccionesServi.push(datos.Dirección)

          // for (let i = 0; i < ArrDireccionesServi.length; i++) {
          //   for (let j = i + 1; j < ArrDireccionesServi.length; j++) {
          //     if (ArrDireccionesServi[i] === ArrDireccionesServi[j]) {
          //       ArrDireccionesServi.splice(j, 1); // Eliminar elemento repetido usando splice
          //       j--; // Ajustar la posición para evitar saltar elementos
          //     }
          //   }
          // }

          // data.data[0].Dirección = ArrDireccionesServi.toString();

          data.data[0].Servicios.push({
            servicio: datos.Perfil,
            horas: datos.Horas,
            precio: datos.Precio_Hora,
            precioServi: precioServicio
          });
        });

        function sumarPrecios(array: Array<number>) {
          let suma = 0;
          for (let i = 0; i < array.length; i++) {
            suma += array[i];
          }
          return suma;
        }
        
        // Calculo Precio Total sin Descuento
        data.data[0].PrecioTotal_SinDescuento = sumarPrecios(ArrPrecioTotalSinDescuento)
        
        // Formateo Precio Total Sin Descuento
        data.data[0].PrecioTotal_SinDescuento = formatearNumero(data.data[0].PrecioTotal_SinDescuento)

        // Calculo Precio Total
        data.data[0].Precio_Total = sumarPrecios(ArrPrecioTotal);
        // console.log(ArrPrecioTotal);

        // Formateo Precio Total
        data.data[0].Precio_Total = formatearNumero(data.data[0].Precio_Total)

        // Calculo Descuento Total
        data.data[0].Descuento_Total = sumarPrecios(ArrPrecioTotalSinDescuento) - sumarPrecios(ArrPrecioTotal) 
        // console.log(ArrDescuentosTotales);

        // Formateo Precio Total
        data.data[0].Descuento_Total = formatearNumero(data.data[0].Descuento_Total) 
        



        try {
          console.log(data);

          // Filtramos por los documentos que no quieren ser transformados a docx.
          if (item.TransformarDocx !== false) {
            
            // Realizamos el proceso de selección de la plantilla
            if (item.Template === "plantilla") {
              const response = await fetch("/plantilla.docx");
              console.log(response);
              const templateFile = await response.blob();
              const handler = new TemplateHandler();
              const doc = await handler.process(templateFile, data);
              saveFile(`Doc${item.id} - ${item.Titulo_Servicio}.docx`, doc);
            
            } else if (item.Template === "plantillaDatos") {
              const response = await fetch("/plantillaDatos.docx");
              console.log(response);
              const templateFile = await response.blob();
              const handler = new TemplateHandler();
              const doc = await handler.process(templateFile, data);
              saveFile(`Doc${item.id} - ${item.Titulo_Servicio}.docx`, doc);
            
            } else if (item.Template === "SOW BETWEEN - 23-HPI-XXX- Manager - Servicio - Iniciales AM") {
              const response = await fetch("/SOW BETWEEN - 23-HPI-XXX- Manager - Servicio - Iniciales AM.docx");
              console.log(response);
              const templateFile = await response.blob();
              const handler = new TemplateHandler();
              const doc = await handler.process(templateFile, data);
              saveFile(`Doc${item.id} - ${item.Titulo_Servicio}.docx`, doc);
            }

            /* 
             * Para añadir otra plantilla que pueda ser convertida
             * se añadirá la plantilla en su formato .docx a la
             * carpeta de "public" y añadiremos el siguient código 
            */

            /* 
            else if (item.Template === "NombrePlantillaSinExtensión") {
              const response = await fetch("/NombrePlantilla.docx");
              console.log(response);
              const templateFile = await response.blob();
              const handler = new TemplateHandler();
              const doc = await handler.process(templateFile, data);
              saveFile(`Doc${item.id} - ${item.Nombre}.docx`, doc);
            } 
            */


          }
        } catch (error) {
          console.log(
            "No se ha podido descargar el documento por el siguiente error: " +
              error
          );
        }
      })
    );
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
      } else return;
    }, 0);
  }

  const handleFileSelect = ( file: any ) => {
    setSelectedFile(file[0]);
  };

  return (
    <StyletronProvider value={engine}>
      <div>
        <a target="_blank">
          <img src={excelLogo} className="logo excel" alt="Excel logo" />
        </a>
        <a target="_self">
          <img src={wordLogo} className="logo" alt="Word logo" />
        </a>
      </div>

      <h1>Excel to Word Template</h1>

      {docData && docData.length === 0 && (
        <p className="read-the-docs">
          {" "}
          First, you need to upload an Excel file...{" "}
        </p>
      )}

      <div className="card">
        <FileUploader
          errorMessage={errorMessage}
          accept=".xlsx"
          onDrop={handleFileUpload}
          name="Uploader"
        />

        {docData && docData.length > 0 && (
          <p className="read-the-docs">
            {" "}
            Press the button to download transformed files!{" "}
          </p>
        )}

        {docData && docData.length > 0 && (
          <Button style={{ marginTop: 0 }} onClick={DownloadNewDocs}>
            {" "}
            Download Docx{" "}
          </Button>
        )}

      </div>
      <div className="wave-container">
        <Waves />
      </div>
    </StyletronProvider>
  );
}

export default App;
