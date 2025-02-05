import { Button, Paper } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { PrinterDTO, TemperatureDTO } from "../../../interfaces";
import { formatISODate } from "../../../util";
import "../Dashboard.css"
import "./TempChart.css"

interface TempChartProps {
    livePrinterData: PrinterDTO[]
}


const TempChart: FC<TempChartProps> = (props) => {
    const [tempData, setTempData] = useState<any>([[]])
    const [queryStartDate, setQueryStartDate] = useState<string>('2022-11-26')
    const [minuteDatabase, setMinuteDatabase] = useState<string>('10min')
    const [oneDayBTNIsDisabled, setOneDayBTNIsDisabled] = useState<boolean>(false)
    const [sevenDayBTNIsDisabled, setSevenDayBTNIsDisabled] = useState<boolean>(true)
    const [hideLinesArray, setHideLinesArray] = useState<boolean[]>([false, false, false, false]) //TODO: Hardcoded

    const hexColorArray = ['#3e59f8', '#eb0000', '#00fe00', '#b86f15', '#ffff01']
    //const [chartData, setChartData] = useState<TemperatureDTO[]>([])

    useEffect(() => { // TODO: Mangler error handling - eks hvis der er ingen printere
        const todayDate = new Date()
        todayDate.setDate(todayDate.getDate() + 1); //Getting the tommorrow date
        const tomorrowDateAsISO = todayDate.toISOString().slice(0, 10);
        fetch(`api/printers/${minuteDatabase}/temperature?startdate=${queryStartDate}&enddate=${tomorrowDateAsISO}`).then(response =>
            response.json().then(data => {
                setTempData(data)
                console.log(tempData)
            }))
    }, [queryStartDate])

    useEffect(() => {
        console.log(tempData)
    }, [tempData])

    function renderLines() {
        let linesArray: JSX.Element[] = [];
        tempData.forEach((temperatureDTOArray: TemperatureDTO[], index: number) => {
            linesArray.push(
                <Line type="monotone"
                    data={temperatureDTOArray}
                    dataKey="temp_nozzle"
                    name={`Printer ${index + 1}`}
                    stroke={hexColorArray[index]}
                    connectNulls={true}
                    dot={false}
                    hide={hideLinesArray[index]}
                />
            );
        });
        return linesArray
    }

    function setStartDateInDeltaDays(days: number) {
        const todayDate = new Date()
        const yesterdayDate = todayDate
        yesterdayDate.setDate(todayDate.getDate() - days)
        setQueryStartDate(yesterdayDate.toISOString().slice(0, 16))
    }

    function selectLine(e: any) {
        const newHideLinesArray = hideLinesArray.slice()
        for (let index = 0; index < hideLinesArray.length; index++) {
            if (e.value == `Printer ${index + 1}`) {
                newHideLinesArray[index] = !newHideLinesArray[index]
                setHideLinesArray(newHideLinesArray)
            }
        }
    }

    return (
        <Paper elevation={2} className='line-chart-container'>
            <div className="filter-container">
                <p className="filter-p"><b>Filter:</b></p>
                <div className="button-container">
                    <Button variant="contained" sx={{ mr: 1 }} size="small" disabled={oneDayBTNIsDisabled}
                        onClick={() => {
                            setMinuteDatabase('1min')
                            setStartDateInDeltaDays(1)
                            setOneDayBTNIsDisabled(true)
                            setSevenDayBTNIsDisabled(false)
                        }}>1 Day</Button>
                    <Button variant="contained" size="small" disabled={sevenDayBTNIsDisabled}
                        onClick={() => {
                            setMinuteDatabase('10min')
                            setStartDateInDeltaDays(7)
                            setOneDayBTNIsDisabled(false)
                            setSevenDayBTNIsDisabled(true)
                        }}>7 days</Button>
                </div>
            </div>
            <ResponsiveContainer width={"90%"} height={"90%"}>
                <LineChart width={600} height={400}>
                    <XAxis
                        dataKey="timestamp.$date"
                        tickFormatter={formatISODate}
                        allowDuplicatedCategory={false}
                        label={{ value: "Date .", position: 'insideBottomRight', offset: -8, style: { textAnchor: 'end', fontWeight: 'bold' } }}
                    />
                    <YAxis
                        label={{ value: 'Temperature(C)', angle: -90, position: 'insideLeft', offset: 5, style: { textAnchor: 'middle', fontWeight: 'bold' } }}
                    />
                    <Tooltip labelFormatter={value => {
                        return formatISODate(value);
                    }} />
                    <Legend
                        onClick={selectLine}
                    />
                    {renderLines()}
                </LineChart>
            </ResponsiveContainer>
        </Paper>
    );
}

export default TempChart;
function componentDidUpdate() {
    throw new Error("Function not implemented.");
}

// https://github.com/recharts/recharts/issues/590
// https://codesandbox.io/s/recharts-with-legend-toggle-dqlts?file=/src/BarGraph.js
// 