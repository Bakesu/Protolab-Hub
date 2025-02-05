import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { PrinterDTO, TemperatureDTO } from '../../interfaces'
import "./Modal.css"
import Progressbar from '../Progressbar/Progressbar';
import { FC, useEffect, useState } from 'react';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Paper } from '@mui/material';
import { convertMinutes, formatISODate } from '../../util';



interface Props {
  printer: PrinterDTO
  printerStatus?: string
}

const style = { // TODO: Smid i CSS fil
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1000,
  height: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const BasicModal: FC<Props> = (props) => {

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [liveTempData, setLiveTempData] = useState<TemperatureDTO[]>([])

  useEffect(() => {
    const newLiveTempData: TemperatureDTO = {
      timestamp: props.printer.timestamp,
      temp_bed: props.printer.temp_bed,
      temp_nozzle: props.printer.temp_nozzle
    }
    setLiveTempData((liveTempData => [...liveTempData, newLiveTempData] ));
  }, [props])

  function formatXAxisDecorator(tickItem: string, index: number): string {
    const formattedXAxis = formatISODate(tickItem, index)
    return formattedXAxis.slice(9, 14)
}

  let tempBed: number = props.printer.temp_bed!; // Telling Typescript that this value will never be null or undefined // https://bobbyhadz.com/blog/typescript-type-undefined-is-not-assignable-to-type-number
  return (
    <div >
      <div className="modal-button">
      <Button variant="contained" onClick={handleOpen}>Printer information</Button>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="modal-box">
          <div className='modal-container'>
            <div className='modal-item' id='modal-left-side'>
              <h3>Printer: {props.printer._id}</h3>
              <h3>Status: {props.printerStatus}</h3>
              <h3>File: {props.printer.project_name}</h3>
              <h3>Print time left: {convertMinutes(props.printer.time_est / 60)} min</h3>
              <h3>Filament: {props.printer.material}</h3>
              <h3>Temperature nozzle: {props.printer.temp_nozzle}°</h3>
              <h3>Temperature bed: {props.printer.temp_bed}°</h3>
              <Progressbar value={props.printer.progress} />
            </div>
            <div className='modal-item' id='modal-right-side'>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart width={600} height={200} data={liveTempData}>
                  <Line type="monotone" dataKey="temp_nozzle" stroke="#eb0000" dot={false}/>
                  <XAxis 
                        dataKey="timestamp.$date" 
                        tickFormatter={formatXAxisDecorator} 
                        label={{ value: "Date .", position: 'insideBottomRight', offset: -8, style: { textAnchor: 'end', fontWeight: 'bold'} }}
                    />
                    <YAxis 
                        label={{ value: 'Temperature(C)', angle: -90, position: 'insideLeft', offset: 5, style: { textAnchor: 'middle', fontWeight: 'bold' } }}
                    />
                    < Legend />
                    <Tooltip />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default BasicModal;
function formatXAxisDecorator() {
  throw new Error('Function not implemented.');
}

