import { Card, CardContent, Typography } from '@material-ui/core';
import React from 'react';
import './InfoBox.css';

function InfoBox({ title, cases, total, active, color, ...props }) {
    return (
        <Card onClick={props.onClick} className={`infoBox ${active && 'infoBox--selected'} ${'infoBox--' + color}`}>
            <CardContent>
                <Typography className="infoBox__title" color="textSecondary" >
                    {title}
                </Typography>
                <h2 className={`infoBox__cases ${'infoBox--text' + color}`}>{cases}</h2>
                <Typography className="infoBox__total" color="textSecondary" >
                    {total} Total
                </Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox
