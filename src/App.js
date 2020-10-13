import { Card, CardContent, FormControl, MenuItem, Select } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import './App.css';
import InfoBox from './components/InfoBox';
import LineGraph from './components/LineGraph';
import Map from './components/Map';
import Table from './components/Table';
import { prettyPrintStats, sortData } from './util';
import 'leaflet/dist/leaflet.css';

function App() {
  const [countries, setCountries] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat : 27, lng : 77 });
  const [mapZoom, setMapZoom] = useState(2);
  const [casesType, setCasesType] = useState('cases');

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries").then((response) => response.json()).then((data) => {
        const countries = data.map((country) => (
          {
            name : country.country,
            value : country.countryInfo.iso2,
          }
        ));
        const sortedData = sortData(data);
        setTableData(sortedData);
        setMapCountries(data);
        setCountries(countries);
      });
    };
    getCountriesData();
  }, []);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all").then(response => response.json()).then(data => {
      setCountry("worldwide");
      setCountryInfo(data);
    });
  }, [])

  const onCountryChange = async (event) => {
    event.preventDefault();
    const countryCode = event.target.value;
    const url = countryCode === "worldwide" ? "https://disease.sh/v3/covid-19/all" : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url).then(response => response.json()).then(data => {
      setCountry(countryCode);
      setCountryInfo(data);
      setMapZoom(4);
      countryCode !== "worldwide" && setMapCenter([ data.countryInfo.lat, data.countryInfo.long ]);
    });
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          {/* eslint-disable-next-line jsx-a11y/accessible-emoji */}
          <h1>COVID-19 TRACKER 🦠 ☣️</h1>
          <FormControl className="app__dropdown">
            <Select variant="outlined" value={country} onChange={onCountryChange}>
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {
                countries.map(country => (
                  <MenuItem key={country.value} value={country.value}>{country.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox active={casesType === "cases"} color="red" onClick={e => setCasesType("cases")} title="Current cases" cases={prettyPrintStats(countryInfo.todayCases)} total={prettyPrintStats(countryInfo.cases)} />
          <InfoBox active={casesType === "recovered"} color="green" onClick={e => setCasesType("recovered")} title="Recovered" cases={prettyPrintStats(countryInfo.todayRecovered)} total={prettyPrintStats(countryInfo.recovered)} />
          <InfoBox active={casesType === "deaths"} color="orange" onClick={e => setCasesType("deaths")} title="Deaths" cases={prettyPrintStats(countryInfo.todayDeaths)} total={prettyPrintStats(countryInfo.deaths)} />
        </div>

        <Map casesType={casesType} countries={mapCountries} center={mapCenter} zoom={mapZoom} />
      </div>
      <Card className="app__right">
        <CardContent>
          <h3 className="app__tableTitle">Live cases by Countries</h3>
          <Table countries={tableData} />
          <h3 className="app__graphTitle">Worldwide {casesType.charAt(0).toUpperCase() + casesType.slice(1)}</h3>
          <LineGraph casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
