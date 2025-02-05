import React, { FC } from 'react';
import { PrinterDTO } from '../../interfaces';
import Printer from '../Printer/Printer';
import "./PrinterContainer.css"


interface Props {
  printers: PrinterDTO[]
  name: string
}

export const PrinterContainer: FC<Props> = (props) => { // Forklaring: https://youtu.be/ydkQlJhodio?t=233

  return (
    <div className='container'>
      
      {
        props.printers.map(printer => (
          <Printer printer={printer} />
        ))
      }

    </div>
  )
}