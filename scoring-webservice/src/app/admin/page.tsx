'use client';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';

import Menu from '@mui/icons-material/Menu'
import AccountCircle from '@mui/icons-material/AccountCircle'

const Competition = {
    name: "Liberty Swing 2023",
    division: "Novice Jack & Jill",
};

function CompetitionCard() {
    return (
        <Card variant="outlined">
            <div>Competition:</div>
            <div>{Competition.name}</div>
            <div>{Competition.division}</div>
        </Card>
    )
}

function Header() {
    return (
        <AppBar position="static">
            <Toolbar variant="regular">
                <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                    <Menu/>
                </IconButton>
                <Typography variant="h6" color="inherit" component="div">
                    {Competition.name}
                </Typography>
            </Toolbar>
        </AppBar>
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