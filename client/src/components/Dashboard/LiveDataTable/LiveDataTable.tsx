import { Paper, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { FC } from "react";
import { PrinterDTO } from "../../../interfaces";
import "./LiveDataTable.css"
import { convertMinutes } from "../../../util"

interface LiveDataTableProps {
    livePrinterData: PrinterDTO[]
}
 
const LiveDataTable: FC<LiveDataTableProps> = (props) => {
    return ( 
        <Paper elevation={2} className='table-container'>
        <h2>Live Printer Data</h2>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Status</TableCell>
                    <TableCell align="right">Temperature Nozzle</TableCell>
                    <TableCell align="right">Temperature Bed</TableCell>
                    <TableCell align="right">Progress</TableCell>
                    <TableCell align="right">Time left</TableCell>
                    <TableCell align="right">Material</TableCell>
                    <TableCell align="left">Project Name</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {props.livePrinterData.map((printer: PrinterDTO) => (
                    <TableRow
                        key={printer.printer_name}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <TableCell component="th" scope="printer">
                            {printer.printer_name}
                        </TableCell>
                        <TableCell align="right">{printer.status}</TableCell>
                        <TableCell align="right">{printer.temp_nozzle}°</TableCell>
                        <TableCell align="right">{printer.temp_bed}°</TableCell>
                        <TableCell align="right">{printer.progress ? printer.progress + "%" : ""}</TableCell>
                        <TableCell align="right">{printer.progress ? convertMinutes(printer.time_est/60) : ""}</TableCell>
                        <TableCell align="right">{printer.progress ? printer.material : ""}</TableCell>
                        <TableCell align="left">{printer.project_name}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </Paper>
    );
}
 
export default LiveDataTable;