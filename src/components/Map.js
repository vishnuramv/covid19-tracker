import { Card, CardContent } from '@material-ui/core';
import React from 'react';
import { Map as LeafletMap, TileLayer } from 'react-leaflet';
import { showDataOnMap } from '../util';
import './Map.css'
function Map({ countries, casesType, center, zoom}) {
    return (
        <Card className="map">
            <CardContent className="map__container">
                <LeafletMap center={center} zoom={zoom} >
                    <TileLayer 
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetmap</a> contributors'
                    />
                    {showDataOnMap(countries, casesType)}
                </LeafletMap>
            </CardContent>
        </Card>
    )
}

export default Map
