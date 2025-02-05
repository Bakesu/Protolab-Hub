import React, { FC, useEffect, useState } from 'react';
import './Home.css';
import '../../App.css';
import Navbar from '../../components/Navbar/Navbar';
import { PrinterContainer } from '../../components/PrinterContainer/PrinterContainer';
import { PrinterDTO } from "../../interfaces";

interface Props {

}

const HomePage: FC<Props> = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [printersData, setPrinters] = useState<PrinterDTO[]>([])

  useEffect(() => { // TODO: Mangler error handling - eks hvis der er ingen printere
    const interval = setInterval(() => {
      fetch("/api/printers/livedata").then(response =>
        response.json().then(data => {
          setPrinters(data);
          setIsLoading(false);
          //console.log(data);
        }))
    }, 5000);
    return () => {clearInterval(interval)};
  }, []);

  let printerContent;
  if (isLoading) {
    printerContent = <h1 className='loading'>Loading...</h1>; // TODO: Evt lave en spinning wheel
  } else {
    printerContent = <PrinterContainer printers={printersData} name="Protolabhub" />
  }

  return (
    <div className="App">
      <Navbar />
      {printerContent}
    </div>
  );
}

// {printers.map((printer: any, i: any)=> (<div key={i}>{printer[0]}</div>))}
// <PrinterContainer printers={printers} name="Protolabhub" />

export default HomePage;

