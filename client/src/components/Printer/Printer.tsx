import "./Printer.css"
import { PrinterDTO } from '../../interfaces'
import { FC, useEffect, useReducer, useState } from "react";
import Progressbar from '../Progressbar/Progressbar';
import Modal from '../Modal/Modal';
import { convertMinutes } from "../../util"

interface Props {
    printer: PrinterDTO
}

const Printer: FC<Props> = (props) => {

    const [isOffline, setIsOffline] = useState(false);
    const [isAvailable, setIsAvailable] = useState(false);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        let tempBed = props.printer.temp_bed;
        let progressPrinter = props.printer.progress;

        if (tempBed == null) {
            setIsOffline(true);
            setIsAvailable(false);
            setIsRunning(false);
            console.log("changed state to offline")
        } else if (tempBed != null && progressPrinter == null) {
            setIsOffline(false);
            setIsAvailable(true);
            setIsRunning(false);
            console.log("changed state to available")
        } else if (progressPrinter != null) {
            setIsOffline(false);
            setIsAvailable(false);
            setIsRunning(true);
            console.log("changed state to running")
        }
    }, [props.printer])

    let printerContent, printerStatus, availabilityColor, printTimeLeft;

    if (isOffline) {
        printerStatus = "Offline"
        printerContent = <h3 title="Printer is offline">{printerStatus}</h3>
        availabilityColor = "#000000" // Black color
        printTimeLeft = <h3><br></br></h3>
    } else if (isAvailable) {
        printerStatus = "Available"
        printerContent = <h3 title="Printer is available">{printerStatus}</h3>
        availabilityColor = "#27AD17" // Green color
        printTimeLeft = <h3><br></br></h3>
    } else if (isRunning) {
        printerStatus = "Printing"
        printerContent = <h3 title="Printer is printing">{printerStatus}</h3>
        availabilityColor = "#FA2008" // Red color
        printTimeLeft = <h3>Print time left: {convertMinutes(props.printer.time_est / 60)}</h3>
    }

    return (
        <div className='item' style={{ borderColor: availabilityColor }}> {/*TODO: Ændre så det er en 3D printer og ikke rammen der ændre farve */}
            <h1 className="headingPrinter">Printer {props.printer._id}</h1>
            <div className="spacing"></div> 
            <Modal printer={props.printer} printerStatus={printerStatus}/>
            <div className="spacing"></div> 
            {printerContent}
            {printTimeLeft}
            <div className="progressBar">
            <Progressbar value={props.printer.progress} />
            </div>
        </div>
    );

}


export default Printer;

