import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import numeral from 'numeral';
import './LineGraph.css'

const options = {
    legend : {
        display : false,
    },
    element : {
        points : {
            radius : 0,
        },
    },
    maintainAspectRatio : false,
    tooltips : {
        mode : "index",
        intersect : false,
        callbacks : {
            lable : function (tooltipItem, data) {
                return numeral(tooltipItem.value).format("+0,0");
            }
        }
    },
    scales : {
        xAxes : [{
            type : "time",
            time : {
                parser : "MM/DD/YY",
                tooltipFormat : "ll",
            },
        },],
        yAxes : [{
            girdLines : {display : false,},
            ticks : {
                callback : function (value, index, values) {
                    return numeral(value).format("0a");
                },
            },
        },],
    }
};
const casesTypeColor = {
    cases : {
        border : "#CC1034",
        fill : "rgba(204, 16, 52, 0.5)",
    },
    recovered : {
        border : "#7DD71D",
        fill : "rgba(154, 221, 78, 0.5)",
    },
    deaths : {
        border : "#fb4443",
        fill : "rgba(251, 68, 67, 0.5)",
    },
}

function LineGraph({casesType = "cases"}) {
    const [data, setData] = useState({});

    const buildChartData = (data, casesType) => {
        let chartData = [];
        let lastDataPoint;

        for (let date in data.cases) {
            if (lastDataPoint) {
                let newDataPoint = {
                    x : date,
                    y : data[casesType][date] - lastDataPoint
                };
                chartData.push(newDataPoint);
            }
            lastDataPoint = data[casesType][date];
        }
        return chartData;
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120").then(response => response.json()).then(data => {
                let chartData = buildChartData(data, casesType);
                setData(chartData);
            });
        };
        fetchData();
    }, [casesType]);
    
    return (
        <div className="lineGraph">
            {data?.length > 0 && (
                <Line className="lineGraph__graph" options={options} data={{
                    datasets : [{
                        data : data,
                        backgroundColor : casesTypeColor[casesType].fill,
                        borderColor :  casesTypeColor[casesType].border
                    }]
                }} />
            )}
        </div>
    )
}

export default LineGraph
