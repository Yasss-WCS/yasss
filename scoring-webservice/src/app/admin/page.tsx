'use client';
import * as mui from '@mui/material';
import * as muiIcons from '@mui/icons-material'

const Competition = {
    name: "Liberty Swing 2023",
    division: "Novice Jack & Jill",
};

function CompetitionCard() {
    return (
        <mui.Card variant="outlined">
            <div>Competition:</div>
            <div>{Competition.name}</div>
            <div>{Competition.division}</div>
        </mui.Card>
    )
}

function Header() {
    return (
        <mui.AppBar position="static">
            <mui.Toolbar variant="dense">
                <mui.IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                    <muiIcons.Menu/>
                </mui.IconButton>
                <mui.Typography variant="h6" color="inherit" component="div">
                    {Competition.name}
                </mui.Typography>
            </mui.Toolbar>
        </mui.AppBar>
    )
}

export default function admin() {
    return (
    <main>
        <Header/>
        <CompetitionCard/>
    </main>
    )
}