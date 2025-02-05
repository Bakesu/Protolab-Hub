import { FC, useEffect, useState } from "react";
import { LineChart, Line } from 'recharts';

import '../../App.css';
import "./Admin.css"
import Navbar from "../../components/Navbar/Navbar"
import { PrinterDTO } from "../../interfaces";
import Dashboard from "../../components/Dashboard/Dashboard";


interface Props {

}

const AdminPage: FC<Props> = (props) => {
    const [isLoading, setIsLoading] = useState(true);
    const [livePrinterData, setLivePrinterData] = useState<PrinterDTO[]>([])

    useEffect(() => { // TODO: Mangler error handling - eks hvis der er ingen printere
      const interval = setInterval(() => {
        fetch("/api/printers/livedata").then(response =>
          response.json().then((data) => {
            const result: PrinterDTO[] = []
            data.forEach((printerData: PrinterDTO) => {
              const tempBed = printerData.temp_bed;
              const progressPrinter = printerData.progress;

              if (tempBed == null) {
                printerData.status = "Offline"
              } else if (tempBed != null && progressPrinter == null) {
                printerData.status = "Available"
              } else if (progressPrinter != null) {
                printerData.status = "Printing"
              }
              result.push(printerData)
            });
            setLivePrinterData(result);
            setIsLoading(false);
            //console.log(data);
          }))
      }, 5000);
      return () => {clearInterval(interval)};
    }, []);

      let dashboardContent;
      if (isLoading) {
        dashboardContent = <h1 className='loading'>Loading...</h1>; // TODO: Evt lave en spinning wheel
      } else {
        dashboardContent = <Dashboard livePrinterData={livePrinterData}/>
      }

    return (
        <div className="admin-container">
            <Navbar />
            {dashboardContent}
        </div>
    );
}
//<Navbar />

export default AdminPage;