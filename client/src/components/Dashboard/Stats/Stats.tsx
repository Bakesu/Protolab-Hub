import { Button, Divider, Paper } from "@mui/material";
import { FC, JSXElementConstructor, ReactElement, ReactFragment, ReactPortal, useEffect, useState } from "react";
import { Pie, PieChart, ResponsiveContainer } from "recharts";

import "../Dashboard.css"
import "./Stats.css"

interface MaterialUsageDTO {
    name: string,
    procent: number
}

interface StatsProps {

}

const Stats: FC<StatsProps> = () => {
    const [uptimeData, setUptimeArray] = useState<number[]>([])
    const [queryStartDate, setQueryStartDate] = useState<string>('2022-11-26')
    const [materialUsageData, setMaterialUsageData] = useState<MaterialUsageDTO[]>([])
    const [oneDayBTNIsDisabled, setOneDayBTNIsDisabled] = useState<boolean>(false)
    const [sevenDayBTNIsDisabled, setSevenDayBTNIsDisabled] = useState<boolean>(true)

    const materialFakeData = [
        { name: "PLA", procent: 30 },
        { name: "PETG", procent: 55 },
        { name: "ABS", procent: 15 },
    ]

    useEffect(() => { // TODO: Mangler error handling - eks hvis der er ingen printere
        const todayDate = new Date()
        todayDate.setDate(todayDate.getDate() + 1); //Getting the tommorrow date
        const tomorrowDateAsISO = todayDate.toISOString().slice(0, 10);
        fetch(`api/printers/uptime?startdate=${queryStartDate}&enddate=${tomorrowDateAsISO}`).then(response =>
            response.json().then(data => {
                setUptimeArray(data)
                console.log(uptimeData)
            }))
    }, [queryStartDate])


    useEffect(() => { // TODO: Mangler error handling - eks hvis der er ingen printere
        fetch(`/api/printers/material`).then(response =>
            response.json().then(data => {
                setMaterialUsageData(data)
                console.log(materialUsageData)
            }))
    }, [])

    useEffect(() => {
        console.log(materialUsageData)
    }, [uptimeData])

    function renderUptime() {
        let uptimeArray: JSX.Element[] = [];
        uptimeData.forEach((uptimeProcent, index) => {
            uptimeArray.push(<h4>Printer{index + 1}: {Math.round(uptimeProcent)}%</h4>)
        });
        return uptimeArray;
    }

    function setStartDateInDeltaDays(days: number) {
        const todayDate = new Date()
        const yesterdayDate = todayDate
        yesterdayDate.setDate(todayDate.getDate() - days)
        setQueryStartDate(yesterdayDate.toISOString().slice(0, 16))
    }

    const renderCustomizedLabel = (props: { x: any, y: any, cx: any, name: any, value: any }) => {
        return (
            <text x={props.x} y={props.y} fill="black" textAnchor={props.x > props.cx ? 'start' : 'end'} dominantBaseline="central">
                {props.name}: {props.value}%
            </text>
        );
    };

    return (
        <Paper elevation={2} className='stats-container'>
            <div className="uptime stats-sub-container">
                <h2>Busy Printing</h2>
                <p>Procentage of printers printing</p>
                
                <p className="filter-p"><b>Filter:</b></p> 
                <Button variant="contained" sx={{ mr: 1 }} size="small" disabled = {oneDayBTNIsDisabled}
                    onClick={() => {
                        setStartDateInDeltaDays(1)
                        setSevenDayBTNIsDisabled(false)
                        setOneDayBTNIsDisabled(true)
                        }}>
                1 day
                </Button>
                <Button variant="contained" size="small" disabled = {sevenDayBTNIsDisabled}
                    onClick={() => {
                        setStartDateInDeltaDays(7)
                        setSevenDayBTNIsDisabled(true)
                        setOneDayBTNIsDisabled(false)
                    }}>
                7 days
                </Button>
                {renderUptime()}
            </div>
            <Divider orientation="vertical" flexItem />
            <div className="material stats-sub-container">
                <h2>Material</h2>
                <p>Used material since 28/11</p>
                <div className="material-pie-chart-container">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart width={500} height={400}>
                            <Pie data={materialUsageData} dataKey="procent" cx="50%" cy="50%" outerRadius={60} fill="rgb(21, 101, 192)" labelLine={true} label={renderCustomizedLabel} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <Divider orientation="vertical" flexItem />
            <div className="popular-times stats-sub-container">
                <h2>Popular Times</h2>
                <h4>WIP</h4>
            </div>
        </Paper>
    );
}

export default Stats;