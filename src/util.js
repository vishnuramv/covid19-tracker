import { Circle, Popup } from 'react-leaflet';
import React from 'react';
import numeral from 'numeral';

const casesTypeColor = {
    cases : {
        hex : "#CC1034",
        multiplier : 400,
    },
    recovered : {
        hex : "#7DD71D",
        multiplier : 300,
    },
    deaths : {
        hex : "#fb4443",
        multiplier : 1000,
    },
}

export const sortData = (data) => {
    const sortedData = [...data];
    return sortedData.sort((a,b) => a.cases > b.cases ? -1 : 1);
};

export const showDataOnMap = (data, casesType="cases") => (
    data.map(country => (
        <Circle 
        center={[ country.countryInfo.lat, country.countryInfo.long ]}
        fillOpacity={0.4}
        fillColor={casesTypeColor[casesType].hex}
        color={casesTypeColor[casesType].hex}
        radius={Math.sqrt(country[casesType]) * casesTypeColor[casesType].multiplier}
        key={country.country}
        >
            <Popup>
                <div className="popup__container" >
                    <div className="popup__flag" style={{ backgroundImage:`url(${country.countryInfo.flag}` }}></div>
                    <h1 className="popup__name" >{country.country}</h1>
                    <h3 className="popup__confirmed" >Cases: {numeral(country.cases).format("0,0")}</h3>
                    <h3 className="popup__recovered" >Recovered: {numeral(country.recovered).format("0,0")}</h3>
                    <h3 className="popup__deaths" >Deaths: {numeral(country.deaths).format("0,0")}</h3>
                </div>
            </Popup>
        </Circle>
    ))
);

export const prettyPrintStats = (stat) => stat ? `+${numeral(stat).format("0.0a")}` : "+0";