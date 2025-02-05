import React from "react";
import { FC, useEffect, useState } from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

import "./Dashboard.css";
import { PrinterDTO } from "../../interfaces";
import TempChart from "./TempChart/TempChart";
import Stats from "./Stats/Stats";
import LiveDataTable from "./LiveDataTable/LiveDataTable";

interface Props {
    livePrinterData: PrinterDTO[]
}

// MQTT TUT: https://www.emqx.com/en/blog/how-to-use-mqtt-in-react && https://www.npmjs.com/package/mqtt#typescript

const Dashboard: FC<Props> = (props) => {

    let chartData: any[];

    return (
        <div className="dashboard-container">

            <TempChart livePrinterData={props.livePrinterData} />
            <LiveDataTable livePrinterData={props.livePrinterData} />
            <Stats />
        </div>
    );
}

export default Dashboard;

/*
                    <ResponsiveContainer width="80%" height="80%">
                        <LineChart width={400} height={200} data={props.livePrinterData}>
                            <Line type="monotone" dataKey="temp_nozzle" stroke="#8884d8" />
                        </LineChart>
                    </ResponsiveContainer>
*/